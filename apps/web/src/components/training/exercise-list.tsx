"use client";

import { useMutation } from "@tanstack/react-query";
import {
	AlertCircle,
	ArrowDown,
	ArrowUp,
	Dumbbell,
	Edit2,
	Trash2,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { trpc } from "@/utils/trpc";

interface Exercise {
	id: string;
	trainingId: string;
	name: string;
	targetSets: number;
	targetReps: number;
	weight: number | null;
	restSeconds: number | null;
	order: number;
}

interface ExerciseListProps {
	trainingId: string;
	currentUserId?: string;
	trainingUserId?: string;
	onEditExercise?: (exercise: Exercise) => void;
}

export function ExerciseList({
	trainingId,
	currentUserId,
	trainingUserId,
	onEditExercise,
}: ExerciseListProps) {
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

	const isOwner = currentUserId === trainingUserId;

	// Fetch exercises using Supabase (read)
	const { data: exercises = [], isLoading } = useSupabaseQuery<Exercise>({
		queryFn: (supabase) =>
			supabase
				.from("exercise")
				.select("*")
				.eq("trainingId", trainingId)
				.order("order", { ascending: true }),
		realtime: true,
		table: "exercise",
	});

	// Update exercise mutation
	const updateExercise = useMutation(
		trpc.exercise.update.mutationOptions({
			onSuccess: () => {
				toast.success("Exercise updated");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	// Delete exercise mutation
	const deleteExercise = useMutation(
		trpc.exercise.delete.mutationOptions({
			onSuccess: () => {
				toast.success("Exercise deleted");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	// Handle drag start
	const handleDragStart = useCallback((index: number) => {
		setDraggedIndex(index);
	}, []);

	// Handle drag over
	const handleDragOver = useCallback(
		(e: React.DragEvent, index: number) => {
			e.preventDefault();
			if (draggedIndex === null || draggedIndex === index) return;
			setDragOverIndex(index);
		},
		[draggedIndex],
	);

	// Handle drag end and reorder
	const handleDragEnd = useCallback(async () => {
		if (draggedIndex === null || dragOverIndex === null) {
			setDraggedIndex(null);
			setDragOverIndex(null);
			return;
		}

		if (draggedIndex === dragOverIndex) {
			setDraggedIndex(null);
			setDragOverIndex(null);
			return;
		}

		// Reorder exercises
		const newExercises = [...exercises];
		const [removed] = newExercises.splice(draggedIndex, 1);
		newExercises.splice(dragOverIndex, 0, removed);

		// Update all orders
		const updates = newExercises.map((exercise, index) =>
			updateExercise.mutateAsync({
				id: exercise.id,
				order: index,
			}),
		);

		try {
			await Promise.all(updates);
			toast.success("Exercises reordered");
		} catch (_error) {
			toast.error("Failed to reorder exercises");
		}

		setDraggedIndex(null);
		setDragOverIndex(null);
	}, [draggedIndex, dragOverIndex, exercises, updateExercise]);

	// Move exercise up
	const handleMoveUp = useCallback(
		async (index: number) => {
			if (index === 0) return;

			const newExercises = [...exercises];
			[newExercises[index - 1], newExercises[index]] = [
				newExercises[index],
				newExercises[index - 1],
			];

			const updates = newExercises.map((exercise, idx) =>
				updateExercise.mutateAsync({
					id: exercise.id,
					order: idx,
				}),
			);

			try {
				await Promise.all(updates);
			} catch (_error) {
				toast.error("Failed to move exercise");
			}
		},
		[exercises, updateExercise],
	);

	// Move exercise down
	const handleMoveDown = useCallback(
		async (index: number) => {
			if (index === exercises.length - 1) return;

			const newExercises = [...exercises];
			[newExercises[index], newExercises[index + 1]] = [
				newExercises[index + 1],
				newExercises[index],
			];

			const updates = newExercises.map((exercise, idx) =>
				updateExercise.mutateAsync({
					id: exercise.id,
					order: idx,
				}),
			);

			try {
				await Promise.all(updates);
			} catch (_error) {
				toast.error("Failed to move exercise");
			}
		},
		[exercises, updateExercise],
	);

	// Handle delete
	const handleDelete = useCallback(
		async (exercise: Exercise) => {
			if (
				!confirm(
					`Are you sure you want to delete "${exercise.name}"? This action cannot be undone.`,
				)
			) {
				return;
			}

			deleteExercise.mutate({ id: exercise.id });
		},
		[deleteExercise],
	);

	// Handle edit
	const handleEdit = useCallback(
		(exercise: Exercise) => {
			onEditExercise?.(exercise);
		},
		[onEditExercise],
	);

	if (isLoading) {
		return (
			<div className="space-y-2">
				{[1, 2, 3].map((i) => (
					<div key={i} className="h-20 animate-pulse rounded-md bg-muted/50" />
				))}
			</div>
		);
	}

	if (exercises.length === 0) {
		return (
			<Card className="border-dashed">
				<CardContent className="flex flex-col items-center justify-center py-8">
					<Dumbbell className="mb-2 h-10 w-10 text-muted-foreground" />
					<p className="text-muted-foreground text-sm">No exercises yet</p>
					<p className="text-muted-foreground text-xs">
						Add exercises using the AI parser or create them manually
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-2">
			{exercises.map((exercise, index) => (
				<Card
					key={exercise.id}
					draggable={isOwner}
					onDragStart={() => handleDragStart(index)}
					onDragOver={(e) => handleDragOver(e, index)}
					onDragEnd={handleDragEnd}
					className={`transition-all${isOwner ? "cursor-move hover:ring-2 hover:ring-primary/50" : "cursor-default"}
						${draggedIndex === index ? "opacity-50" : ""}
						${dragOverIndex === index ? "ring-2 ring-primary" : ""}
					`}
				>
					<CardHeader className="py-3">
						<div className="flex items-center gap-3">
							{/* Drag handle or number indicator */}
							<div
								className={`flex shrink-0 items-center justify-center rounded-md ${
									isOwner
										? "cursor-grab bg-muted active:cursor-grabbing"
										: "bg-muted/50"
								} h-8 w-8`}
							>
								<span className="font-medium text-xs">{index + 1}</span>
							</div>

							{/* Exercise info */}
							<div className="flex min-w-0 flex-1 flex-col">
								<CardTitle className="truncate text-sm">
									{exercise.name}
								</CardTitle>
								<div className="flex flex-wrap items-center gap-x-2 gap-y-0 text-muted-foreground text-xs">
									<span>
										{exercise.targetSets}×{exercise.targetReps}
									</span>
									{exercise.weight && <span>@ {exercise.weight}lbs</span>}
									{exercise.restSeconds && (
										<span>({exercise.restSeconds}s rest)</span>
									)}
								</div>
							</div>

							{/* Actions - only for owner */}
							{isOwner && (
								<div className="flex items-center gap-1">
									{/* Move up/down buttons */}
									<div className="flex flex-col">
										<Button
											variant="ghost"
											size="icon-sm"
											onClick={() => handleMoveUp(index)}
											disabled={index === 0}
											className="h-6 w-6"
										>
											<ArrowUp className="h-3 w-3" />
											<span className="sr-only">Move up</span>
										</Button>
										<Button
											variant="ghost"
											size="icon-sm"
											onClick={() => handleMoveDown(index)}
											disabled={index === exercises.length - 1}
											className="h-6 w-6"
										>
											<ArrowDown className="h-3 w-3" />
											<span className="sr-only">Move down</span>
										</Button>
									</div>

									<DropdownMenu>
										<DropdownMenuTrigger
											render={
												<Button
													variant="ghost"
													size="icon-sm"
													className="h-8 w-8"
												>
													<span className="sr-only">Actions</span>
													...
												</Button>
											}
										/>
										<DropdownMenuContent align="end">
											<DropdownMenuItem onClick={() => handleEdit(exercise)}>
												<Edit2 className="mr-2 h-4 w-4" />
												Edit
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => handleDelete(exercise)}
												disabled={deleteExercise.isPending}
												className="text-destructive focus:text-destructive"
											>
												<Trash2 className="mr-2 h-4 w-4" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							)}

							{/* View-only indicator for non-owners */}
							{!isOwner && (
								<div className="flex items-center gap-1 text-muted-foreground text-xs">
									<AlertCircle className="h-3 w-3" />
									<span className="sr-only">View only</span>
								</div>
							)}
						</div>
					</CardHeader>
				</Card>
			))}
		</div>
	);
}
