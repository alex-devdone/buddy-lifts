import { db, eq } from "@buddy-lifts/db";
import { training } from "@buddy-lifts/db/schema/training";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { protectedProcedure, router } from "../index";

/**
 * Exercise Parser Router - AI-Powered Text-to-Exercises
 *
 * Parses natural language input into structured exercise data.
 * Supports various formats like:
 * - "10x4 pushup" -> 4 sets of 10 pushups
 * - "10,10,8,6 pull ups" -> 4 sets with varying reps
 * - "5x12 bench press at 135lbs" -> 5 sets of 12 reps with weight
 *
 * Example input: "10x4 pushup, 10,10,8,6 pull ups between"
 */

/**
 * Represents a parsed exercise with all properties
 */
interface ParsedExercise {
	name: string;
	targetSets: number;
	targetReps: number;
	weight?: number;
	restSeconds?: number;
	completedReps?: number[]; // For "10,10,8,6" style input
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
function parseExercise(input: string): ParsedExercise | null {
	const trimmed = input.trim();

	// Try standard pattern: "10x4 pushup" or "4x10 pushup"
	const standardMatch = trimmed.match(PATTERNS.standard);
	if (standardMatch) {
		const [, first, second, name, weightStr, restStr] = standardMatch;
		// Determine which is sets and which is reps
		// Convention: "reps x sets" (e.g., 10x4 = 10 reps, 4 sets) is common in fitness
		// But "sets x reps" is also used, so we need to guess
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

		// Use average as target, or max if we want to be ambitious
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
function parseExerciseInput(input: string): ParsedExercise[] {
	const exercises: ParsedExercise[] = [];

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
				// If "between" was found and this is not the last exercise, add rest
				if (hasBetween && exercises.length > 0) {
					exercises[exercises.length - 1].restSeconds = 60; // Default 60s rest
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
function exercisesToDbFormat(exercises: ParsedExercise[]): Array<{
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

export const exerciseParserRouter = router({
	/**
	 * Parse natural language input into structured exercises
	 * Returns the parsed exercises without saving to database
	 */
	parse: protectedProcedure
		.input(
			z.object({
				input: z
					.string()
					.min(3, "Input must be at least 3 characters")
					.max(500, "Input too long"),
			}),
		)
		.mutation(({ input }) => {
			const exercises = parseExerciseInput(input.input);

			if (exercises.length === 0) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message:
						"Could not parse any exercises. Try formats like '10x4 pushup' or '5 sets of 10 bench press'",
				});
			}

			return {
				exercises: exercisesToDbFormat(exercises),
				count: exercises.length,
			};
		}),

	/**
	 * Parse and create exercises for a training in one operation
	 * Verifies training ownership before creating exercises
	 */
	parseAndCreate: protectedProcedure
		.input(
			z.object({
				trainingId: z.string(),
				input: z
					.string()
					.min(3, "Input must be at least 3 characters")
					.max(500, "Input too long"),
				replaceExisting: z.boolean().default(false).optional(), // If true, delete existing exercises first
			}),
		)
		.mutation(async ({ input, ctx }) => {
			// Verify the training exists and belongs to the user
			const existingTraining = await db.query.training.findFirst({
				where: eq(training.id, input.trainingId),
			});

			if (!existingTraining) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Training not found",
				});
			}

			if (existingTraining.userId !== ctx.session.user.id) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You can only add exercises to your own trainings",
				});
			}

			// Parse the input
			const exercises = parseExerciseInput(input.input);

			if (exercises.length === 0) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message:
						"Could not parse any exercises. Try formats like '10x4 pushup' or '5 sets of 10 bench press'",
				});
			}

			// Import here to avoid circular dependency
			const { exercise: exerciseTable } = await import(
				"@buddy-lifts/db/schema/training"
			);

			// If replaceExisting is true, delete existing exercises first
			if (input.replaceExisting) {
				await db
					.delete(exerciseTable)
					.where(eq(exerciseTable.trainingId, input.trainingId));
			}

			// Insert the new exercises
			const exercisesToInsert = exercisesToDbFormat(exercises).map((ex) => ({
				trainingId: input.trainingId,
				...ex,
			}));

			const created = await db
				.insert(exerciseTable)
				.values(exercisesToInsert)
				.returning();

			return {
				exercises: created,
				count: created.length,
			};
		}),
});
