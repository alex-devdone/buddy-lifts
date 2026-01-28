import { db, eq } from "@buddy-lifts/db";
import { training } from "@buddy-lifts/db/schema/training";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { protectedProcedure, router } from "../index";
import {
	exercisesToDbFormat,
	parseExerciseInput,
} from "../utils/exercise-parser";

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
