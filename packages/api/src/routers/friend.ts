import { and, db, eq, or } from "@buddy-lifts/db";
import { friend } from "@buddy-lifts/db/schema/training";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../index";

/**
 * Friend Router - Hybrid Pattern: Mutations Only
 *
 * This router handles friend relationship management including:
 * - Sending friend requests (creates pending relationship)
 * - Accepting friend requests (updates status to accepted)
 * - Rejecting friend requests (deletes the relationship)
 * - Removing friends (deletes the relationship)
 *
 * For reading friend relationships, use Supabase client directly.
 */
export const friendRouter = router({
	/**
	 * Send a friend request to another user
	 * Creates a pending friend relationship
	 *
	 * Input: friendId - the ID of the user to send a request to
	 */
	send: protectedProcedure
		.input(
			z.object({
				friendId: z.string().min(1, "Friend ID is required"),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const currentUserId = ctx.session.user.id;

			// Prevent sending friend request to self
			if (input.friendId === currentUserId) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "You cannot send a friend request to yourself",
				});
			}

			// Check if a relationship already exists (in either direction)
			const existing = await db.query.friend.findFirst({
				where: or(
					and(
						eq(friend.userId, currentUserId),
						eq(friend.friendId, input.friendId),
					),
					and(
						eq(friend.userId, input.friendId),
						eq(friend.friendId, currentUserId),
					),
				),
			});

			if (existing) {
				if (existing.status === "accepted") {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "You are already friends with this user",
					});
				}
				if (existing.status === "pending") {
					if (existing.userId === currentUserId) {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: "You already have a pending friend request to this user",
						});
					}
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "This user already has a pending friend request to you",
					});
				}
				if (existing.status === "blocked") {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Cannot send friend request: relationship is blocked",
					});
				}
			}

			// Create the friend request
			const newFriend = await db
				.insert(friend)
				.values({
					userId: currentUserId,
					friendId: input.friendId,
					status: "pending",
				})
				.returning();

			return newFriend[0];
		}),

	/**
	 * Accept a pending friend request
	 * Updates the relationship status to accepted
	 *
	 * Input: friendId - the ID of the user who sent the request
	 */
	accept: protectedProcedure
		.input(
			z.object({
				friendId: z.string().min(1, "Friend ID is required"),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const currentUserId = ctx.session.user.id;

			// Find the pending friend request (must be from the other user to current user)
			const existing = await db.query.friend.findFirst({
				where: and(
					eq(friend.userId, input.friendId),
					eq(friend.friendId, currentUserId),
					eq(friend.status, "pending"),
				),
			});

			if (!existing) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "No pending friend request found from this user",
				});
			}

			// Update the relationship to accepted
			const updated = await db
				.update(friend)
				.set({ status: "accepted" })
				.where(eq(friend.id, existing.id))
				.returning();

			return updated[0];
		}),

	/**
	 * Reject a pending friend request
	 * Deletes the pending relationship
	 *
	 * Input: friendId - the ID of the user who sent the request
	 */
	reject: protectedProcedure
		.input(
			z.object({
				friendId: z.string().min(1, "Friend ID is required"),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const currentUserId = ctx.session.user.id;

			// Find and delete the pending friend request
			const existing = await db.query.friend.findFirst({
				where: and(
					eq(friend.userId, input.friendId),
					eq(friend.friendId, currentUserId),
					eq(friend.status, "pending"),
				),
			});

			if (!existing) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "No pending friend request found from this user",
				});
			}

			await db.delete(friend).where(eq(friend.id, existing.id));

			return { success: true };
		}),

	/**
	 * Remove a friend (or cancel a sent request)
	 * Deletes the relationship regardless of status
	 *
	 * Input: friendId - the ID of the friend to remove
	 */
	remove: protectedProcedure
		.input(
			z.object({
				friendId: z.string().min(1, "Friend ID is required"),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const currentUserId = ctx.session.user.id;

			// Find the relationship (in either direction)
			const existing = await db.query.friend.findFirst({
				where: or(
					and(
						eq(friend.userId, currentUserId),
						eq(friend.friendId, input.friendId),
					),
					and(
						eq(friend.userId, input.friendId),
						eq(friend.friendId, currentUserId),
					),
				),
			});

			if (!existing) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "No friend relationship found with this user",
				});
			}

			// Only allow the user who initiated the relationship to remove it if pending
			// For accepted/blocked, either party can remove
			if (existing.status === "pending" && existing.userId !== currentUserId) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message:
						"You cannot cancel a friend request sent to you. Use reject instead.",
				});
			}

			await db.delete(friend).where(eq(friend.id, existing.id));

			return { success: true };
		}),

	/**
	 * Block a user
	 * Sets the relationship status to blocked (or creates a new blocked relationship)
	 *
	 * Input: friendId - the ID of the user to block
	 */
	block: protectedProcedure
		.input(
			z.object({
				friendId: z.string().min(1, "Friend ID is required"),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const currentUserId = ctx.session.user.id;

			// Prevent blocking self
			if (input.friendId === currentUserId) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "You cannot block yourself",
				});
			}

			// Check if a relationship already exists (in either direction)
			const existing = await db.query.friend.findFirst({
				where: or(
					and(
						eq(friend.userId, currentUserId),
						eq(friend.friendId, input.friendId),
					),
					and(
						eq(friend.userId, input.friendId),
						eq(friend.friendId, currentUserId),
					),
				),
			});

			// If relationship exists and is already blocked
			if (
				existing &&
				existing.status === "blocked" &&
				existing.userId === currentUserId
			) {
				return existing;
			}

			// If relationship exists, update it to blocked
			if (existing) {
				// Only allow the user to block if they own the relationship or it's accepted
				if (
					existing.userId !== currentUserId &&
					existing.status !== "accepted"
				) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "You cannot block this user",
					});
				}

				const updated = await db
					.update(friend)
					.set({
						status: "blocked",
						userId: currentUserId,
						friendId: input.friendId,
					})
					.where(eq(friend.id, existing.id))
					.returning();

				return updated[0];
			}

			// Create a new blocked relationship
			const newBlocked = await db
				.insert(friend)
				.values({
					userId: currentUserId,
					friendId: input.friendId,
					status: "blocked",
				})
				.returning();

			return newBlocked[0];
		}),
});
