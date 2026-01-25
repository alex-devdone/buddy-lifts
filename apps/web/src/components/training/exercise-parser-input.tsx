"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/utils/trpc";

interface ParsedExercise {
	name: string;
	targetSets: number;
	targetReps: number;
	weight?: number;
	order: number;
	restSeconds?: number;
}

interface ExerciseParserInputProps {
	trainingId: string;
	onSuccess?: (exercises: ParsedExercise[]) => void;
	onCancel?: () => void;
	placeholder?: string;
}

export function ExerciseParserInput({
	trainingId,
	onSuccess,
	onCancel,
	placeholder = "Describe your workout in natural language...\n\nExamples:\n• 10x4 pushup, 3x12 bench press\n• 5 sets of 10 squats at 135lbs\n• 10,10,8,6 pull ups and 4x15 planks",
}: ExerciseParserInputProps) {
	const [input, setInput] = useState("");
	const [showPreview, setShowPreview] = useState(false);

	// Parse mutation (preview only, doesn't save)
	const parseMutation = useMutation(
		trpc.exerciseParser.parse.mutationOptions({
			onSuccess: (data) => {
				setShowPreview(true);
				toast.success(
					`Parsed ${data.count} exercise${data.count !== 1 ? "s" : ""}`,
				);
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	// Parse and create mutation (saves to database)
	const parseAndCreateMutation = useMutation(
		trpc.exerciseParser.parseAndCreate.mutationOptions({
			onSuccess: (data) => {
				toast.success(
					`Added ${data.count} exercise${data.count !== 1 ? "s" : ""} to training`,
				);
				setInput("");
				setShowPreview(false);
				onSuccess?.(data.exercises as ParsedExercise[]);
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	const isLoading = parseMutation.isPending || parseAndCreateMutation.isPending;
	const parsedExercises = parseMutation.data?.exercises ?? [];

	const handleParse = () => {
		if (!input.trim()) {
			toast.error("Please enter some exercises to parse");
			return;
		}

		if (input.length < 3) {
			toast.error("Input must be at least 3 characters");
			return;
		}

		parseMutation.mutate({ input });
	};

	const handleAddToTraining = () => {
		if (parsedExercises.length === 0) return;

		parseAndCreateMutation.mutate({
			trainingId,
			input,
			replaceExisting: false,
		});
	};

	const handleReplaceExercises = () => {
		if (parsedExercises.length === 0) return;

		parseAndCreateMutation.mutate({
			trainingId,
			input,
			replaceExisting: true,
		});
	};

	const handleClear = () => {
		setInput("");
		setShowPreview(false);
		parseMutation.reset();
	};

	return (
		<div className="mx-auto w-full max-w-2xl p-4">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="font-semibold text-xl">
					<Sparkles className="mr-2 inline-block h-5 w-5" />
					AI Exercise Parser
				</h2>
				{onCancel && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onCancel}
						disabled={isLoading}
					>
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<Textarea
						placeholder={placeholder}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						disabled={isLoading}
						rows={6}
						className="resize-none"
					/>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button
						onClick={handleParse}
						disabled={isLoading || !input.trim()}
						variant="default"
						size="sm"
					>
						{isLoading && parseMutation.isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Parsing...
							</>
						) : (
							<>
								<Sparkles className="mr-2 h-4 w-4" />
								Preview
							</>
						)}
					</Button>
					<Button
						onClick={handleAddToTraining}
						disabled={!showPreview || isLoading || parsedExercises.length === 0}
						variant="secondary"
						size="sm"
					>
						Add to Training
					</Button>
					<Button
						onClick={handleReplaceExercises}
						disabled={!showPreview || isLoading || parsedExercises.length === 0}
						variant="destructive"
						size="sm"
					>
						Replace All
					</Button>
					<Button
						onClick={handleClear}
						disabled={isLoading || (!input && !showPreview)}
						variant="outline"
						size="sm"
					>
						Clear
					</Button>
				</div>

				{showPreview && parsedExercises.length > 0 && (
					<div className="space-y-2 rounded-md border bg-muted/50 p-4">
						<h3 className="mb-3 font-medium text-sm">
							Parsed {parsedExercises.length} Exercise
							{parsedExercises.length !== 1 ? "s" : ""}:
						</h3>
						<div className="space-y-2">
							{parsedExercises.map((exercise) => (
								<div
									key={`exercise-${exercise.order}`}
									className="flex items-center justify-between rounded-md bg-background p-3"
								>
									<div className="flex-1">
										<span className="font-medium">{exercise.name}</span>
										<span className="ml-2 text-muted-foreground text-sm">
											{exercise.targetSets}×{exercise.targetReps}
											{exercise.weight && ` @ ${exercise.weight}lbs`}
											{exercise.restSeconds &&
												` (${exercise.restSeconds}s rest)`}
										</span>
									</div>
									<span className="text-muted-foreground text-xs">
										#{exercise.order + 1}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				<div className="rounded-md bg-muted/30 p-3">
					<p className="text-muted-foreground text-xs">
						<strong>Supported formats:</strong> "10x4 pushup", "5 sets of 10
						bench press", "10,10,8,6 pull ups". Add weight with "@ 135lbs".
						Separate exercises with commas or "and".
					</p>
				</div>
			</div>
		</div>
	);
}
