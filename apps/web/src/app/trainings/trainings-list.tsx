"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TrainingCard } from "@/components/training/training-card";
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
	DialogTrigger,
} from "@/components/ui/dialog";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";

interface Training {
	id: string;
	name: string;
	description: string | null;
	userId: string;
	createdAt: string;
	updatedAt: string;
}

interface TrainingsListProps {
	currentUserId: string;
}

export function TrainingsList({ currentUserId }: TrainingsListProps) {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [editingTraining, setEditingTraining] = useState<Training | undefined>(
		undefined,
	);

	const {
		data: trainings,
		isLoading,
		error,
		refetch,
	} = useSupabaseQuery<Training>({
		queryFn: (supabase) =>
			supabase
				.from("training")
				.select("*")
				.eq("userId", currentUserId)
				.order("createdAt", { ascending: false }),
		realtime: true,
		table: "training",
	});

	const handleCreateSuccess = () => {
		setIsCreateDialogOpen(false);
		refetch();
	};

	const handleEdit = (training: Training) => {
		setEditingTraining(training);
	};

	const handleEditSuccess = () => {
		setEditingTraining(undefined);
		refetch();
	};

	const handleEditCancel = () => {
		setEditingTraining(undefined);
	};

	if (error) {
		toast.error(error.message);
	}

	return (
		<div className="space-y-6">
			{/* Create Training Button */}
			<div className="flex justify-end">
				<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
					<DialogTrigger asChild>
						<Button variant="default" size="default">
							<Plus className="mr-2 h-4 w-4" />
							Create Training
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<CardTitle>Create New Training</CardTitle>
							<CardDescription>
								Start by creating a new workout routine
							</CardDescription>
						</DialogHeader>
						<TrainingForm onSuccess={handleCreateSuccess} />
					</DialogContent>
				</Dialog>
			</div>

			{/* Edit Training Dialog */}
			{editingTraining && (
				<Dialog open={!!editingTraining} onOpenChange={handleEditCancel}>
					<DialogContent>
						<DialogHeader>
							<CardTitle>Edit Training</CardTitle>
							<CardDescription>Update your training details</CardDescription>
						</DialogHeader>
						<TrainingForm
							training={editingTraining}
							onSuccess={handleEditSuccess}
							onCancel={handleEditCancel}
						/>
					</DialogContent>
				</Dialog>
			)}

			{/* Training List */}
			{isLoading ? (
				<div className="grid gap-4 sm:grid-cols-2">
					{[1, 2].map((i) => (
						<Card key={i} className="h-40 animate-pulse" />
					))}
				</div>
			) : trainings && trainings.length > 0 ? (
				<div className="grid gap-4 sm:grid-cols-2">
					{trainings.map((training) => (
						<TrainingCard
							key={training.id}
							training={training}
							onEdit={handleEdit}
							currentUserId={currentUserId}
						/>
					))}
				</div>
			) : (
				<Card className="border-dashed">
					<CardContent className="flex flex-col items-center justify-center py-12">
						<p className="text-muted-foreground text-sm">
							No trainings yet. Create your first one to get started!
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
