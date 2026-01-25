"use client";

import { Award, CheckCircle2, Loader2, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Participant comparison data from AI summary
 */
export interface ParticipantComparisonData {
	userId: string;
	userName: string;
	overallCompletion: number;
	totalCompletedReps: number;
	differenceFromWinner: number;
	isWinner: boolean;
}

/**
 * Exercise performance data for detailed breakdown
 */
export interface ExercisePerformanceData {
	exerciseName: string;
	targetSets: number;
	targetReps: number;
	targetTotalReps: number;
	completedReps: number[];
	completedTotalReps: number;
	completionPercentage: number;
}

/**
 * Full participant summary with exercise breakdown
 */
export interface ParticipantSummaryData {
	userId: string;
	userName: string;
	exercises: ExercisePerformanceData[];
	totalTargetReps: number;
	totalCompletedReps: number;
	overallCompletion: number;
}

/**
 * Props for ParticipantComparison component
 */
export interface ParticipantComparisonProps {
	/** Array of participant comparisons sorted by ranking */
	comparisons: ParticipantComparisonData[];
	/** Optional detailed exercise breakdown per participant */
	participants?: ParticipantSummaryData[];
	/** Current user ID for highlighting */
	currentUserId?: string;
	/** Whether to show detailed exercise breakdown */
	showExerciseBreakdown?: boolean;
}

/**
 * Get rank badge component for a given index
 */
function getRankBadge(index: number): React.ReactNode {
	switch (index) {
		case 0:
			return <Badge variant="warning">1st</Badge>;
		case 1:
			return <Badge variant="secondary">2nd</Badge>;
		case 2:
			return <Badge variant="outline">3rd</Badge>;
		default:
			return <Badge variant="outline">{`${index + 1}th`}</Badge>;
	}
}

/**
 * Get progress bar color classes based on completion percentage
 */
function getProgressColorClasses(percentage: number): string {
	if (percentage >= 100) return "bg-green-500";
	if (percentage >= 75) return "bg-lime-500";
	if (percentage >= 50) return "bg-yellow-500";
	if (percentage >= 25) return "bg-orange-500";
	return "bg-red-500";
}

/**
 * ParticipantComparison Component
 *
 * Visual comparison chart displaying participants' performance side-by-side.
 * Shows ranking, completion percentages, reps completed, and optional exercise breakdown.
 *
 * Data access pattern:
 * - Reads via props from parent component (TrainingSummary)
 * - Parent fetches data via tRPC aiSummary.generate query
 *
 * Features:
 * - Side-by-side participant cards with visual comparison
 * - Progress bars for completion percentage
 * - Rank badges (1st, 2nd, 3rd) with special styling for winners
 * - Current user highlighting with ring indicator
 * - Optional exercise-by-exercise breakdown
 * - Responsive grid layout (1 col mobile, 2 cols tablet+)
 * - Winner highlighting with gradient background
 *
 * Mobile-first responsive design.
 */
export function ParticipantComparison({
	comparisons,
	participants,
	currentUserId,
	showExerciseBreakdown = false,
}: ParticipantComparisonProps) {
	// Create a map for quick lookup of detailed participant data
	const participantMap = useMemo(() => {
		if (!participants) return new Map();
		return new Map(participants.map((p) => [p.userId, p]));
	}, [participants]);

	// Calculate max completion for relative progress bars
	const maxCompletion = Math.max(
		...comparisons.map((c) => c.overallCompletion),
	);

	if (comparisons.length === 0) {
		return (
			<Card>
				<CardContent className="flex flex-col items-center justify-center py-8">
					<p className="text-muted-foreground text-sm">
						No participant data available
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="w-full space-y-4">
			{/* Header with stats */}
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<TrendingUp className="h-5 w-5 text-muted-foreground" />
					<h3 className="font-semibold">Performance Comparison</h3>
				</div>
				<div className="flex items-center gap-1 text-muted-foreground text-sm">
					<CheckCircle2 className="h-4 w-4" />
					<span>
						{comparisons.length} participant{comparisons.length > 1 ? "s" : ""}
					</span>
				</div>
			</div>

			{/* Participant comparison cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{comparisons.map((comparison, index) => {
					const isCurrentUser = comparison.userId === currentUserId;
					const detailedData = participantMap.get(comparison.userId);
					const progressWidth =
						maxCompletion > 0
							? (comparison.overallCompletion / maxCompletion) * 100
							: 0;

					return (
						<Card
							key={comparison.userId}
							className={`transition-all ${
								isCurrentUser ? "ring-2 ring-primary/50" : ""
							} ${comparison.isWinner ? "border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10" : ""}`}
						>
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										{comparison.isWinner ? (
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20">
												<Award className="h-4 w-4 text-yellow-600" />
											</div>
										) : (
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
												<span className="font-semibold text-xs">
													{index + 1}
												</span>
											</div>
										)}
										<div className="flex min-w-0 flex-col">
											<div className="flex items-center gap-2">
												<p className="truncate font-medium text-sm">
													{comparison.userName}
												</p>
												{isCurrentUser && (
													<Badge variant="outline" className="text-xs">
														You
													</Badge>
												)}
											</div>
											<p className="text-muted-foreground text-xs">
												{getRankBadge(index)}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="font-bold text-lg">
											{comparison.overallCompletion}%
										</p>
										{!comparison.isWinner &&
											comparison.differenceFromWinner > 0 && (
												<p className="text-muted-foreground text-xs">
													-{comparison.differenceFromWinner}%
												</p>
											)}
									</div>
								</div>
							</CardHeader>

							<CardContent className="space-y-3">
								{/* Progress bar */}
								<div className="space-y-1">
									<div className="flex items-center justify-between text-muted-foreground text-xs">
										<span>Completion</span>
										<span>{comparison.totalCompletedReps} reps</span>
									</div>
									<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
										<div
											className={`h-full transition-all duration-500 ${getProgressColorClasses(comparison.overallCompletion)}`}
											style={{ width: `${comparison.overallCompletion}%` }}
											role="progressbar"
											aria-valuenow={comparison.overallCompletion}
											aria-valuemin={0}
											aria-valuemax={100}
											aria-label={`${comparison.userName} completion percentage`}
										/>
									</div>
								</div>

								{/* Exercise breakdown (optional) */}
								{showExerciseBreakdown && detailedData?.exercises && (
									<div className="space-y-2 pt-2">
										<p className="border-border border-b font-medium text-xs">
											Exercises
										</p>
										{detailedData.exercises.slice(0, 3).map((exercise) => (
											<div key={exercise.exerciseName} className="space-y-1">
												<div className="flex items-center justify-between text-xs">
													<span className="truncate">
														{exercise.exerciseName}
													</span>
													<span className="text-muted-foreground">
														{exercise.completedTotalReps}/
														{exercise.targetTotalReps}
													</span>
												</div>
												<div className="h-1 w-full overflow-hidden rounded-full bg-muted">
													<div
														className={`h-full ${getProgressColorClasses(exercise.completionPercentage)}`}
														style={{
															width: `${exercise.completionPercentage}%`,
														}}
														role="progressbar"
														aria-valuenow={exercise.completionPercentage}
														aria-valuemin={0}
														aria-valuemax={100}
														aria-label={`${exercise.exerciseName} completion`}
													/>
												</div>
											</div>
										))}
										{detailedData.exercises.length > 3 && (
											<p className="text-center text-muted-foreground text-xs">
												+{detailedData.exercises.length - 3} more exercises
											</p>
										)}
									</div>
								)}
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}

/**
 * Loading state component
 */
export function ParticipantComparisonLoading() {
	return (
		<div className="flex items-center justify-center py-12">
			<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	);
}

/**
 * Error state component
 */
export function ParticipantComparisonError({ message }: { message: string }) {
	return (
		<Card className="border-destructive">
			<CardContent className="flex flex-col items-center justify-center py-8">
				<p className="font-medium text-destructive">
					Failed to load comparison
				</p>
				<p className="mt-2 text-muted-foreground text-sm">{message}</p>
			</CardContent>
		</Card>
	);
}
