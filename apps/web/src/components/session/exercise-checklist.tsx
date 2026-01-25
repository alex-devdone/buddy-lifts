"use client";

import { CheckCircle2, Circle, Dumbbell, Loader2, PenLine } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";

interface ExerciseChecklistProps {
	sessionId: string;
	userId: string;
	trainingId: string;
	showBodyOverlay?: boolean;
	className?: string;
	/** Callback when an exercise is selected for detailed input */
	onExerciseSelect?: (exerciseId: string) => void;
	/** Show progress input button instead of checkbox */
	showProgressInput?: boolean;
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

interface ExerciseProgress {
	id: string;
	sessionId: string;
	userId: string;
	exerciseId: string;
	completedReps: string;
	completedAt: string | null;
}

interface ExerciseWithProgress extends Exercise {
	progress?: ExerciseProgress;
	isCompleted: boolean;
	isOptimistic?: boolean;
}

/**
 * ExerciseChecklist Component
 *
 * Displays a checklist of exercises with completion status.
 * Can be displayed as a standalone list or as an overlay on the body visualization.
 * Users can check off exercises as they complete them.
 *
 * Features:
 * - Real-time updates via Supabase
 * - Checkbox for marking exercises complete/incomplete
 * - Visual indicators for completed exercises (green checkmark)
 * - Exercise details (name, sets, reps, weight)
 * - Mobile-first responsive design
 * - Optional overlay mode for body visualization
 */
export function ExerciseChecklist({
	sessionId,
	userId,
	trainingId,
	showBodyOverlay = false,
	className,
	onExerciseSelect,
	showProgressInput = false,
}: ExerciseChecklistProps) {
	// Optimistic state for immediate UI feedback
	const [optimisticUpdates, setOptimisticUpdates] = useState<
		Map<string, boolean>
	>(new Map());

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

	// Fetch exercise progress for this user using Supabase (read)
	const { data: allProgress = [], isLoading: progressLoading } =
		useSupabaseQuery<ExerciseProgress>({
			queryFn: (supabase) =>
				supabase
					.from("exercise_progress")
					.select("*")
					.eq("sessionId", sessionId)
					.eq("userId", userId),
			realtime: true,
			table: "exercise_progress",
		});

	// Create a map of exercise ID to progress for quick lookup
	const progressMap = useMemo(() => {
		return new Map(allProgress.map((p) => [p.exerciseId, p]));
	}, [allProgress]);

	// Combine exercises with their progress status and optimistic updates
	const exercisesWithProgress: ExerciseWithProgress[] = useMemo(() => {
		return exercises.map((exercise) => {
			const progress = progressMap.get(exercise.id);
			const optimisticState = optimisticUpdates.get(exercise.id);
			// Use optimistic state if available, otherwise use actual progress
			const isCompleted =
				optimisticState !== undefined
					? optimisticState
					: progress?.completedAt !== null;
			return {
				...exercise,
				progress,
				isCompleted,
				isOptimistic: optimisticState !== undefined,
			};
		});
	}, [exercises, progressMap, optimisticUpdates]);

	// tRPC mutation for recording exercise completion (toast removed, handled in optimistic callback)
	const recordProgress = trpc.progress.record.useMutation();

	// tRPC mutation for deleting exercise progress (toast removed, handled in optimistic callback)
	const deleteProgress = trpc.progress.delete.useMutation();

	// Handle checkbox change with optimistic updates
	const handleCheckboxChange = useCallback(
		(exercise: ExerciseWithProgress, checked: boolean) => {
			// Immediately update UI optimistically
			setOptimisticUpdates((prev) => new Map(prev).set(exercise.id, checked));

			if (checked) {
				// Mark as complete - record progress with target reps for all sets
				const completedReps = Array(exercise.targetSets).fill(
					exercise.targetReps,
				);
				recordProgress.mutate(
					{
						sessionId,
						exerciseId: exercise.id,
						completedReps: JSON.stringify(completedReps),
					},
					{
						onError: (error) => {
							// Rollback optimistic update on error
							setOptimisticUpdates((prev) => {
								const next = new Map(prev);
								next.delete(exercise.id);
								return next;
							});
							toast.error(error.message);
						},
						onSuccess: () => {
							// Clear optimistic state on success (server data will take over)
							setOptimisticUpdates((prev) => {
								const next = new Map(prev);
								next.delete(exercise.id);
								return next;
							});
						},
					},
				);
			} else {
				// Mark as incomplete - delete progress
				if (exercise.progress) {
					deleteProgress.mutate(
						{
							id: exercise.progress.id,
						},
						{
							onError: (error) => {
								// Rollback optimistic update on error
								setOptimisticUpdates((prev) => {
									const next = new Map(prev);
									next.delete(exercise.id);
									return next;
								});
								toast.error(error.message);
							},
							onSuccess: () => {
								// Clear optimistic state on success
								setOptimisticUpdates((prev) => {
									const next = new Map(prev);
									next.delete(exercise.id);
									return next;
								});
							},
						},
					);
				} else {
					// No progress record to delete, just clear optimistic state
					setOptimisticUpdates((prev) => {
						const next = new Map(prev);
						next.delete(exercise.id);
						return next;
					});
				}
			}
		},
		[sessionId, recordProgress, deleteProgress],
	);

	// Calculate completion stats
	const completedCount = exercisesWithProgress.filter(
		(e) => e.isCompleted,
	).length;
	const totalCount = exercisesWithProgress.length;
	const completionPercentage =
		totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

	// Loading state
	if (exercisesLoading || progressLoading) {
		return (
			<div className={cn("flex items-center justify-center py-8", className)}>
				<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	// Empty state
	if (exercises.length === 0) {
		return (
			<Card
				className={cn(
					"border-none bg-transparent shadow-none",
					showBodyOverlay && "bg-background/95 backdrop-blur-sm",
					className,
				)}
			>
				<CardContent className="flex flex-col items-center justify-center gap-2 py-8">
					<Dumbbell className="h-12 w-12 text-muted-foreground/30" />
					<p className="text-muted-foreground text-sm">No exercises yet</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card
			className={cn(
				"border-none shadow-none",
				showBodyOverlay && "bg-background/95 backdrop-blur-sm",
				className,
			)}
		>
			<CardHeader className="px-4 pt-4 pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Dumbbell className="h-4 w-4" />
						Exercises
					</CardTitle>
					<div className="flex items-center gap-2">
						<span className="text-muted-foreground text-xs">
							{completedCount}/{totalCount}
						</span>
						<span
							className={cn(
								"font-bold text-xs",
								completionPercentage === 100
									? "text-green-500"
									: "text-muted-foreground",
							)}
						>
							{completionPercentage}%
						</span>
					</div>
				</div>
			</CardHeader>

			<CardContent className="px-4 pb-4">
				<div className="flex flex-col gap-2">
					{exercisesWithProgress.map((exercise) => (
						<div
							key={exercise.id}
							className={cn(
								"group flex items-center gap-3 rounded-md border px-3 py-2.5 transition-colors",
								exercise.isCompleted
									? "border-green-500/30 bg-green-500/5"
									: "border-border bg-card",
								exercise.isOptimistic && "animate-pulse",
							)}
						>
							{/* Checkbox or Progress Input Button */}
							{showProgressInput && onExerciseSelect ? (
								<Button
									variant="ghost"
									size="icon-sm"
									onClick={() => onExerciseSelect(exercise.id)}
									className="shrink-0"
									aria-label={`Input progress for ${exercise.name}`}
								>
									<PenLine className="h-4 w-4" />
								</Button>
							) : (
								<Checkbox
									checked={exercise.isCompleted}
									onCheckedChange={(checked) =>
										handleCheckboxChange(exercise, checked === true)
									}
									aria-label={`Mark ${exercise.name} as ${exercise.isCompleted ? "incomplete" : "complete"}`}
									disabled={
										recordProgress.isPending || deleteProgress.isPending
									}
								/>
							)}

							{/* Exercise Info */}
							<div className="flex flex-1 items-center justify-between gap-2">
								<div className="flex flex-col gap-0.5">
									<span
										className={cn(
											"font-medium text-sm",
											exercise.isCompleted && "text-green-600",
										)}
									>
										{exercise.name}
									</span>
									<div className="flex items-center gap-2">
										<span className="text-muted-foreground text-xs">
											{exercise.targetSets}×{exercise.targetReps}
										</span>
										{exercise.weight && (
											<>
												<span className="text-muted-foreground/50 text-xs">
													·
												</span>
												<span className="text-muted-foreground text-xs">
													{exercise.weight} lbs
												</span>
											</>
										)}
										{exercise.restSeconds && (
											<>
												<span className="text-muted-foreground/50 text-xs">
													·
												</span>
												<span className="text-muted-foreground text-xs">
													{exercise.restSeconds}s rest
												</span>
											</>
										)}
									</div>
								</div>

								{/* Completion Icon */}
								<div className="flex shrink-0 items-center">
									{exercise.isCompleted ? (
										<CheckCircle2 className="h-5 w-5 text-green-500" />
									) : (
										<Circle className="h-5 w-5 text-muted-foreground/30" />
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
