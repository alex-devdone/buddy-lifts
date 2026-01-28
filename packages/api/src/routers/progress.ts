import { and, db, eq } from "@buddy-lifts/db";
import { exerciseProgress } from "@buddy-lifts/db/schema/training";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { protectedProcedure, router } from "../index";

/**
 * Progress Router - Record and manage exercise progress
 *
 * Handles recording exercise completion with actual reps,
 * calculating completion percentages, and managing progress entries.
 */
export const progressRouter = router({
	/**
	 * Record exercise progress for a session
	 * Users can only record their own progress
	 */
	record: protectedProcedure
		.input(
			z.object({
				sessionId: z.string(),
				exerciseId: z.string(),
				completedReps: z.array(z.number()).min(1), // Array of actual reps per set
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { sessionId, exerciseId, completedReps } = input;
			const userId = ctx.session.user.id;

			// Check if progress already exists for this user, session, and exercise
			const existing = await db.query.exerciseProgress.findFirst({
				where: and(
					eq(exerciseProgress.sessionId, sessionId),
					eq(exerciseProgress.userId, userId),
					eq(exerciseProgress.exerciseId, exerciseId),
				),
			});

			if (existing) {
				// Update existing progress
				const updated = await db
					.update(exerciseProgress)
					.set({
						completedReps: JSON.stringify(completedReps),
						completedAt: new Date(),
					})
					.where(eq(exerciseProgress.id, existing.id))
					.returning();

				return updated[0];
			}

			// Create new progress entry
			const newProgress = await db
				.insert(exerciseProgress)
				.values({
					sessionId,
					userId,
					exerciseId,
					completedReps: JSON.stringify(completedReps),
					completedAt: new Date(),
				})
				.returning();

			return newProgress[0];
		}),

	/**
	 * Update existing exercise progress
	 * Users can only update their own progress
	 */
	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				completedReps: z.array(z.number()).min(1),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { id, completedReps } = input;
			const userId = ctx.session.user.id;

			// Check if progress exists and belongs to the user
			const existing = await db.query.exerciseProgress.findFirst({
				where: eq(exerciseProgress.id, id),
			});

			if (!existing) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Progress entry not found",
				});
			}

			if (existing.userId !== userId) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You can only update your own progress",
				});
			}

			const updated = await db
				.update(exerciseProgress)
				.set({
					completedReps: JSON.stringify(completedReps),
					completedAt: new Date(),
				})
				.where(eq(exerciseProgress.id, id))
				.returning();

			return updated[0];
		}),

	/**
	 * Delete exercise progress
	 * Users can only delete their own progress
	 */
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const { id } = input;
			const userId = ctx.session.user.id;

			// Check if progress exists and belongs to the user
			const existing = await db.query.exerciseProgress.findFirst({
				where: eq(exerciseProgress.id, id),
			});

			if (!existing) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Progress entry not found",
				});
			}

			if (existing.userId !== userId) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You can only delete your own progress",
				});
			}

			await db
				.delete(exerciseProgress)
				.where(
					and(eq(exerciseProgress.id, id), eq(exerciseProgress.userId, userId)),
				);

			return { success: true };
		}),

	/**
	 * Get progress for a specific session
	 * Returns all progress entries for the session (for comparison view)
	 * Optionally filter by userId for individual progress
	 */
	getBySession: protectedProcedure
		.input(
			z.object({
				sessionId: z.string(),
				userId: z.string().optional(), // Optional: get specific user's progress
			}),
		)
		.query(async ({ input }) => {
			const { sessionId, userId: targetUserId } = input;

			// If targetUserId is provided, only return that user's progress
			// Otherwise return all progress for the session
			const whereCondition = targetUserId
				? and(
						eq(exerciseProgress.sessionId, sessionId),
						eq(exerciseProgress.userId, targetUserId),
					)
				: eq(exerciseProgress.sessionId, sessionId);

			const progressEntries = await db.query.exerciseProgress.findMany({
				where: whereCondition,
			});

			// Parse completedReps from JSON string to array
			return progressEntries.map((entry) => ({
				...entry,
				completedReps: JSON.parse(entry.completedReps) as number[],
			}));
		}),

	/**
	 * Calculate completion percentage for a progress entry
	 * Compares completed reps against target reps from exercise definition
	 */
	calculatePercentage: protectedProcedure
		.input(
			z.object({
				progressId: z.string(),
				targetReps: z.number(),
				targetSets: z.number(),
			}),
		)
		.query(async ({ input }) => {
			const { progressId, targetReps, targetSets } = input;

			const progress = await db.query.exerciseProgress.findFirst({
				where: eq(exerciseProgress.id, progressId),
			});

			if (!progress) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Progress entry not found",
				});
			}

			const completedReps = JSON.parse(progress.completedReps) as number[];

			// Calculate percentage based on total reps completed vs total target reps
			// For example: target 3 sets x 10 reps = 30 total reps
			// If completed [10, 8, 10] = 28 reps, percentage = 28/30 = 93%
			const totalTargetReps = targetSets * targetReps;
			const totalCompletedReps = completedReps.reduce(
				(sum, reps) => sum + reps,
				0,
			);
			const percentage = Math.round(
				(totalCompletedReps / totalTargetReps) * 100,
			);

			return {
				percentage: Math.min(percentage, 100), // Cap at 100%
				totalCompletedReps,
				totalTargetReps,
				completedReps,
			};
		}),
});
