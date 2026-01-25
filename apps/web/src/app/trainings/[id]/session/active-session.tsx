"use client";

import { useMutation } from "@tanstack/react-query";
import {
	ArrowLeft,
	CheckCircle2,
	Dumbbell,
	Loader2,
	Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { BodyProgress } from "@/components/session/body-progress";
import { ExerciseChecklist } from "@/components/session/exercise-checklist";
import { InviteLinkDialog } from "@/components/session/invite-link-dialog";
import { LiveProgressBar } from "@/components/session/live-progress-bar";
import { ParticipantGrid } from "@/components/session/participant-grid";
import { ProgressInput } from "@/components/session/progress-input";
import { SessionLobby } from "@/components/session/session-lobby";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";

interface ActiveSessionProps {
	trainingId: string;
	sessionId: string;
	currentUserId: string;
}

interface Training {
	id: string;
	userId: string;
	name: string;
	description: string | null;
	createdAt: string;
	updatedAt: string;
}

interface TrainingSession {
	id: string;
	trainingId: string;
	hostUserId: string;
	inviteCode: string;
	accessType: "read" | "admin";
	status: "pending" | "active" | "completed";
	startedAt: string | null;
	completedAt: string | null;
	createdAt: string;
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

type SessionView = "lobby" | "progress" | "checklist";

/**
 * ActiveSession Component
 *
 * Main component for an active training session with real-time updates.
 * Handles session flow from lobby -> active workout -> completion.
 *
 * Features:
 * - Lobby view for waiting to start (host controls)
 * - Progress view with body visualization and participant grid
 * - Checklist view for marking exercises complete
 * - Real-time updates via Supabase
 * - Host controls (end session, invite sharing)
 * - Mobile-first responsive design
 *
 * Data Access:
 * - Read: Supabase (useSupabaseQuery) for all data
 * - Write: tRPC mutations for session management
 */
export function ActiveSession({
	trainingId,
	sessionId,
	currentUserId,
}: ActiveSessionProps) {
	const router = useRouter();
	const [currentView, setCurrentView] = useState<SessionView>("lobby");
	const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
		null,
	);

	// Fetch training details using Supabase (read)
	const { data: trainingData, isLoading: trainingLoading } =
		useSupabaseQuery<Training>({
			queryFn: (supabase) =>
				supabase.from("training").select("*").eq("id", trainingId).single(),
			realtime: false,
		});

	const training = trainingData?.[0];

	// Fetch session data using Supabase (read)
	const {
		data: sessionData,
		isLoading: sessionLoading,
		error: sessionError,
	} = useSupabaseQuery<TrainingSession>({
		queryFn: (supabase) =>
			supabase
				.from("training_session")
				.select("*")
				.eq("id", sessionId)
				.single(),
		realtime: true,
		table: "training_session",
	});

	const session = sessionData?.[0];

	// Fetch exercises using Supabase (read)
	const { data: exercises = [] } = useSupabaseQuery<Exercise>({
		queryFn: (supabase) =>
			supabase
				.from("exercise")
				.select("*")
				.eq("trainingId", trainingId)
				.order("order", { ascending: true }),
		realtime: true,
		table: "exercise",
	});

	// End session mutation (host only)
	const endSession = useMutation(
		trpc.session.end.mutationOptions({
			onSuccess: () => {
				toast.success("Session completed!");
				// Redirect to training detail after a short delay
				setTimeout(() => {
					router.push(`/trainings/${trainingId}`);
				}, 1500);
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	// Leave session mutation (non-host)
	const leaveSession = useMutation(
		trpc.session.leave.mutationOptions({
			onSuccess: () => {
				toast.success("Left session");
				router.push(`/trainings/${trainingId}`);
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	// Determine if current user is host
	const isHost = session?.hostUserId === currentUserId;

	// Update view based on session status
	useEffect(() => {
		if (!session) return;

		if (session.status === "pending") {
			setCurrentView("lobby");
		} else if (session.status === "active") {
			// Stay on current view or default to progress
			if (currentView === "lobby") {
				setCurrentView("progress");
			}
		} else if (session.status === "completed") {
			// Session completed - redirect after showing completion
			const redirectTimer = setTimeout(() => {
				router.push(`/trainings/${trainingId}`);
			}, 3000);
			return () => clearTimeout(redirectTimer);
		}
	}, [session, currentView, router, trainingId]);

	// Handle back to training
	const handleBackToTraining = useCallback(() => {
		router.push(`/trainings/${trainingId}`);
	}, [router, trainingId]);

	// Handle exercise selection for progress input
	const handleSelectExercise = useCallback((exerciseId: string) => {
		setSelectedExerciseId(exerciseId);
		setCurrentView("progress");
	}, []);

	// Handle deselect exercise (back to checklist)
	const handleDeselectExercise = useCallback(() => {
		setSelectedExerciseId(null);
		setCurrentView("checklist");
	}, []);

	// Handle end session
	const handleEndSession = useCallback(() => {
		if (
			!confirm(
				"Are you sure you want to end this session? This will complete the training for all participants.",
			)
		) {
			return;
		}
		endSession.mutate({ sessionId });
	}, [sessionId, endSession]);

	// Handle leave session
	const handleLeaveSession = useCallback(() => {
		if (
			!confirm(
				"Are you sure you want to leave this session? Your progress will be saved.",
			)
		) {
			return;
		}
		leaveSession.mutate({ sessionId });
	}, [sessionId, leaveSession]);

	// Loading state
	if (trainingLoading || sessionLoading || !training || !session) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="flex flex-col items-center gap-3">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					<p className="text-muted-foreground text-sm">Loading session...</p>
				</div>
			</div>
		);
	}

	// Error state
	if (sessionError || !session) {
		return (
			<Card className="border-destructive">
				<CardContent className="flex flex-col items-center justify-center gap-4 py-8">
					<p className="font-medium text-destructive text-sm">
						Session not found or failed to load
					</p>
					<Button variant="outline" size="sm" onClick={handleBackToTraining}>
						<ArrowLeft className="mr-1 h-4 w-4" />
						Back to Training
					</Button>
				</CardContent>
			</Card>
		);
	}

	// Completed state
	if (session.status === "completed") {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-12">
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
					<CheckCircle2 className="h-8 w-8 text-green-500" />
				</div>
				<div className="text-center">
					<h2 className="font-semibold text-lg">Session Completed!</h2>
					<p className="text-muted-foreground text-sm">
						Great job! Redirecting to training...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={handleBackToTraining}
							className="shrink-0"
							aria-label="Back to training"
						>
							<ArrowLeft className="h-4 w-4" />
						</Button>
						<h1 className="truncate font-semibold text-xl">{training.name}</h1>
					</div>
					{training.description && (
						<p className="line-clamp-2 text-muted-foreground text-sm">
							{training.description}
						</p>
					)}
				</div>

				<div className="flex flex-wrap items-center gap-2">
					{/* Session status badge */}
					<div
						className={cn(
							"flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium text-xs",
							session.status === "active"
								? "border-green-500/30 bg-green-500/10 text-green-600"
								: "border-yellow-500/30 bg-yellow-500/10 text-yellow-600",
						)}
					>
						<div
							className={cn(
								"h-2 w-2 rounded-full",
								session.status === "active" ? "bg-green-500" : "bg-yellow-500",
							)}
						/>
						{session.status === "active" ? "Live Session" : "Starting Soon"}
					</div>

					{/* Share invite button (host only) */}
					{isHost && <InviteLinkDialog sessionId={sessionId} />}

					{/* Leave/End button */}
					{isHost ? (
						<Button
							variant="destructive"
							size="sm"
							onClick={handleEndSession}
							disabled={endSession.isPending}
						>
							{endSession.isPending ? (
								<Loader2 className="mr-1 h-4 w-4 animate-spin" />
							) : null}
							End Session
						</Button>
					) : (
						<Button
							variant="outline"
							size="sm"
							onClick={handleLeaveSession}
							disabled={leaveSession.isPending}
						>
							{leaveSession.isPending ? (
								<Loader2 className="mr-1 h-4 w-4 animate-spin" />
							) : null}
							Leave
						</Button>
					)}
				</div>
			</div>

			{/* Lobby View - Pending sessions */}
			{session.status === "pending" && currentView === "lobby" && (
				<div className="flex justify-center">
					<SessionLobby
						sessionId={sessionId}
						onSessionStart={() => setCurrentView("progress")}
						onSessionLeave={handleLeaveSession}
					/>
				</div>
			)}

			{/* Active Session Views */}
			{session.status === "active" && (
				<>
					{/* View Toggle */}
					<div className="flex justify-center">
						<div className="inline-flex rounded-lg border bg-muted/50 p-1">
							<Button
								variant={currentView === "progress" ? "default" : "ghost"}
								size="sm"
								onClick={() => setCurrentView("progress")}
								className="gap-1"
							>
								<Users className="h-4 w-4" />
								<span className="hidden sm:inline">Progress</span>
							</Button>
							<Button
								variant={currentView === "checklist" ? "default" : "ghost"}
								size="sm"
								onClick={() => setCurrentView("checklist")}
								className="gap-1"
							>
								<Dumbbell className="h-4 w-4" />
								<span className="hidden sm:inline">Exercises</span>
							</Button>
						</div>
					</div>

					{/* Progress View */}
					{currentView === "progress" && (
						<div className="grid gap-6 lg:grid-cols-2">
							{/* Left Column - Live Progress & Participant Grid */}
							<div className="flex flex-col gap-6">
								<LiveProgressBar
									sessionId={sessionId}
									trainingId={trainingId}
									currentUserId={currentUserId}
								/>

								{exercises.length > 0 && (
									<ParticipantGrid
										sessionId={sessionId}
										currentUserId={currentUserId}
										hostUserId={session.hostUserId}
									/>
								)}
							</div>

							{/* Right Column - Body Progress & Exercise Input */}
							<div className="flex flex-col gap-6">
								{selectedExerciseId ? (
									<>
										<Button
											variant="outline"
											size="sm"
											onClick={handleDeselectExercise}
											className="w-fit gap-1"
										>
											<ArrowLeft className="h-4 w-4" />
											Back to Checklist
										</Button>
										<ProgressInput
											sessionId={sessionId}
											userId={currentUserId}
											trainingId={trainingId}
											exerciseId={selectedExerciseId}
										/>
									</>
								) : (
									<>
										{exercises.length > 0 && (
											<Card>
												<CardHeader>
													<CardTitle className="flex items-center gap-2">
														<Dumbbell className="h-5 w-5" />
														Your Progress
													</CardTitle>
												</CardHeader>
												<CardContent className="flex justify-center">
													<BodyProgress
														sessionId={sessionId}
														userId={currentUserId}
														trainingId={trainingId}
														size="lg"
														showLabel
													/>
												</CardContent>
											</Card>
										)}

										{exercises.length > 0 && (
											<ExerciseChecklist
												sessionId={sessionId}
												userId={currentUserId}
												trainingId={trainingId}
												onExerciseSelect={handleSelectExercise}
											/>
										)}
									</>
								)}
							</div>
						</div>
					)}

					{/* Checklist View */}
					{currentView === "checklist" && (
						<div className="mx-auto max-w-2xl">
							{exercises.length === 0 ? (
								<Card>
									<CardContent className="flex flex-col items-center justify-center gap-3 py-12">
										<Dumbbell className="h-12 w-12 text-muted-foreground/30" />
										<p className="text-muted-foreground text-sm">
											No exercises in this training yet
										</p>
										<Button
											variant="outline"
											size="sm"
											onClick={handleBackToTraining}
										>
											Add Exercises
										</Button>
									</CardContent>
								</Card>
							) : (
								<ExerciseChecklist
									sessionId={sessionId}
									userId={currentUserId}
									trainingId={trainingId}
									onExerciseSelect={handleSelectExercise}
									showProgressInput
								/>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
}
