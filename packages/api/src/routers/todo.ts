import { db, eq } from "@buddy-lifts/db";
import { todo } from "@buddy-lifts/db/schema/todo";
import z from "zod";

import { publicProcedure, router } from "../index";

/**
 * Todo Router - Hybrid Pattern: Mutations Only
 *
 * This router only contains mutations (create, update, delete).
 * For reading todos, use Supabase client directly for better performance
 * and real-time capabilities.
 *
 * See HYBRID_PATTERN.md for more details.
 */
export const todoRouter = router({
	/**
	 * Create a new todo
	 * For protected routes, replace publicProcedure with protectedProcedure
	 */
	create: publicProcedure
		.input(
			z.object({
				text: z.string().min(1),
				title: z.string().min(1).optional(),
				description: z.string().optional(),
			}),
		)
		.mutation(async ({ input }) => {
			// You can add business logic here
			// For example: validation, notifications, etc.

			const newTodo = await db
				.insert(todo)
				.values({
					text: input.text,
					// Add more fields as needed
				})
				.returning();

			return newTodo[0];
		}),

	/**
	 * Update an existing todo
	 */
	update: publicProcedure
		.input(
			z.object({
				id: z.number(),
				text: z.string().min(1).optional(),
				completed: z.boolean().optional(),
			}),
		)
		.mutation(async ({ input }) => {
			const { id, ...updates } = input;

			// Add authorization checks here if needed
			// if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });

			const updated = await db
				.update(todo)
				.set(updates)
				.where(eq(todo.id, id))
				.returning();

			return updated[0];
		}),

	/**
	 * Toggle todo completion status
	 */
	toggle: publicProcedure
		.input(z.object({ id: z.number(), completed: z.boolean() }))
		.mutation(async ({ input }) => {
			return await db
				.update(todo)
				.set({ completed: input.completed })
				.where(eq(todo.id, input.id));
		}),

	/**
	 * Delete a todo
	 */
	delete: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			// Add authorization checks here
			// const existing = await db.query.todo.findFirst({
			//   where: eq(todo.id, input.id)
			// });
			// if (!existing || existing.userId !== ctx.session.user.id) {
			//   throw new TRPCError({ code: "FORBIDDEN" });
			// }

			await db.delete(todo).where(eq(todo.id, input.id));

			return { success: true };
		}),
});
