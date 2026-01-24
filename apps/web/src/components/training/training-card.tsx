"use client";

import { useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Dumbbell, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { trpc } from "@/utils/trpc";

interface Training {
	id: string;
	name: string;
	description: string | null;
	userId: string;
	createdAt: string;
	updatedAt: string;
}

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

interface TrainingCardProps {
	training: Training;
	onEdit?: (training: Training) => void;
	currentUserId?: string;
}

export function TrainingCard({
	training,
	onEdit,
	currentUserId,
}: TrainingCardProps) {
	const isOwner = currentUserId === training.userId;

	// Fetch exercises for this training to get count
	const { data: exercises, isLoading: isLoadingExercises } =
		useSupabaseQuery<Exercise>({
			queryFn: (supabase) =>
				supabase
					.from("exercise")
					.select("*")
					.eq("trainingId", training.id)
					.order("order", { ascending: true }),
		});

	const deleteTraining = useMutation(
		trpc.training.delete.mutationOptions({
			onSuccess: () => {
				toast.success("Training deleted successfully");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	const handleDelete = () => {
		if (confirm("Are you sure you want to delete this training?")) {
			deleteTraining.mutate({ id: training.id });
		}
	};

	const handleEdit = () => {
		onEdit?.(training);
	};

	const exerciseCount = exercises?.length ?? 0;
	const timeAgo = formatDistanceToNow(new Date(training.createdAt), {
		addSuffix: true,
	});

	return (
		<Card className="group transition-all hover:ring-2 hover:ring-primary/50">
			<CardHeader>
				<div className="flex items-start justify-between gap-2">
					<div className="flex min-w-0 flex-1 items-center gap-2">
						<Dumbbell className="h-5 w-5 shrink-0 text-primary" />
						<CardTitle className="truncate">{training.name}</CardTitle>
					</div>
					{isOwner && (
						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<Button variant="ghost" size="icon-sm" className="shrink-0">
										<MoreVertical className="h-4 w-4" />
										<span className="sr-only">Actions</span>
									</Button>
								}
							/>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={handleEdit}>
									<Pencil className="mr-2 h-4 w-4" />
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={handleDelete}
									disabled={deleteTraining.isPending}
									className="text-destructive focus:text-destructive"
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
				{training.description && (
					<CardDescription className="line-clamp-2">
						{training.description}
					</CardDescription>
				)}
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between text-muted-foreground text-xs">
					<div className="flex items-center gap-1">
						{isLoadingExercises ? (
							<span>Loading exercises...</span>
						) : (
							<>
								<Dumbbell className="h-3 w-3" />
								<span>
									{exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""}
								</span>
							</>
						)}
					</div>
					<span>Created {timeAgo}</span>
				</div>
			</CardContent>
		</Card>
	);
}
