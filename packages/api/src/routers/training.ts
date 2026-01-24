import { and, db, eq } from "@buddy-lifts/db";
import { training } from "@buddy-lifts/db/schema/training";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { protectedProcedure, router } from "../index";

/**
 * Training Router - Hybrid Pattern: Mutations Only
 *
 * This router only contains mutations (create, update, delete).
 * For reading trainings, use Supabase client directly for better performance
 * and real-time capabilities.
 *
 * See HYBRID_PATTERN.md for more details.
 */
export const trainingRouter = router({
	/**
	 * Create a new training
	 * Requires authentication
	 */
	create: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1, "Training name is required"),
				description: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const newTraining = await db
				.insert(training)
				.values({
					userId: ctx.session.user.id,
					name: input.name,
					description: input.description,
				})
				.returning();

			return newTraining[0];
		}),

	/**
	 * Update an existing training
	 * Only the owner can update their training
	 */
	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().min(1).optional(),
				description: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { id, ...updates } = input;

			// Check if the training exists and belongs to the user
			const existing = await db.query.training.findFirst({
				where: eq(training.id, id),
			});

			if (!existing) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Training not found",
				});
			}

			if (existing.userId !== ctx.session.user.id) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You can only update your own trainings",
				});
			}

			const updated = await db
				.update(training)
				.set(updates)
				.where(
					and(eq(training.id, id), eq(training.userId, ctx.session.user.id)),
				)
				.returning();

			return updated[0];
		}),

	/**
	 * Delete a training
	 * Only the owner can delete their training
	 * This will cascade delete all associated exercises, sessions, and progress
	 */
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			// Check if the training exists and belongs to the user
			const existing = await db.query.training.findFirst({
				where: eq(training.id, input.id),
			});

			if (!existing) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Training not found",
				});
			}

			if (existing.userId !== ctx.session.user.id) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You can only delete your own trainings",
				});
			}

			await db
				.delete(training)
				.where(
					and(
						eq(training.id, input.id),
						eq(training.userId, ctx.session.user.id),
					),
				);

			return { success: true };
		}),
});
