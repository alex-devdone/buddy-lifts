"use client";

import { useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
	ArrowLeft,
	Calendar,
	Dumbbell,
	Edit2,
	Plus,
	Sparkles,
	Trash2,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ExerciseList } from "@/components/training/exercise-list";
import { ExerciseParserInput } from "@/components/training/exercise-parser-input";
import { TrainingForm } from "@/components/training/training-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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

interface TrainingDetailProps {
	trainingId: string;
	currentUserId: string;
}

export function TrainingDetail({
	trainingId,
	currentUserId,
}: TrainingDetailProps) {
	const router = useRouter();
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isAddExerciseDialogOpen, setIsAddExerciseDialogOpen] = useState(false);
	const [editingTraining, setEditingTraining] = useState<Training | undefined>(
		undefined,
	);

	// Fetch training using Supabase (read)
	const {
		data: training,
		isLoading: isLoadingTraining,
		error: trainingError,
	} = useSupabaseQuery<Training>({
		queryFn: (supabase) =>
			supabase.from("training").select("*").eq("id", trainingId).single(),
	});

	// Fetch exercises using Supabase (read)
	const { data: exercises = [], isLoading: isLoadingExercises } =
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

	// Delete training mutation
	const deleteTraining = useMutation(
		trpc.training.delete.mutationOptions({
			onSuccess: () => {
				toast.success("Training deleted successfully");
				router.push("/trainings");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	// Start session mutation
	const startSession = useMutation(
		trpc.session.start.mutationOptions({
			onSuccess: (_data) => {
				toast.success("Session started");
				router.push(`/trainings/${trainingId}/session`);
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	const handleDelete = () => {
		if (
			confirm(
				"Are you sure you want to delete this training? This will also delete all exercises and cannot be undone.",
			)
		) {
			deleteTraining.mutate({ id: trainingId });
		}
	};

	const handleEdit = () => {
		setEditingTraining(training?.[0]);
		setIsEditDialogOpen(true);
	};

	const handleEditSuccess = () => {
		setIsEditDialogOpen(false);
		setEditingTraining(undefined);
	};

	const handleAddExerciseSuccess = () => {
		setIsAddExerciseDialogOpen(false);
	};

	const handleStartSession = () => {
		startSession.mutate({
			trainingId,
			accessType: "admin",
		});
	};

	if (trainingError) {
		return (
			<Card className="border-destructive">
				<CardContent className="flex flex-col items-center justify-center py-12">
					<p className="text-destructive text-sm">
						Failed to load training. {trainingError.message}
					</p>
					<Button
						variant="outline"
						className="mt-4"
						onClick={() => router.push("/trainings")}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Trainings
					</Button>
				</CardContent>
			</Card>
		);
	}

	if (isLoadingTraining) {
		return (
			<div className="space-y-6">
				<div className="h-8 w-48 animate-pulse rounded-md bg-muted/50" />
				<div className="h-32 w-full animate-pulse rounded-md bg-muted/50" />
			</div>
		);
	}

	if (!training) {
		return (
			<Card className="border-dashed">
				<CardContent className="flex flex-col items-center justify-center py-12">
					<p className="text-muted-foreground text-sm">Training not found</p>
					<Button
						variant="outline"
						className="mt-4"
						onClick={() => router.push("/trainings")}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Trainings
					</Button>
				</CardContent>
			</Card>
		);
	}

	const isOwner = currentUserId === training[0]?.userId;
	const exerciseCount = exercises.length;
	const timeAgo = formatDistanceToNow(new Date(training[0]?.createdAt || ""), {
		addSuffix: true,
	});

	return (
		<div className="space-y-6">
			{/* Back Button */}
			<Button
				variant="ghost"
				size="sm"
				onClick={() => router.push("/trainings")}
				className="gap-2 px-0"
			>
				<ArrowLeft className="h-4 w-4" />
				Back to Trainings
			</Button>

			{/* Training Header */}
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between gap-4">
						<div className="flex min-w-0 flex-1 flex-col gap-2">
							<div className="flex items-center gap-2">
								<Dumbbell className="h-6 w-6 shrink-0 text-primary" />
								<CardTitle className="text-xl md:text-2xl">
									{training[0]?.name}
								</CardTitle>
							</div>
							{training[0]?.description && (
								<CardDescription className="line-clamp-2">
									{training[0].description}
								</CardDescription>
							)}
							<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-xs">
								<span className="flex items-center gap-1">
									<User className="h-3 w-3" />
									{isOwner ? "Created by you" : "Created by someone else"}
								</span>
								<span className="flex items-center gap-1">
									<Calendar className="h-3 w-3" />
									Created {timeAgo}
								</span>
								<span className="flex items-center gap-1">
									<Dumbbell className="h-3 w-3" />
									{exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""}
								</span>
							</div>
						</div>
						{isOwner && (
							<div className="flex shrink-0 gap-2">
								<DropdownMenu>
									<DropdownMenuTrigger
										render={
											<Button variant="outline" size="sm">
												<Edit2 className="mr-2 h-4 w-4" />
												Edit
											</Button>
										}
									/>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onClick={handleEdit}>
											<Edit2 className="mr-2 h-4 w-4" />
											Edit Details
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={handleDelete}
											disabled={deleteTraining.isPending}
											className="text-destructive focus:text-destructive"
										>
											<Trash2 className="mr-2 h-4 w-4" />
											Delete Training
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						)}
					</div>
				</CardHeader>
			</Card>

			{/* Actions - Owner Only */}
			{isOwner && (
				<div className="flex flex-wrap gap-2">
					<Dialog
						open={isAddExerciseDialogOpen}
						onOpenChange={setIsAddExerciseDialogOpen}
					>
						<DialogTrigger>
							<Button variant="default" size="default">
								<Sparkles className="mr-2 h-4 w-4" />
								Add Exercises with AI
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add Exercises</DialogTitle>
								<DialogDescription>
									Use natural language to describe your workout
								</DialogDescription>
							</DialogHeader>
							<ExerciseParserInput
								trainingId={trainingId}
								onSuccess={handleAddExerciseSuccess}
								onCancel={() => setIsAddExerciseDialogOpen(false)}
							/>
						</DialogContent>
					</Dialog>

					<Button
						variant="secondary"
						size="default"
						onClick={handleStartSession}
						disabled={startSession.isPending || exerciseCount === 0}
					>
						<Plus className="mr-2 h-4 w-4" />
						Start Session
					</Button>
				</div>
			)}

			{/* Exercise List */}
			<div className="space-y-3">
				<h2 className="font-semibold text-lg">Exercises</h2>
				{isLoadingExercises ? (
					<div className="space-y-2">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-20 animate-pulse rounded-md bg-muted/50"
							/>
						))}
					</div>
				) : (
					<ExerciseList
						trainingId={trainingId}
						currentUserId={currentUserId}
						trainingUserId={training[0]?.userId}
					/>
				)}
			</div>

			{/* Edit Training Dialog */}
			{isOwner && editingTraining && (
				<Dialog
					open={isEditDialogOpen}
					onOpenChange={(open) => {
						setIsEditDialogOpen(open);
						if (!open) setEditingTraining(undefined);
					}}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Edit Training</DialogTitle>
							<DialogDescription>
								Update your training details
							</DialogDescription>
						</DialogHeader>
						<TrainingForm
							training={editingTraining}
							onSuccess={handleEditSuccess}
							onCancel={() => {
								setIsEditDialogOpen(false);
								setEditingTraining(undefined);
							}}
						/>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
