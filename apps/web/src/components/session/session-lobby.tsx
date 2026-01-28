"use client";

import { useMutation } from "@tanstack/react-query";
import { Copy, Loader2, Lock, LockOpen, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { trpc } from "@/utils/trpc";
import { SessionLobbySkeleton } from "./session-lobby-skeleton";

interface SessionLobbyProps {
	sessionId: string;
	onSessionStart?: () => void;
	onSessionLeave?: () => void;
}

interface Participant {
	id: string;
	sessionId: string;
	userId: string;
	role: "host" | "admin" | "read";
	joinedAt: string;
	user?: {
		id: string;
		name: string;
		email: string;
	};
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
}

/**
 * SessionLobby Component
 *
 * A waiting room component for training sessions where:
 * - Host can see invite code, copy link, change access type, and start session
 * - Participants can see who else has joined and leave if needed
 * - Real-time updates for participant list
 *
 * Mobile-first design with responsive layout.
 */
export function SessionLobby({
	sessionId,
	onSessionStart,
	onSessionLeave,
}: SessionLobbyProps) {
	const [copied, setCopied] = useState(false);
	const participantIdsRef = useRef<Set<string>>(new Set());
	const hasLoadedParticipantsRef = useRef(false);

	// Fetch session data using Supabase (read)
	const {
		data: sessionData,
		isLoading: sessionLoading,
		error: sessionError,
	} = useSupabaseQuery<TrainingSession>({
		queryFn: (supabase) =>
			supabase.from("training_session").select("*").eq("id", sessionId),
		realtime: true,
		table: "training_session",
	});

	const session = sessionData?.[0];

	// Fetch participants using Supabase (read)
	const { data: participants = [], isLoading: participantsLoading } =
		useSupabaseQuery<Participant>({
			queryFn: (supabase) =>
				supabase
					.from("session_participant")
					.select(
						`
					*,
					user:user_id(id,name,email)
				`,
					)
					.eq("sessionId", sessionId)
					.order("joinedAt", { ascending: true }),
			realtime: true,
			table: "session_participant",
		});

	// Update access type mutation (host only)
	const updateAccess = useMutation(
		trpc.session.updateAccess.mutationOptions({
			onSuccess: () => {
				toast.success("Access type updated");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	// Leave session mutation
	const leaveSession = useMutation(
		trpc.session.leave.mutationOptions({
			onSuccess: () => {
				toast.success("Left session");
				onSessionLeave?.();
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	// End session mutation (host only)
	const endSession = useMutation(
		trpc.session.end.mutationOptions({
			onSuccess: () => {
				toast.success("Session ended");
				onSessionStart?.();
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	// Get current user ID from auth
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);

	useEffect(() => {
		// This would normally come from auth context
		// For now, we'll use a placeholder
		// In production, this would be from the auth session
		const fetchCurrentUser = async () => {
			try {
				const { createClient } = await import("@/lib/supabase/client");
				const supabase = createClient();
				const {
					data: { user },
				} = await supabase.auth.getUser();
				setCurrentUserId(user?.id || null);
			} catch {
				setCurrentUserId(null);
			}
		};
		fetchCurrentUser();
	}, []);

	// Determine if current user is host
	const isHost = currentUserId && session?.hostUserId === currentUserId;

	useEffect(() => {
		if (participantsLoading) {
			return;
		}

		const currentParticipantIds = new Set(participants.map((p) => p.userId));

		if (!hasLoadedParticipantsRef.current) {
			participantIdsRef.current = currentParticipantIds;
			hasLoadedParticipantsRef.current = true;
			return;
		}

		const newParticipants = participants.filter(
			(participant) => !participantIdsRef.current.has(participant.userId),
		);

		if (newParticipants.length > 0) {
			newParticipants.forEach((participant) => {
				if (participant.userId === currentUserId) {
					return;
				}
				const label =
					participant.user?.name || participant.user?.email || "A participant";
				toast.success(`${label} joined the session`);
			});
		}

		participantIdsRef.current = currentParticipantIds;
	}, [participants, participantsLoading, currentUserId]);

	// Copy invite link to clipboard
	const handleCopyInviteLink = useCallback(() => {
		if (!session?.inviteCode) return;

		const inviteUrl = `${window.location.origin}/join/${session.inviteCode}`;
		navigator.clipboard.writeText(inviteUrl).then(() => {
			setCopied(true);
			toast.success("Invite link copied!");
			setTimeout(() => setCopied(false), 2000);
		});
	}, [session?.inviteCode]);

	// Toggle access type
	const handleToggleAccess = useCallback(() => {
		if (!session) return;

		const newAccessType = session.accessType === "read" ? "admin" : "read";
		updateAccess.mutate({
			sessionId,
			accessType: newAccessType,
		});
	}, [session, sessionId, updateAccess]);

	// Handle leave session
	const handleLeave = useCallback(() => {
		if (
			!confirm(
				"Are you sure you want to leave this session? You can rejoin if the session is still active.",
			)
		) {
			return;
		}
		leaveSession.mutate({ sessionId });
	}, [sessionId, leaveSession]);

	// Handle end session (host)
	const handleEndSession = useCallback(() => {
		if (
			!confirm(
				"Are you sure you want to end this session? This will complete the training session.",
			)
		) {
			return;
		}
		endSession.mutate({ sessionId });
	}, [sessionId, endSession]);

	if (sessionLoading || participantsLoading) {
		return <SessionLobbySkeleton />;
	}

	if (sessionError || !session) {
		return (
			<Card className="border-destructive">
				<CardContent className="flex flex-col items-center justify-center py-8">
					<p className="font-medium text-destructive text-sm">
						Session not found or failed to load
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="flex w-full max-w-md flex-col gap-4">
			{/* Session Info Card */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="h-5 w-5" />
						Session Lobby
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Invite Code - Host Only */}
					{isHost && (
						<div className="space-y-2">
							<span className="font-medium text-muted-foreground text-xs">
								Invite Code
							</span>
							<div className="flex items-center gap-2">
								<div className="flex flex-1 items-center rounded-md border bg-muted px-3 py-2">
									<span className="font-bold font-mono text-sm">
										{session.inviteCode}
									</span>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={handleCopyInviteLink}
									className="shrink-0"
								>
									{copied ? (
										<>
											<span className="sr-only">Copied!</span>
											Copied!
										</>
									) : (
										<>
											<Copy className="mr-1 h-4 w-4" />
											Copy Link
										</>
									)}
								</Button>
							</div>
						</div>
					)}

					{/* Access Type Toggle - Host Only */}
					{isHost && (
						<div className="space-y-2">
							<span className="font-medium text-muted-foreground text-xs">
								Participant Access
							</span>
							<Button
								variant="outline"
								size="sm"
								onClick={handleToggleAccess}
								disabled={updateAccess.isPending}
								className="w-full justify-start"
							>
								{session.accessType === "read" ? (
									<>
										<Lock className="mr-2 h-4 w-4" />
										Read Only - Participants can view but not modify
									</>
								) : (
									<>
										<LockOpen className="mr-2 h-4 w-4" />
										Admin - Participants can modify exercises
									</>
								)}
							</Button>
						</div>
					)}

					{/* Status */}
					<div className="flex items-center gap-2">
						<div
							className={`h-2 w-2 rounded-full ${session.status === "active" ? "bg-green-500" : "bg-muted-foreground"}`}
						/>
						<span className="text-muted-foreground text-xs capitalize">
							{session.status === "active"
								? "Session Active"
								: session.status === "pending"
									? "Waiting to start"
									: "Completed"}
						</span>
					</div>
				</CardContent>
			</Card>

			{/* Participants Card */}
			<Card>
				<CardHeader>
					<CardTitle className="text-sm">
						Participants ({participants.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					{participants.length === 0 ? (
						<p className="text-center text-muted-foreground text-sm">
							No participants yet. Share the invite code to get started!
						</p>
					) : (
						<ul className="space-y-2">
							{participants.map((participant) => (
								<li
									key={participant.id}
									className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2"
								>
									<div className="flex min-w-0 flex-1 flex-col">
										<span className="truncate font-medium text-foreground text-sm">
											{participant.user?.name ||
												participant.user?.email ||
												"Anonymous User"}
										</span>
										<span className="text-muted-foreground text-xs capitalize">
											{participant.role}
											{participant.userId === session.hostUserId && " (Host)"}
										</span>
									</div>
								</li>
							))}
						</ul>
					)}
				</CardContent>
			</Card>

			{/* Action Buttons */}
			<div className="flex gap-2">
				{/* Leave Button - Non-host */}
				{!isHost && (
					<Button
						variant="outline"
						onClick={handleLeave}
						disabled={leaveSession.isPending}
						className="flex-1"
					>
						Leave Session
					</Button>
				)}

				{/* End Session Button - Host */}
				{isHost && (
					<Button
						variant="default"
						onClick={handleEndSession}
						disabled={endSession.isPending}
						className="flex-1"
					>
						{endSession.isPending ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : null}
						End Session
					</Button>
				)}
			</div>
		</div>
	);
}
