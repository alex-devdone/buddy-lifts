"use client";

import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";

interface LiveProgressBarProps {
	sessionId: string;
	trainingId: string;
	currentUserId?: string;
	showRankings?: boolean;
	size?: "sm" | "md" | "lg";
}

interface ExerciseProgress {
	id: string;
	sessionId: string;
	userId: string;
	exerciseId: string;
	completedReps: string;
	completedAt: string | null;
}

interface Exercise {
	id: string;
	trainingId: string;
	name: string;
	targetSets: number;
	targetReps: number;
	weight: number | null;
	order: number;
	restSeconds: number | null;
}

interface Participant {
	id: string;
	sessionId: string;
	userId: string;
	role: "host" | "admin" | "read";
	joinedAt: string;
	user?: {
		id: string;
		name: string;
		email: string;
	};
}

interface ParticipantProgress {
	userId: string;
	userName: string;
	userEmail: string;
	percentage: number;
	completedCount: number;
	totalExercises: number;
	isCurrentUser: boolean;
}

/**
 * Calculate progress percentage for a participant
 */
function calculateParticipantProgress(
	userProgress: ExerciseProgress[],
	totalExercises: number,
): { percentage: number; completedCount: number } {
	if (totalExercises === 0) return { percentage: 0, completedCount: 0 };

	const completedCount = userProgress.filter((p) => p.completedAt).length;
	const percentage = Math.round((completedCount / totalExercises) * 100);

	return { percentage, completedCount };
}

/**
 * Get color classes based on progress percentage
 */
function getProgressColorClasses(percentage: number): {
	bar: string;
	text: string;
	background: string;
} {
	if (percentage === 100) {
		return {
			bar: "bg-green-500",
			text: "text-green-600",
			background: "bg-green-500/10",
		};
	}
	if (percentage >= 75) {
		return {
			bar: "bg-lime-500",
			text: "text-lime-600",
			background: "bg-lime-500/10",
		};
	}
	if (percentage >= 50) {
		return {
			bar: "bg-yellow-500",
			text: "text-yellow-600",
			background: "bg-yellow-500/10",
		};
	}
	if (percentage >= 25) {
		return {
			bar: "bg-orange-500",
			text: "text-orange-600",
			background: "bg-orange-500/10",
		};
	}
	return {
		bar: "bg-red-500",
		text: "text-red-600",
		background: "bg-red-500/10",
	};
}

/**
 * Get size classes based on size prop
 */
function getSizeClasses(size: "sm" | "md" | "lg"): string {
	switch (size) {
		case "sm":
			return "h-1.5 text-xs";
		case "lg":
			return "h-4 text-base";
		default:
			return "h-2 text-sm";
	}
}

/**
 * LiveProgressBar Component
 *
 * Real-time progress bar component for displaying all participants' workout progress.
 * Shows live updates via Supabase real-time subscriptions, with ranking indicators,
 * current user highlighting, and percentage completion.
 *
 * Features:
 * - Real-time progress updates via Supabase subscriptions
 * - Sorted by progress percentage (descending)
 * - Rank indicators (1st, 2nd, 3rd place badges)
 * - Current user highlighting
 * - Color-coded progress bars (red -> orange -> yellow -> lime -> green)
 * - Mobile-first responsive design
 * - Loading and empty states
 *
 * Mobile-first design with size variations for different contexts.
 */
export function LiveProgressBar({
	sessionId,
	trainingId,
	currentUserId,
	showRankings = true,
	size = "md",
}: LiveProgressBarProps) {
	const sizeClasses = getSizeClasses(size);

	// Fetch participants using Supabase (read)
	const { data: participants = [], isLoading: participantsLoading } =
		useSupabaseQuery<Participant>({
			queryFn: (supabase) =>
				supabase
					.from("session_participant")
					.select(
						`
					*,
					user:user_id(id,name,email)
				`,
					)
					.eq("sessionId", sessionId)
					.order("joinedAt", { ascending: true }),
			realtime: true,
			table: "session_participant",
		});

	// Fetch all exercises for the training using Supabase (read)
	const { data: exercises = [], isLoading: exercisesLoading } =
		useSupabaseQuery<Exercise>({
			queryFn: (supabase) =>
				supabase
					.from("exercise")
					.select("*")
					.eq("trainingId", trainingId)
					.order("order", { ascending: true }),
			realtime: true,
			table: "exercise",
		});

	// Fetch all exercise progress for this session using Supabase (read)
	const { data: allProgress = [] } = useSupabaseQuery<ExerciseProgress>({
		queryFn: (supabase) =>
			supabase.from("exercise_progress").select("*").eq("sessionId", sessionId),
		realtime: true,
		table: "exercise_progress",
	});

	// Calculate progress for each participant
	const participantProgress: ParticipantProgress[] = participants.map(
		(participant) => {
			const userProgress = allProgress.filter(
				(p) => p.userId === participant.userId,
			);
			const { percentage, completedCount } = calculateParticipantProgress(
				userProgress,
				exercises.length,
			);

			return {
				userId: participant.userId,
				userName:
					participant.user?.name || participant.user?.email || "Unknown",
				userEmail: participant.user?.email || "",
				percentage,
				completedCount,
				totalExercises: exercises.length,
				isCurrentUser: participant.userId === currentUserId,
			};
		},
	);

	// Sort by progress percentage (descending)
	const sortedProgress = [...participantProgress].sort(
		(a, b) => b.percentage - a.percentage,
	);

	if (participantsLoading || exercisesLoading) {
		return (
			<div className="flex items-center justify-center py-4">
				<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (participants.length === 0) {
		return (
			<Card className="border-dashed">
				<CardContent className="flex flex-col items-center justify-center py-6">
					<p className="text-muted-foreground text-sm">
						Waiting for participants...
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<h3 className="font-semibold text-sm">Live Progress</h3>
					{showRankings && sortedProgress.length > 1 && (
						<span className="text-muted-foreground text-xs">
							{sortedProgress.length} participant
							{sortedProgress.length > 1 ? "s" : ""}
						</span>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				{sortedProgress.map((progress, index) => {
					const colors = getProgressColorClasses(progress.percentage);
					const rank = index + 1;

					return (
						<div
							key={progress.userId}
							className={`space-y-1.5 rounded-lg border p-2.5 transition-all ${
								progress.isCurrentUser
									? "border-primary/50 bg-primary/5"
									: "border-border"
							}`}
						>
							{/* Participant info and percentage */}
							<div className="flex items-center justify-between gap-2">
								<div className="flex min-w-0 flex-1 items-center gap-2">
									{/* Rank badge */}
									{showRankings && sortedProgress.length > 1 && rank <= 3 && (
										<span
											className={`flex shrink-0 items-center justify-center rounded-full font-bold text-xs ${
												rank === 1
													? "h-5 w-5 bg-yellow-500 text-white"
													: rank === 2
														? "h-5 w-5 bg-gray-400 text-white"
														: "h-5 w-5 bg-orange-600 text-white"
											}`}
										>
											{rank}
										</span>
									)}

									{/* Name */}
									<div className="min-w-0 flex-1">
										<p
											className={`truncate font-medium ${sizeClasses.split(" ")[1]}`}
										>
											{progress.userName}
										</p>
										{progress.isCurrentUser && (
											<p className="text-muted-foreground text-xs">(You)</p>
										)}
									</div>
								</div>

								{/* Percentage with trend indicator */}
								<div className="flex shrink-0 items-center gap-1">
									{progress.percentage === 100 && (
										<TrendingUp
											className={`text-green-500 ${size === "sm" ? "h-3 w-3" : "h-4 w-4"}`}
										/>
									)}
									<span
										className={`font-bold ${sizeClasses.split(" ")[1]} ${colors.text}`}
									>
										{progress.percentage}%
									</span>
								</div>
							</div>

							{/* Progress bar */}
							<div
								className={`overflow-hidden rounded-full bg-muted ${sizeClasses.split(" ")[0]}`}
							>
								<div
									className={`h-full transition-all duration-500 ease-out ${colors.bar}`}
									style={{ width: `${progress.percentage}%` }}
								/>
							</div>

							{/* Stats */}
							<div className="flex items-center justify-between text-xs">
								<span className="text-muted-foreground">
									{progress.completedCount} of {progress.totalExercises}{" "}
									exercises
								</span>
								{progress.percentage < 50 && (
									<span className="flex items-center gap-0.5 text-muted-foreground">
										<TrendingDown className="h-3 w-3" />
										Keep pushing!
									</span>
								)}
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
