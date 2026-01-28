/**
 * Exercise Parser Utilities - AI-Powered Text-to-Exercises
 */

/**
 * Represents a parsed exercise with all properties
 */
export interface ParsedExercise {
	name: string;
	targetSets: number;
	targetReps: number;
	weight?: number;
	restSeconds?: number;
	completedReps?: number[];
}

/**
 * Regex patterns for parsing different exercise formats
 */
const PATTERNS = {
	// "10x4 pushup" or "4x10 pushup" (setsxreps or repsxsets)
	standard:
		/(\d+)[xX*](\d+)\s+([a-zA-Z\s]+?)(?:\s+(?:at|with|@)\s+(\d+(?:\.\d+)?)\s*(?:lbs?|kg?))?\s*(?:,\s*(\d+)s?\s*rest)?$/i,

	// "10,10,8,6 pull ups" - comma separated reps
	setsList:
		/^(\d+(?:,\s*\d+)+)\s+([a-zA-Z\s]+?)(?:\s+(?:at|with|@)\s+(\d+(?:\.\d+)?)\s*(?:lbs?|kg?))?$/i,

	// "5 sets of 10 pushups"
	words:
		/^(\d+)\s+sets?\s+of\s+(\d+)\s+([a-zA-Z\s]+?)(?:\s+(?:at|with|@)\s+(\d+(?:\.\d+)?)\s*(?:lbs?|kg?))?$/i,
};

/**
 * Normalize exercise name (capitalize, trim)
 */
export function normalizeExerciseName(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}

/**
 * Parse a single exercise from a string
 */
export function parseExercise(input: string): ParsedExercise | null {
	const trimmed = input.trim();

	// Try standard pattern: "10x4 pushup" or "4x10 pushup"
	const standardMatch = trimmed.match(PATTERNS.standard);
	if (standardMatch) {
		const [, first, second, name, weightStr, restStr] = standardMatch;
		if (!first || !second || !name) return null;
		const firstNum = Number.parseInt(first, 10);
		const secondNum = Number.parseInt(second, 10);

		// Heuristic: reps are usually larger than sets, so assume first is reps if first > second
		const targetReps = firstNum >= secondNum ? firstNum : secondNum;
		const targetSets = firstNum >= secondNum ? secondNum : firstNum;

		return {
			name: normalizeExerciseName(name),
			targetSets,
			targetReps,
			weight: weightStr ? Number.parseFloat(weightStr) : undefined,
			restSeconds: restStr ? Number.parseInt(restStr, 10) : undefined,
		};
	}

	// Try sets list pattern: "10,10,8,6 pull ups"
	const setsListMatch = trimmed.match(PATTERNS.setsList);
	if (setsListMatch) {
		const [, repsStr, name, weightStr] = setsListMatch;
		if (!repsStr || !name) return null;
		const completedReps = repsStr
			.split(",")
			.map((s) => Number.parseInt(s.trim(), 10))
			.filter((n) => !Number.isNaN(n));

		if (completedReps.length === 0) return null;

		const avgReps = Math.round(
			completedReps.reduce((a, b) => a + b, 0) / completedReps.length,
		);

		return {
			name: normalizeExerciseName(name),
			targetSets: completedReps.length,
			targetReps: avgReps,
			weight: weightStr ? Number.parseFloat(weightStr) : undefined,
			completedReps,
		};
	}

	// Try words pattern: "5 sets of 10 pushups"
	const wordsMatch = trimmed.match(PATTERNS.words);
	if (wordsMatch) {
		const [, sets, reps, name, weightStr] = wordsMatch;
		if (!sets || !reps || !name) return null;
		return {
			name: normalizeExerciseName(name),
			targetSets: Number.parseInt(sets, 10),
			targetReps: Number.parseInt(reps, 10),
			weight: weightStr ? Number.parseFloat(weightStr) : undefined,
		};
	}

	return null;
}

/**
 * Parse natural language input into multiple exercises
 */
export function parseExerciseInput(input: string): ParsedExercise[] {
	const exercises: ParsedExercise[] = [];

	// Handle "between" keyword which indicates rest periods
	const hasBetween = /\bbetween\b/i.test(input);

	// First, split by "and" which is unambiguous
	const andParts = input.split(/\s+and\s+/i);

	for (const part of andParts) {
		const segments: string[] = [];
		let currentSegment = "";
		let remaining = part.trim();

		while (remaining.length > 0) {
			// Check if remaining starts with a sets-list pattern (e.g., "10,10,8,6")
			const setsListMatch = remaining.match(
				/^(\d+(?:,\s*\d+)+)\s+([a-zA-Z\s]+?)(?:\s+(?:at|with|@)\s+(\d+(?:\.\d+)?)\s*(?:lbs?|kg?))?(?:\s*,\s*|\s*$)/i,
			);

			if (setsListMatch) {
				const matched = setsListMatch[0];
				const cleanMatched = matched.replace(/,\s*$/, "");
				segments.push(currentSegment + cleanMatched);
				currentSegment = "";
				remaining = remaining.slice(matched.length).trim();
				continue;
			}

			const standardMatch = remaining.match(
				/(\d+)[xX*](\d+)\s+([a-zA-Z\s]+?)(?:\s+(?:at|with|@)\s+(\d+(?:\.\d+)?)\s*(?:lbs?|kg?))?(?:\s*,\s*|\s*$)/i,
			);

			if (standardMatch) {
				const matched = standardMatch[0];
				const cleanMatched = matched.replace(/,\s*$/, "");
				segments.push(currentSegment + cleanMatched);
				currentSegment = "";
				remaining = remaining.slice(matched.length).trim();
				continue;
			}

			const wordsMatch = remaining.match(
				/(\d+)\s+sets?\s+of\s+(\d+)\s+([a-zA-Z\s]+?)(?:\s+(?:at|with|@)\s+(\d+(?:\.\d+)?)\s*(?:lbs?|kg?))?(?:\s*,\s*|\s*$)/i,
			);

			if (wordsMatch) {
				const matched = wordsMatch[0];
				const cleanMatched = matched.replace(/,\s*$/, "");
				segments.push(currentSegment + cleanMatched);
				currentSegment = "";
				remaining = remaining.slice(matched.length).trim();
				continue;
			}

			currentSegment += remaining[0];
			remaining = remaining.slice(1);
		}

		if (currentSegment.trim().length > 0) {
			segments.push(currentSegment.trim());
		}

		for (const segment of segments) {
			const cleanPart = segment.replace(/\bbetween\b/gi, "").trim();
			if (!cleanPart || cleanPart.length < 3) continue;

			const exercise = parseExercise(cleanPart);
			if (exercise) {
				if (hasBetween && exercises.length > 0) {
					const lastExercise = exercises[exercises.length - 1];
					if (lastExercise) {
						lastExercise.restSeconds = 60;
					}
				}
				exercises.push(exercise);
			}
		}
	}

	return exercises;
}

/**
 * Convert parsed exercises to database format with proper ordering
 */
export function exercisesToDbFormat(exercises: ParsedExercise[]): Array<{
	name: string;
	targetSets: number;
	targetReps: number;
	weight?: number;
	order: number;
	restSeconds?: number;
}> {
	return exercises.map((ex, index) => ({
		name: ex.name,
		targetSets: ex.targetSets,
		targetReps: ex.targetReps,
		weight: ex.weight,
		order: index,
		restSeconds: ex.restSeconds,
	}));
}
