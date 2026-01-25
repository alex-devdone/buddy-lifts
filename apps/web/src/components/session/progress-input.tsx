"use client";

import { Check, Loader2, Plus, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";

interface ProgressInputProps {
	sessionId: string;
	userId: string;
	trainingId: string;
	exerciseId: string;
	className?: string;
	onComplete?: () => void;
	showCompletedState?: boolean;
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

interface SetInput {
	setNumber: number;
	targetReps: number;
	actualReps: string;
}

/**
 * ProgressInput Component
 *
 * Input component for recording actual reps completed per set.
 * Users can input actual reps for each set (e.g., did 8 of 10 target reps).
 * Displays completion percentage based on actual reps vs target reps.
 *
 * Features:
 * - Dynamic set inputs based on exercise target sets
 * - Real-time percentage calculation
 * - Auto-fill all sets with target reps
 * - Clear all inputs
 * - Save progress via tRPC mutation
 * - Read existing progress and populate inputs
 * - Mobile-first responsive design with touch-friendly controls (min 44px targets)
 * - Visual feedback for completed state
 */
export function ProgressInput({
	sessionId,
	userId,
	trainingId,
	exerciseId,
	className,
	onComplete,
	showCompletedState = false,
}: ProgressInputProps) {
	// Fetch exercise details using Supabase (read)
	const { data: exercise, isLoading: exerciseLoading } =
		useSupabaseQuery<Exercise>({
			queryFn: (supabase) =>
				supabase.from("exercise").select("*").eq("id", exerciseId).single(),
			realtime: true,
			table: "exercise",
		});

	// Fetch existing progress using Supabase (read)
	const { data: existingProgress, isLoading: progressLoading } =
		useSupabaseQuery<ExerciseProgress[]>({
			queryFn: (supabase) =>
				supabase
					.from("exercise_progress")
					.select("*")
					.eq("sessionId", sessionId)
					.eq("userId", userId)
					.eq("exerciseId", exerciseId),
			realtime: true,
			table: "exercise_progress",
		});

	// Initialize set inputs based on exercise target sets
	const initializeSetInputs = useCallback(
		(
			targetSets: number,
			targetReps: number,
			progressData?: ExerciseProgress[],
		) => {
			const sets: SetInput[] = [];
			const existingReps = progressData?.[0]?.completedReps
				? (JSON.parse(progressData[0].completedReps) as number[])
				: [];

			for (let i = 0; i < targetSets; i++) {
				sets.push({
					setNumber: i + 1,
					targetReps,
					actualReps: existingReps[i]?.toString() || "",
				});
			}
			return sets;
		},
		[],
	);

	// State for set inputs
	const [setInputs, setSetInputs] = useState<SetInput[]>([]);

	// Initialize inputs when exercise data loads
	const [isInitialized, setIsInitialized] = useState(false);

	// Memoized check for existing progress
	const hasExistingProgress = useMemo(() => {
		return (
			existingProgress &&
			existingProgress.length > 0 &&
			existingProgress[0]?.completedAt !== null
		);
	}, [existingProgress]);

	// Initialize set inputs when exercise loads
	if (exercise && !isInitialized && !exerciseLoading) {
		const initialInputs = initializeSetInputs(
			exercise.targetSets,
			exercise.targetReps,
			existingProgress,
		);
		setSetInputs(initialInputs);
		setIsInitialized(true);
	}

	// tRPC mutation for recording exercise progress
	const recordProgress = trpc.progress.record.useMutation({
		onSuccess: () => {
			toast.success("Progress saved successfully!");
			onComplete?.();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	// tRPC mutation for updating exercise progress
	const updateProgress = trpc.progress.update.useMutation({
		onSuccess: () => {
			toast.success("Progress updated successfully!");
			onComplete?.();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	// Calculate completion percentage
	const { completionPercentage, totalCompletedReps, totalTargetReps } =
		useMemo(() => {
			if (!exercise) {
				return {
					completionPercentage: 0,
					totalCompletedReps: 0,
					totalTargetReps: 0,
				};
			}

			const totalTarget = exercise.targetSets * exercise.targetReps;
			const completed = setInputs.reduce((sum, set) => {
				const reps = Number.parseInt(set.actualReps, 10);
				return sum + (Number.isNaN(reps) ? 0 : reps);
			}, 0);

			const percentage =
				totalTarget > 0 ? Math.round((completed / totalTarget) * 100) : 0;

			return {
				completionPercentage: Math.min(percentage, 100),
				totalCompletedReps: completed,
				totalTargetReps: totalTarget,
			};
		}, [exercise, setInputs]);

	// Handle input change for a specific set
	const handleSetInputChange = useCallback(
		(setNumber: number, value: string) => {
			setSetInputs((prev) =>
				prev.map((set) =>
					set.setNumber === setNumber ? { ...set, actualReps: value } : set,
				),
			);
		},
		[],
	);

	// Auto-fill all sets with target reps
	const handleAutoFill = useCallback(() => {
		if (!exercise) return;

		setSetInputs((prev) =>
			prev.map((set) => ({
				...set,
				actualReps: set.targetReps.toString(),
			})),
		);
	}, [exercise]);

	// Clear all inputs
	const handleClear = useCallback(() => {
		setSetInputs((prev) =>
			prev.map((set) => ({
				...set,
				actualReps: "",
			})),
		);
	}, []);

	// Save progress
	const handleSave = useCallback(() => {
		if (!exercise) return;

		const completedReps = setInputs.map((set) => {
			const reps = Number.parseInt(set.actualReps, 10);
			return Number.isNaN(reps) ? 0 : reps;
		});

		// Validate at least one set has input
		if (completedReps.every((reps) => reps === 0)) {
			toast.error("Please enter reps for at least one set");
			return;
		}

		if (hasExistingProgress && existingProgress?.[0]) {
			// Update existing progress
			updateProgress.mutate({
				id: existingProgress[0].id,
				completedReps,
			});
		} else {
			// Create new progress
			recordProgress.mutate({
				sessionId,
				exerciseId,
				completedReps,
			});
		}
	}, [
		exercise,
		setInputs,
		sessionId,
		exerciseId,
		hasExistingProgress,
		existingProgress,
		recordProgress,
		updateProgress,
	]);

	// Loading state
	if (exerciseLoading || progressLoading || !exercise) {
		return (
			<div className={cn("flex items-center justify-center py-8", className)}>
				<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	// Completed state display
	if (showCompletedState && hasExistingProgress) {
		return (
			<Card
				className={cn(
					"border-green-500/30 bg-green-500/5",
					completionPercentage === 100 && "border-green-500/50 bg-green-500/10",
					className,
				)}
			>
				<CardContent className="flex flex-col items-center justify-center gap-2 py-6">
					<div
						className={cn(
							"flex h-12 w-12 items-center justify-center rounded-full",
							completionPercentage === 100
								? "bg-green-500 text-white"
								: "bg-green-500/20 text-green-600",
						)}
					>
						<Check className="h-6 w-6" />
					</div>
					<div className="flex flex-col items-center gap-1">
						<p className="font-semibold text-sm">{exercise.name}</p>
						<p className="text-muted-foreground text-xs">
							{totalCompletedReps} / {totalTargetReps} reps completed
						</p>
					</div>
					<div
						className={cn(
							"rounded-full px-3 py-1 font-bold text-xs",
							completionPercentage === 100
								? "bg-green-500 text-white"
								: "bg-green-500/20 text-green-600",
						)}
					>
						{completionPercentage}%
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={className}>
			<CardHeader className="px-4 pt-4 pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="font-semibold text-base">
						{exercise.name}
					</CardTitle>
					<div
						className={cn(
							"rounded-full px-3 py-1 font-bold text-sm",
							completionPercentage === 100
								? "bg-green-500 text-white"
								: completionPercentage >= 50
									? "bg-yellow-500/20 text-yellow-600"
									: "bg-gray-500/20 text-gray-600",
						)}
					>
						{completionPercentage}%
					</div>
				</div>
				{exercise.weight && (
					<p className="text-muted-foreground text-sm">{exercise.weight} lbs</p>
				)}
			</CardHeader>

			<CardContent className="px-4 pt-2 pb-4">
				<div className="flex flex-col gap-4">
					{/* Set inputs */}
					<div className="flex flex-col gap-3">
						<Label className="text-sm">Sets</Label>
						{setInputs.map((set) => (
							<div key={set.setNumber} className="flex items-center gap-3">
								<div className="flex w-20 shrink-0 items-center gap-1">
									<span className="text-muted-foreground text-sm">Set</span>
									<span className="font-semibold text-base">
										{set.setNumber}
									</span>
								</div>

								<div className="flex flex-1 items-center gap-2">
									<Input
										type="number"
										inputMode="numeric"
										placeholder="0"
										min="0"
										max={set.targetReps * 2}
										value={set.actualReps}
										onChange={(e) =>
											handleSetInputChange(set.setNumber, e.target.value)
										}
										aria-label={`Set ${set.setNumber} actual reps`}
										disabled={
											recordProgress.isPending || updateProgress.isPending
										}
										className="h-11 touch-manipulation text-base"
									/>
									<span className="text-muted-foreground text-sm">
										/ {set.targetReps}
									</span>
								</div>

								<span className="text-muted-foreground text-sm">reps</span>
							</div>
						))}
					</div>

					{/* Quick actions */}
					<div className="flex flex-wrap gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={handleAutoFill}
							disabled={
								recordProgress.isPending ||
								updateProgress.isPending ||
								hasExistingProgress
							}
							className="h-11 min-h-11 touch-manipulation gap-2 px-4 text-sm"
						>
							<Plus className="h-4 w-4" />
							Fill All
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={handleClear}
							disabled={
								recordProgress.isPending ||
								updateProgress.isPending ||
								hasExistingProgress
							}
							className="h-11 min-h-11 touch-manipulation gap-2 px-4 text-sm"
						>
							<X className="h-4 w-4" />
							Clear
						</Button>
					</div>

					{/* Summary and save */}
					<div className="flex items-center justify-between border-t pt-4">
						<div className="flex flex-col gap-0.5">
							<span className="text-muted-foreground text-sm">
								Total Progress
							</span>
							<span className="font-semibold text-base">
								{totalCompletedReps} / {totalTargetReps} reps
							</span>
						</div>
						<Button
							type="button"
							onClick={handleSave}
							disabled={
								recordProgress.isPending ||
								updateProgress.isPending ||
								setInputs.every((set) => set.actualReps === "")
							}
							className="h-11 min-h-11 touch-manipulation gap-2 px-6 text-base"
						>
							{(recordProgress.isPending || updateProgress.isPending) && (
								<Loader2 className="h-4 w-4 animate-spin" />
							)}
							{hasExistingProgress ? "Update" : "Save"} Progress
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
