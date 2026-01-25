"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/utils/trpc";

interface Training {
	id: string;
	name: string;
	description: string | null;
	userId: string;
	createdAt: string;
	updatedAt: string;
}

interface TrainingFormProps {
	training?: Training;
	onSuccess?: (training: Training) => void;
	onCancel?: () => void;
}

export function TrainingForm({
	training,
	onSuccess,
	onCancel,
}: TrainingFormProps) {
	const router = useRouter();
	const isEditing = !!training;

	const createTraining = useMutation(
		trpc.training.create.mutationOptions({
			onSuccess: (data) => {
				toast.success("Training created successfully");
				onSuccess?.(data as Training);
				if (!onSuccess) {
					router.push(`/trainings/${data.id}` as `/trainings/${string}`);
				}
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	const updateTraining = useMutation(
		trpc.training.update.mutationOptions({
			onSuccess: (data) => {
				toast.success("Training updated successfully");
				onSuccess?.(data as Training);
				if (!onSuccess) {
					router.back();
				}
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	const form = useForm({
		defaultValues: {
			name: training?.name ?? "",
			description: training?.description ?? "",
		},
		onSubmit: async ({ value }) => {
			if (!value.name.trim()) {
				toast.error("Training name is required");
				return;
			}

			if (isEditing) {
				updateTraining.mutate({
					id: training.id,
					...value,
				});
			} else {
				createTraining.mutate(value);
			}
		},
	});

	const isPending = createTraining.isPending || updateTraining.isPending;

	return (
		<div className="mx-auto w-full max-w-md p-4">
			<h1 className="mb-6 font-bold text-2xl">
				{isEditing ? "Edit Training" : "Create Training"}
			</h1>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<div>
					<form.Field name="name">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Training Name</Label>
								<Input
									id={field.name}
									name={field.name}
									type="text"
									placeholder="e.g., Upper Body Strength"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									disabled={isPending}
								/>
							</div>
						)}
					</form.Field>
				</div>

				<div>
					<form.Field name="description">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Description (Optional)</Label>
								<Textarea
									id={field.name}
									name={field.name}
									placeholder="Describe your training routine..."
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									disabled={isPending}
									rows={4}
								/>
							</div>
						)}
					</form.Field>
				</div>

				<form.Subscribe>
					{(state) => (
						<div className="flex gap-2">
							<Button
								type="submit"
								className="flex-1"
								disabled={!state.canSubmit || state.isSubmitting || isPending}
							>
								{isPending
									? "Saving..."
									: isEditing
										? "Update Training"
										: "Create Training"}
							</Button>
							{onCancel && (
								<Button
									type="button"
									variant="outline"
									onClick={onCancel}
									disabled={isPending}
								>
									Cancel
								</Button>
							)}
						</div>
					)}
				</form.Subscribe>
			</form>
		</div>
	);
}
