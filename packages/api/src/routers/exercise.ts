import { db, eq } from "@buddy-lifts/db";
import { exercise, training } from "@buddy-lifts/db/schema/training";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { protectedProcedure, router } from "../index";

/**
 * Exercise Router - Hybrid Pattern: Mutations Only
 *
 * This router only contains mutations (create, update, delete).
 * For reading exercises, use Supabase client directly for better performance
 * and real-time capabilities.
 *
 * See HYBRID_PATTERN.md for more details.
 */
export const exerciseRouter = router({
	/**
	 * Create a new exercise for a training
	 * Requires authentication and ownership of the training
	 */
	create: protectedProcedure
		.input(
			z.object({
				trainingId: z.string(),
				name: z.string().min(1, "Exercise name is required"),
				targetSets: z.number().int().min(1, "Target sets must be at least 1"),
				targetReps: z.number().int().min(1, "Target reps must be at least 1"),
				weight: z.number().int().nonnegative().optional(),
				order: z.number().int().min(0),
				restSeconds: z.number().int().nonnegative().optional(),
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

			const newExercise = await db
				.insert(exercise)
				.values({
					trainingId: input.trainingId,
					name: input.name,
					targetSets: input.targetSets,
					targetReps: input.targetReps,
					weight: input.weight,
					order: input.order,
					restSeconds: input.restSeconds,
				})
				.returning();

			return newExercise[0];
		}),

	/**
	 * Create multiple exercises in bulk for a training
	 * Requires authentication and ownership of the training
	 */
	createMany: protectedProcedure
		.input(
			z.object({
				trainingId: z.string(),
				exercises: z.array(
					z.object({
						name: z.string().min(1, "Exercise name is required"),
						targetSets: z.number().int().min(1),
						targetReps: z.number().int().min(1),
						weight: z.number().int().nonnegative().optional(),
						order: z.number().int().min(0),
						restSeconds: z.number().int().nonnegative().optional(),
					}),
				),
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

			const exercisesToInsert = input.exercises.map((ex) => ({
				trainingId: input.trainingId,
				name: ex.name,
				targetSets: ex.targetSets,
				targetReps: ex.targetReps,
				weight: ex.weight,
				order: ex.order,
				restSeconds: ex.restSeconds,
			}));

			const newExercises = await db
				.insert(exercise)
				.values(exercisesToInsert)
				.returning();

			return newExercises;
		}),

	/**
	 * Update an existing exercise
	 * Only the training owner can update exercises
	 */
	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().min(1).optional(),
				targetSets: z.number().int().min(1).optional(),
				targetReps: z.number().int().min(1).optional(),
				weight: z.number().int().nonnegative().optional(),
				order: z.number().int().min(0).optional(),
				restSeconds: z.number().int().nonnegative().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { id, ...updates } = input;

			// Check if the exercise exists and belongs to a training owned by the user
			const existingExercise = await db.query.exercise.findFirst({
				where: eq(exercise.id, id),
				with: {
					training: true,
				},
			});

			if (!existingExercise) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Exercise not found",
				});
			}

			if (existingExercise.training.userId !== ctx.session.user.id) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You can only update exercises in your own trainings",
				});
			}

			const updated = await db
				.update(exercise)
				.set(updates)
				.where(eq(exercise.id, id))
				.returning();

			return updated[0];
		}),

	/**
	 * Delete an exercise
	 * Only the training owner can delete exercises
	 */
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			// Check if the exercise exists and belongs to a training owned by the user
			const existingExercise = await db.query.exercise.findFirst({
				where: eq(exercise.id, input.id),
				with: {
					training: true,
				},
			});

			if (!existingExercise) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Exercise not found",
				});
			}

			if (existingExercise.training.userId !== ctx.session.user.id) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You can only delete exercises from your own trainings",
				});
			}

			await db.delete(exercise).where(eq(exercise.id, input.id));

			return { success: true };
		}),

	/**
	 * Delete all exercises for a training
	 * Only the training owner can delete all exercises
	 * Useful when replacing all exercises in a training
	 */
	deleteByTraining: protectedProcedure
		.input(z.object({ trainingId: z.string() }))
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
					message: "You can only delete exercises from your own trainings",
				});
			}

			await db
				.delete(exercise)
				.where(eq(exercise.trainingId, input.trainingId));

			return { success: true };
		}),
});
