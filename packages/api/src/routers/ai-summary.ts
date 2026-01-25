import { and, db, eq } from "@buddy-lifts/db";
import {
	exercise,
	exerciseProgress,
	sessionParticipant,
	training,
	trainingSession,
} from "@buddy-lifts/db/schema/training";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { protectedProcedure, router } from "../index";

/**
 * AI Summary Router - Generate training summaries with participant comparisons
 *
 * This router analyzes completed training sessions and generates
 * AI-powered summaries comparing participants' performance.
 *
 * Uses a rule-based approach for generating insights and comparisons.
 * Can be extended to use actual LLM integration in the future.
 */

/**
 * Participant performance data for a single exercise
 */
interface ExercisePerformance {
	exerciseName: string;
	targetSets: number;
	targetReps: number;
	targetTotalReps: number;
	completedReps: number[];
	completedTotalReps: number;
	completionPercentage: number;
}

/**
 * Complete participant summary
 */
interface ParticipantSummary {
	userId: string;
	userName: string;
	exercises: ExercisePerformance[];
	totalTargetReps: number;
	totalCompletedReps: number;
	overallCompletion: number;
}

/**
 * Comparison between two participants
 */
interface ParticipantComparison {
	userId: string;
	userName: string;
	overallCompletion: number;
	totalCompletedReps: number;
	differenceFromWinner: number; // Percentage points behind the leader
	isWinner: boolean;
}

/**
 * Full training summary output
 */
interface TrainingSummary {
	sessionId: string;
	trainingName: string;
	trainingDescription: string | null;
	completedAt: Date;
	participantCount: number;
	participants: ParticipantSummary[];
	comparisons: ParticipantComparison[];
	highlights: string[];
	insights: string[];
}

/**
 * Calculate completion percentage for a single exercise
 */
function calculateExercisePercentage(
	completedReps: number[],
	targetSets: number,
	targetReps: number,
): number {
	const totalTargetReps = targetSets * targetReps;
	const totalCompletedReps = completedReps.reduce((sum, reps) => sum + reps, 0);
	return Math.min(
		Math.round((totalCompletedReps / totalTargetReps) * 100),
		100,
	);
}

/**
 * Generate performance highlights for a participant
 */
function generateHighlights(participant: ParticipantSummary): string[] {
	const highlights: string[] = [];

	// Check for perfect exercises
	const perfectExercises = participant.exercises.filter(
		(ex) => ex.completionPercentage === 100,
	);

	if (perfectExercises.length > 0) {
		if (perfectExercises.length === participant.exercises.length) {
			highlights.push("Crushed it! Perfect completion on all exercises!");
		} else {
			highlights.push(
				`Nailed ${perfectExercises.length} exercise${perfectExercises.length > 1 ? "s" : ""} with 100% completion`,
			);
		}
	}

	// Check for strongest exercise
	const strongestExercise = [...participant.exercises].sort(
		(a, b) => b.completionPercentage - a.completionPercentage,
	)[0];

	if (strongestExercise && strongestExercise.completionPercentage >= 80) {
		highlights.push(
			`Strongest performance: ${strongestExercise.exerciseName} (${strongestExercise.completionPercentage}%)`,
		);
	}

	// Check for areas to improve
	const needsWorkExercises = participant.exercises.filter(
		(ex) => ex.completionPercentage < 70,
	);

	if (needsWorkExercises.length > 0) {
		const names = needsWorkExercises.map((ex) => ex.exerciseName).join(", ");
		highlights.push(`Room for growth: ${names}`);
	}

	return highlights;
}

/**
 * Generate comparative insights between participants
 */
function generateComparisons(
	participants: ParticipantSummary[],
): ParticipantComparison[] {
	if (participants.length === 0) return [];

	// Sort by overall completion
	const sorted = [...participants].sort(
		(a, b) => b.overallCompletion - a.overallCompletion,
	);

	const winner = sorted[0];

	return sorted.map((participant) => ({
		userId: participant.userId,
		userName: participant.userName,
		overallCompletion: participant.overallCompletion,
		totalCompletedReps: participant.totalCompletedReps,
		differenceFromWinner:
			winner.overallCompletion - participant.overallCompletion,
		// Mark as winner if tied for first place
		isWinner: participant.overallCompletion === winner.overallCompletion,
	}));
}

/**
 * Generate session-wide insights
 */
function generateSessionInsights(participants: ParticipantSummary[]): string[] {
	const insights: string[] = [];

	if (participants.length === 0) return insights;

	if (participants.length === 1) {
		const p = participants[0];
		if (p.overallCompletion >= 90) {
			insights.push("Excellent solo session! You're on fire!");
		} else if (p.overallCompletion >= 70) {
			insights.push("Solid workout! Consistency is key.");
		} else {
			insights.push("Good effort! Every rep counts toward progress.");
		}
		return insights;
	}

	// Multi-participant insights
	const avgCompletion =
		participants.reduce((sum, p) => sum + p.overallCompletion, 0) /
		participants.length;

	if (avgCompletion >= 90) {
		insights.push("Incredible team effort! Everyone crushed this workout!");
	} else if (avgCompletion >= 70) {
		insights.push("Great teamwork! Consistent performance across the board.");
	}

	// Find the winner
	const winner = participants.reduce((prev, current) =>
		prev.overallCompletion > current.overallCompletion ? prev : current,
	);

	if (winner.overallCompletion >= 90) {
		insights.push(
			`🏆 ${winner.userName} takes the win with ${winner.overallCompletion}% completion!`,
		);
	}

	// Check for close competition
	const sorted = [...participants].sort(
		(a, b) => b.overallCompletion - a.overallCompletion,
	);

	if (sorted.length >= 2) {
		const gap = sorted[0].overallCompletion - sorted[1].overallCompletion;
		if (gap <= 5 && gap >= 0) {
			insights.push(
				`What a close match! Just ${gap}% between ${sorted[0].userName} and ${sorted[1].userName}!`,
			);
		}
	}

	// Total effort
	const totalReps = participants.reduce(
		(sum, p) => sum + p.totalCompletedReps,
		0,
	);
	insights.push(
		`Combined effort: ${totalReps} reps completed by ${participants.length} participant${participants.length > 1 ? "s" : ""}`,
	);

	return insights;
}

/**
 * Get detailed progress for a session with AI-generated summary
 */
export const aiSummaryRouter = router({
	/**
	 * Generate a comprehensive training summary for a completed session
	 * Includes participant comparisons, highlights, and insights
	 */
	generate: protectedProcedure
		.input(
			z.object({
				sessionId: z.string().min(1, "Session ID is required"),
			}),
		)
		.query(async ({ input }) => {
			const { sessionId } = input;

			// Get the session
			const session = await db.query.trainingSession.findFirst({
				where: eq(trainingSession.id, sessionId),
			});

			if (!session) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Session not found",
				});
			}

			// Only completed sessions can be summarized
			if (session.status !== "completed") {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Can only generate summaries for completed sessions",
				});
			}

			// Get the training details
			const trainingData = await db.query.training.findFirst({
				where: eq(training.id, session.trainingId),
			});

			if (!trainingData) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Training not found",
				});
			}

			// Get all participants for this session
			const participants = await db.query.sessionParticipant.findMany({
				where: eq(sessionParticipant.sessionId, sessionId),
				with: {
					user: true,
				},
			});

			if (participants.length === 0) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "No participants found for this session",
				});
			}

			// Get all exercises for this training
			const exercises = await db.query.exercise.findMany({
				where: eq(exercise.trainingId, session.trainingId),
				orderBy: (exercise, { asc }) => [asc(exercise.order)],
			});

			if (exercises.length === 0) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "No exercises found for this training",
				});
			}

			// Get all progress entries for this session
			const progressEntries = await db.query.exerciseProgress.findMany({
				where: eq(exerciseProgress.sessionId, sessionId),
			});

			// Build participant summaries
			const participantSummaries: ParticipantSummary[] = participants.map(
				(participant) => {
					// Get progress for this participant
					const userProgress = progressEntries.filter(
						(p) => p.userId === participant.userId,
					);

					// Build exercise performance data
					const exercisePerformance: ExercisePerformance[] = exercises.map(
						(ex) => {
							const progress = userProgress.find((p) => p.exerciseId === ex.id);
							const completedReps = progress
								? (JSON.parse(progress.completedReps) as number[])
								: [];

							return {
								exerciseName: ex.name,
								targetSets: ex.targetSets,
								targetReps: ex.targetReps,
								targetTotalReps: ex.targetSets * ex.targetReps,
								completedReps,
								completedTotalReps: completedReps.reduce(
									(sum, reps) => sum + reps,
									0,
								),
								completionPercentage: calculateExercisePercentage(
									completedReps,
									ex.targetSets,
									ex.targetReps,
								),
							};
						},
					);

					const totalTargetReps = exercisePerformance.reduce(
						(sum, ex) => sum + ex.targetTotalReps,
						0,
					);
					const totalCompletedReps = exercisePerformance.reduce(
						(sum, ex) => sum + ex.completedTotalReps,
						0,
					);
					const overallCompletion =
						totalTargetReps > 0
							? Math.min(
									Math.round((totalCompletedReps / totalTargetReps) * 100),
									100,
								)
							: 0;

					return {
						userId: participant.userId,
						userName: participant.user.name,
						exercises: exercisePerformance,
						totalTargetReps,
						totalCompletedReps,
						overallCompletion,
					};
				},
			);

			// Generate comparisons
			const comparisons = generateComparisons(participantSummaries);

			// Generate highlights for each participant
			const highlights: string[] = [];
			for (const participant of participantSummaries) {
				const participantHighlights = generateHighlights(participant);
				highlights.push(
					`**${participant.userName}**: ${participantHighlights.join(". ")}`,
				);
			}

			// Generate session-wide insights
			const insights = generateSessionInsights(participantSummaries);

			// Build the full summary
			const summary: TrainingSummary = {
				sessionId,
				trainingName: trainingData.name,
				trainingDescription: trainingData.description,
				completedAt: session.completedAt ?? new Date(),
				participantCount: participants.length,
				participants: participantSummaries,
				comparisons,
				highlights,
				insights,
			};

			return summary;
		}),

	/**
	 * Get a quick summary for a session (lighter version with just key stats)
	 */
	quickSummary: protectedProcedure
		.input(
			z.object({
				sessionId: z.string().min(1, "Session ID is required"),
			}),
		)
		.query(async ({ input }) => {
			const { sessionId } = input;

			// Get the session
			const session = await db.query.trainingSession.findFirst({
				where: eq(trainingSession.id, sessionId),
			});

			if (!session) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Session not found",
				});
			}

			// Get the training details
			const trainingData = await db.query.training.findFirst({
				where: eq(training.id, session.trainingId),
			});

			if (!trainingData) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Training not found",
				});
			}

			// Get participants
			const participants = await db.query.sessionParticipant.findMany({
				where: eq(sessionParticipant.sessionId, sessionId),
				with: {
					user: true,
				},
			});

			// Get exercises
			const exercises = await db.query.exercise.findMany({
				where: eq(exercise.trainingId, session.trainingId),
			});

			// Get progress
			const progressEntries = await db.query.exerciseProgress.findMany({
				where: eq(exerciseProgress.sessionId, sessionId),
			});

			// Calculate quick stats
			const totalTargetReps =
				exercises.reduce((sum, ex) => sum + ex.targetSets * ex.targetReps, 0) *
				participants.length;
			const totalCompletedReps = progressEntries.reduce((sum, p) => {
				const reps = JSON.parse(p.completedReps) as number[];
				return sum + reps.reduce((rSum, r) => rSum + r, 0);
			}, 0);

			return {
				sessionId,
				trainingName: trainingData.name,
				status: session.status,
				participantCount: participants.length,
				exerciseCount: exercises.length,
				totalTargetReps,
				totalCompletedReps,
				overallCompletion:
					totalTargetReps > 0
						? Math.round((totalCompletedReps / totalTargetReps) * 100)
						: 0,
				completedAt: session.completedAt,
			};
		}),

	/**
	 * Get personal summary for current user in a session
	 * Shows only the requesting user's performance
	 */
	personalSummary: protectedProcedure
		.input(
			z.object({
				sessionId: z.string().min(1, "Session ID is required"),
			}),
		)
		.query(async ({ input, ctx }) => {
			const { sessionId } = input;
			const userId = ctx.session.user.id;

			// Get the session
			const session = await db.query.trainingSession.findFirst({
				where: eq(trainingSession.id, sessionId),
			});

			if (!session) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Session not found",
				});
			}

			// Get the training details
			const trainingData = await db.query.training.findFirst({
				where: eq(training.id, session.trainingId),
			});

			if (!trainingData) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Training not found",
				});
			}

			// Check if user was a participant
			const participant = await db.query.sessionParticipant.findFirst({
				where: and(
					eq(sessionParticipant.sessionId, sessionId),
					eq(sessionParticipant.userId, userId),
				),
			});

			if (!participant) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You were not a participant in this session",
				});
			}

			// Get exercises
			const exercises = await db.query.exercise.findMany({
				where: eq(exercise.trainingId, session.trainingId),
				orderBy: (exercise, { asc }) => [asc(exercise.order)],
			});

			// Get user's progress
			const progressEntries = await db.query.exerciseProgress.findMany({
				where: and(
					eq(exerciseProgress.sessionId, sessionId),
					eq(exerciseProgress.userId, userId),
				),
			});

			// Build exercise performance
			const exercisePerformance: ExercisePerformance[] = exercises.map((ex) => {
				const progress = progressEntries.find((p) => p.exerciseId === ex.id);
				const completedReps = progress
					? (JSON.parse(progress.completedReps) as number[])
					: [];

				return {
					exerciseName: ex.name,
					targetSets: ex.targetSets,
					targetReps: ex.targetReps,
					targetTotalReps: ex.targetSets * ex.targetReps,
					completedReps,
					completedTotalReps: completedReps.reduce(
						(sum, reps) => sum + reps,
						0,
					),
					completionPercentage: calculateExercisePercentage(
						completedReps,
						ex.targetSets,
						ex.targetReps,
					),
				};
			});

			const totalTargetReps = exercisePerformance.reduce(
				(sum, ex) => sum + ex.targetTotalReps,
				0,
			);
			const totalCompletedReps = exercisePerformance.reduce(
				(sum, ex) => sum + ex.completedTotalReps,
				0,
			);
			const overallCompletion =
				totalTargetReps > 0
					? Math.min(
							Math.round((totalCompletedReps / totalTargetReps) * 100),
							100,
						)
					: 0;

			const participantSummary: ParticipantSummary = {
				userId,
				userName: ctx.session.user.name,
				exercises: exercisePerformance,
				totalTargetReps,
				totalCompletedReps,
				overallCompletion,
			};

			const highlights = generateHighlights(participantSummary);

			return {
				sessionId,
				trainingName: trainingData.name,
				trainingDescription: trainingData.description,
				completedAt: session.completedAt,
				participant: participantSummary,
				highlights,
			};
		}),
});
