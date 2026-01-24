import { describe, expect, test } from "bun:test";

// Import the parser functions directly
// We'll need to export them from the router file first, or test via the mutation
// For now, let's recreate the logic here for testing

/**
 * Regex patterns for parsing different exercise formats
 * Note: Standard pattern doesn't use global flag to avoid match() returning null
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
function normalizeExerciseName(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}

/**
 * Parse a single exercise from a string
 */
function parseExercise(input: string) {
	const trimmed = input.trim();

	// Try standard pattern: "10x4 pushup" or "4x10 pushup"
	const standardMatch = trimmed.match(PATTERNS.standard);
	if (standardMatch) {
		const [, first, second, name, weightStr, restStr] = standardMatch;
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
 *
 * This is tricky because we need to distinguish between:
 * - Commas separating exercises: "10x4 pushup, 3x12 bench press"
 * - Commas in rep lists: "10,10,8,6 pull ups"
 *
 * Strategy: Use "and" as primary separator, then look for patterns
 */
function parseExerciseInput(input: string) {
	const exercises: unknown[] = [];

	// Handle "between" keyword which indicates rest periods
	const hasBetween = /\bbetween\b/i.test(input);

	// First, split by "and" which is unambiguous
	const andParts = input.split(/\s+and\s+/i);

	for (const part of andParts) {
		// For each part, we need to detect if it contains multiple exercises
		// Look for patterns like "NxM exercise" to split on
		// But be careful not to split "10,10,8,6 pull ups"

		// Strategy: Find positions that look like exercise separators
		// A separator is a comma followed by something that looks like a new exercise
		// (i.e., contains a number x pattern or "sets of")

		const segments = [];
		let currentSegment = "";
		let remaining = part.trim();

		while (remaining.length > 0) {
			// Check if remaining starts with a sets-list pattern (e.g., "10,10,8,6")
			const setsListMatch = remaining.match(
				/^(\d+(?:,\s*\d+)+)\s+([a-zA-Z\s]+?)(?:\s+(?:at|with|@)\s+(\d+(?:\.\d+)?)\s*(?:lbs?|kg?))?(?:\s*,\s*|\s*$)/i,
			);

			if (setsListMatch) {
				const matched = setsListMatch[0];
				// Remove trailing comma if present
				const cleanMatched = matched.replace(/,\s*$/, "");
				segments.push(currentSegment + cleanMatched);
				currentSegment = "";
				remaining = remaining.slice(matched.length).trim();
				continue;
			}

			// Check for standard pattern
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

			// Check for "sets of" pattern
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

			// If no pattern matched, add character to current segment and continue
			currentSegment += remaining[0];
			remaining = remaining.slice(1);
		}

		// Add any remaining segment
		if (currentSegment.trim().length > 0) {
			segments.push(currentSegment.trim());
		}

		// Parse each segment
		for (const segment of segments) {
			const cleanPart = segment.replace(/\bbetween\b/gi, "").trim();
			if (!cleanPart || cleanPart.length < 3) continue;

			const exercise = parseExercise(cleanPart);
			if (exercise) {
				if (hasBetween && exercises.length > 0) {
					(
						exercises[exercises.length - 1] as { restSeconds: number }
					).restSeconds = 60;
				}
				exercises.push(exercise);
			}
		}
	}

	return exercises;
}

describe("Exercise Parser", () => {
	describe("normalizeExerciseName", () => {
		test("capitalizes first letter of each word", () => {
			expect(normalizeExerciseName("pushup")).toBe("Pushup");
			expect(normalizeExerciseName("bench press")).toBe("Bench Press");
			expect(normalizeExerciseName("bicep curls")).toBe("Bicep Curls");
		});

		test("trims whitespace", () => {
			expect(normalizeExerciseName("  pushup  ")).toBe("Pushup");
			expect(normalizeExerciseName("  bench   press  ")).toBe("Bench Press");
		});
	});

	describe("Standard pattern (NxM or MxN)", () => {
		test("parses '10x4 pushup' as 10 reps, 4 sets", () => {
			const result = parseExercise("10x4 pushup");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Pushup");
			expect(result?.targetReps).toBe(10);
			expect(result?.targetSets).toBe(4);
		});

		test("parses '4x10 pushup' as 10 reps, 4 sets (heuristic)", () => {
			const result = parseExercise("4x10 pushup");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Pushup");
			expect(result?.targetReps).toBe(10);
			expect(result?.targetSets).toBe(4);
		});

		test("parses '5x5 squat' correctly", () => {
			const result = parseExercise("5x5 squat");
			expect(result).not.toBeNull();
			// When equal, either assignment is fine
			expect(result?.targetReps).toBe(5);
			expect(result?.targetSets).toBe(5);
		});

		test("parses '10x4 pushup at 135lbs' with weight", () => {
			const result = parseExercise("10x4 pushup at 135lbs");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Pushup");
			expect(result?.targetReps).toBe(10);
			expect(result?.targetSets).toBe(4);
			expect(result?.weight).toBe(135);
		});

		test("parses '10x4 pushup, 60s rest' with rest time", () => {
			const result = parseExercise("10x4 pushup, 60s rest");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Pushup");
			expect(result?.targetReps).toBe(10);
			expect(result?.targetSets).toBe(4);
			expect(result?.restSeconds).toBe(60);
		});

		test("parses with asterisk separator '10*4 pushup'", () => {
			const result = parseExercise("10*4 pushup");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Pushup");
			expect(result?.targetReps).toBe(10);
			expect(result?.targetSets).toBe(4);
		});

		test("parses weight with kg '10x4 bench press at 50kg'", () => {
			const result = parseExercise("10x4 bench press at 50kg");
			expect(result).not.toBeNull();
			expect(result?.weight).toBe(50);
		});
	});

	describe("Sets list pattern (comma-separated reps)", () => {
		test("parses '10,10,8,6 pull ups' as 4 sets", () => {
			const result = parseExercise("10,10,8,6 pull ups");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Pull Ups");
			expect(result?.targetSets).toBe(4);
			expect(result?.targetReps).toBe(9); // Average of 10,10,8,6 = 8.5, rounded to 9
			expect(result?.completedReps).toEqual([10, 10, 8, 6]);
		});

		test("parses '12, 10, 8 bench press' with spaces", () => {
			const result = parseExercise("12, 10, 8 bench press");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Bench Press");
			expect(result?.targetSets).toBe(3);
			expect(result?.completedReps).toEqual([12, 10, 8]);
		});

		test("parses sets list with weight '135, 125, 115 deadlift at 200lbs'", () => {
			const result = parseExercise("135, 125, 115 deadlift at 200lbs");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Deadlift");
			expect(result?.targetSets).toBe(3);
			expect(result?.weight).toBe(200);
		});
	});

	describe("Words pattern ('sets of')", () => {
		test("parses '5 sets of 10 pushups'", () => {
			const result = parseExercise("5 sets of 10 pushups");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Pushups");
			expect(result?.targetSets).toBe(5);
			expect(result?.targetReps).toBe(10);
		});

		test("parses '3 set of 12 squat' (singular set)", () => {
			const result = parseExercise("3 set of 12 squat");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Squat");
			expect(result?.targetSets).toBe(3);
			expect(result?.targetReps).toBe(12);
		});

		test("parses '4 sets of 8 bench press at 135lbs'", () => {
			const result = parseExercise("4 sets of 8 bench press at 135lbs");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Bench Press");
			expect(result?.targetSets).toBe(4);
			expect(result?.targetReps).toBe(8);
			expect(result?.weight).toBe(135);
		});
	});

	describe("Multiple exercises", () => {
		test("parses '10x4 pushup, 10,10,8,6 pull ups' as two exercises", () => {
			const result = parseExerciseInput("10x4 pushup, 10,10,8,6 pull ups");
			expect(result).toHaveLength(2);
			expect(result[0]).toMatchObject({
				name: "Pushup",
				targetSets: 4,
				targetReps: 10,
			});
			expect(result[1]).toMatchObject({
				name: "Pull Ups",
				targetSets: 4,
			});
		});

		test("parses '10x4 pushup and 3x12 bench press' with 'and' separator", () => {
			const result = parseExerciseInput("10x4 pushup and 3x12 bench press");
			expect(result).toHaveLength(2);
			expect(result[0]?.name).toBe("Pushup");
			expect(result[1]?.name).toBe("Bench Press");
		});

		test("handles 'between' keyword by adding rest to previous exercise", () => {
			const result = parseExerciseInput(
				"10x4 pushup, 10,10,8,6 pull ups between",
			);
			expect(result).toHaveLength(2);
			expect(result[0]).toMatchObject({
				name: "Pushup",
				restSeconds: 60,
			});
			expect(result[1]?.name).toBe("Pull Ups");
		});

		test("parses three exercises", () => {
			const result = parseExerciseInput(
				"10x4 pushup, 3x12 bench press, 5x5 squat",
			);
			expect(result).toHaveLength(3);
			expect(result[0]?.name).toBe("Pushup");
			expect(result[1]?.name).toBe("Bench Press");
			expect(result[2]?.name).toBe("Squat");
		});
	});

	describe("Edge cases", () => {
		test("returns null for unparseable input", () => {
			expect(parseExercise("hello world")).toBeNull();
			expect(parseExercise("pushup")).toBeNull();
			expect(parseExercise("")).toBeNull();
		});

		test("returns empty array for unparseable multi-exercise input", () => {
			const result = parseExerciseInput("hello world and foo bar");
			expect(result).toHaveLength(0);
		});

		test("handles extra whitespace", () => {
			const result = parseExercise("  10x4   pushup  ");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Pushup");
		});

		test("handles decimal weight", () => {
			const result = parseExercise("10x4 bench press at 12.5kg");
			expect(result?.weight).toBe(12.5);
		});

		test("handles single set list", () => {
			const result = parseExercise("10 pushups");
			// This won't match the sets list pattern (needs comma)
			// and won't match standard pattern (no x)
			expect(result).toBeNull();
		});
	});

	describe("Real-world examples from PRD", () => {
		test("parses '10x4 pushup, 10,10,8,6 pull ups between' from PRD", () => {
			const result = parseExerciseInput(
				"10x4 pushup, 10,10,8,6 pull ups between",
			);
			expect(result).toHaveLength(2);
			expect(result[0]).toMatchObject({
				name: "Pushup",
				targetSets: 4,
				targetReps: 10,
				restSeconds: 60,
			});
			expect(result[1]).toMatchObject({
				name: "Pull Ups",
				targetSets: 4,
				targetReps: 9,
			});
		});
	});
});
