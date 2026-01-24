import { and, db, eq } from "@buddy-lifts/db";
import {
	exerciseProgress,
	sessionParticipant,
	training,
	trainingSession,
} from "@buddy-lifts/db/schema/training";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { protectedProcedure, router } from "../index";
import { generateInviteCode, isValidInviteCode } from "../utils/invite-code";

/**
 * Session Router - Hybrid Pattern: Mutations Only
 *
 * This router handles training session operations:
 * - Start a new training session
 * - End an active session
 * - Join a session via invite code
 * - Record session completion
 *
 * For reading session data, use Supabase client directly for better performance
 * and real-time capabilities.
 *
 * See HYBRID_PATTERN.md for more details.
 */
export const sessionRouter = router({
	/**
	 * Start a new training session
	 * Creates a session with a unique invite code
	 * The host is automatically added as a participant
	 */
	start: protectedProcedure
		.input(
			z.object({
				trainingId: z.string().min(1, "Training ID is required"),
				accessType: z.enum(["read", "admin"], {
					message: "Access type is required",
				}),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session.user.id;

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

			if (existingTraining.userId !== userId) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You can only start sessions for your own trainings",
				});
			}

			// Check for existing active sessions for this training
			const existingActiveSession = await db.query.trainingSession.findFirst({
				where: and(
					eq(trainingSession.trainingId, input.trainingId),
					eq(trainingSession.status, "active"),
				),
			});

			if (existingActiveSession) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "An active session already exists for this training",
				});
			}

			// Generate unique invite code
			let inviteCode = generateInviteCode();
			let codeExists = await db.query.trainingSession.findFirst({
				where: eq(trainingSession.inviteCode, inviteCode),
			});

			// Regenerate if collision occurs (extremely rare)
			while (codeExists) {
				inviteCode = generateInviteCode();
				codeExists = await db.query.trainingSession.findFirst({
					where: eq(trainingSession.inviteCode, inviteCode),
				});
			}

			// Create the session
			const newSession = await db
				.insert(trainingSession)
				.values({
					id: crypto.randomUUID(),
					trainingId: input.trainingId,
					hostUserId: userId,
					inviteCode,
					accessType: input.accessType,
					status: "active",
					startedAt: new Date(),
				})
				.returning();

			const session = newSession[0];

			// Add the host as a participant
			await db.insert(sessionParticipant).values({
				id: crypto.randomUUID(),
				sessionId: session.id,
				userId,
				role: "host",
			});

			return session;
		}),

	/**
	 * End an active training session
	 * Only the host can end the session
	 */
	end: protectedProcedure
		.input(
			z.object({
				sessionId: z.string().min(1, "Session ID is required"),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session.user.id;

			// Find the session
			const existingSession = await db.query.trainingSession.findFirst({
				where: eq(trainingSession.id, input.sessionId),
			});

			if (!existingSession) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Session not found",
				});
			}

			// Only the host can end the session
			if (existingSession.hostUserId !== userId) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Only the host can end the session",
				});
			}

			// Check if session is already completed
			if (existingSession.status === "completed") {
				throw new TRPCError({
					code: "CONFLICT",
					message: "Session is already completed",
				});
			}

			// Update session status
			const updated = await db
				.update(trainingSession)
				.set({
					status: "completed",
					completedAt: new Date(),
				})
				.where(eq(trainingSession.id, input.sessionId))
				.returning();

			return updated[0];
		}),

	/**
	 * Join a training session via invite code
	 * Adds the user as a participant with the appropriate role
	 */
	join: protectedProcedure
		.input(
			z.object({
				inviteCode: z
					.string()
					.min(8, "Invite code must be 8 characters")
					.max(8, "Invite code must be 8 characters")
					.refine((code) => isValidInviteCode(code), {
						message: "Invalid invite code format",
					}),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session.user.id;

			// Find the session by invite code
			const session = await db.query.trainingSession.findFirst({
				where: eq(trainingSession.inviteCode, input.inviteCode),
			});

			if (!session) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Invalid invite code",
				});
			}

			// Check if session is active
			if (session.status !== "active") {
				throw new TRPCError({
					code: "CONFLICT",
					message: "This session is not active",
				});
			}

			// Check if user is already a participant
			const existingParticipant = await db.query.sessionParticipant.findFirst({
				where: and(
					eq(sessionParticipant.sessionId, session.id),
					eq(sessionParticipant.userId, userId),
				),
			});

			if (existingParticipant) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "You have already joined this session",
				});
			}

			// Determine role based on session access type
			const role = session.accessType === "admin" ? "admin" : "read";

			// Add user as participant
			await db.insert(sessionParticipant).values({
				id: crypto.randomUUID(),
				sessionId: session.id,
				userId,
				role,
			});

			return {
				sessionId: session.id,
				trainingId: session.trainingId,
				role,
			};
		}),

	/**
	 * Leave a training session
	 * Allows a participant to leave an active session
	 */
	leave: protectedProcedure
		.input(
			z.object({
				sessionId: z.string().min(1, "Session ID is required"),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session.user.id;

			// Find the session
			const session = await db.query.trainingSession.findFirst({
				where: eq(trainingSession.id, input.sessionId),
			});

			if (!session) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Session not found",
				});
			}

			// Host cannot leave their own session (they must end it instead)
			if (session.hostUserId === userId) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Host cannot leave. Use the end session action instead.",
				});
			}

			// Check if user is a participant
			const participant = await db.query.sessionParticipant.findFirst({
				where: and(
					eq(sessionParticipant.sessionId, input.sessionId),
					eq(sessionParticipant.userId, userId),
				),
			});

			if (!participant) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "You are not a participant in this session",
				});
			}

			// Remove participant
			await db
				.delete(sessionParticipant)
				.where(
					and(
						eq(sessionParticipant.sessionId, input.sessionId),
						eq(sessionParticipant.userId, userId),
					),
				);

			// Clean up associated progress records
			await db
				.delete(exerciseProgress)
				.where(
					and(
						eq(exerciseProgress.sessionId, input.sessionId),
						eq(exerciseProgress.userId, userId),
					),
				);

			return { success: true };
		}),

	/**
	 * Update session access type
	 * Only the host can change access type
	 */
	updateAccess: protectedProcedure
		.input(
			z.object({
				sessionId: z.string().min(1, "Session ID is required"),
				accessType: z.enum(["read", "admin"], {
					message: "Access type is required",
				}),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session.user.id;

			// Find the session
			const session = await db.query.trainingSession.findFirst({
				where: eq(trainingSession.id, input.sessionId),
			});

			if (!session) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Session not found",
				});
			}

			// Only the host can update access type
			if (session.hostUserId !== userId) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Only the host can change access type",
				});
			}

			// Update access type
			const updated = await db
				.update(trainingSession)
				.set({
					accessType: input.accessType,
				})
				.where(eq(trainingSession.id, input.sessionId))
				.returning();

			return updated[0];
		}),
});
