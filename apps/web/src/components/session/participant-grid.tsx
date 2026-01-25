"use client";

import { Activity, Crown, Loader2, Shield, Trash2, User } from "lucide-react";
import { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";

interface ParticipantGridProps {
	sessionId: string;
	currentUserId?: string;
	hostUserId?: string;
	showKickButton?: boolean;
	onKickParticipant?: (userId: string) => void;
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

interface ExerciseProgress {
	id: string;
	sessionId: string;
	userId: string;
	exerciseId: string;
	completedReps: string;
	completedAt: string | null;
}

/**
 * ParticipantGrid Component
 *
 * Displays 1-3 participants in a mobile-responsive grid layout.
 * Shows participant info, role badges, progress indicators, and action buttons.
 * Uses hybrid pattern: reads from Supabase (real-time), writes via tRPC.
 *
 * Grid layout:
 * - 1 participant: Single column, centered
 * - 2 participants: 2 columns, equal width
 * - 3 participants: 3 columns, equal width
 *
 * Mobile-first design with responsive breakpoints.
 */
export function ParticipantGrid({
	sessionId,
	currentUserId,
	hostUserId,
	showKickButton = false,
	onKickParticipant,
}: ParticipantGridProps) {
	const isHost = currentUserId === hostUserId;

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

	// Fetch all exercise progress for this session using Supabase (read)
	const { data: allProgress = [] } = useSupabaseQuery<ExerciseProgress>({
		queryFn: (supabase) =>
			supabase.from("exercise_progress").select("*").eq("sessionId", sessionId),
		realtime: true,
		table: "exercise_progress",
	});

	// Calculate progress percentage for a participant
	const calculateProgress = useCallback(
		(userId: string) => {
			const userProgress = allProgress.filter((p) => p.userId === userId);
			if (userProgress.length === 0) return 0;

			const completedCount = userProgress.filter((p) => p.completedAt).length;
			return Math.round((completedCount / userProgress.length) * 100);
		},
		[allProgress],
	);

	// Get role icon
	const getRoleIcon = useCallback((role: Participant["role"]) => {
		switch (role) {
			case "host":
				return <Crown className="h-3 w-3" />;
			case "admin":
				return <Shield className="h-3 w-3" />;
			case "read":
				return <User className="h-3 w-3" />;
			default:
				return null;
		}
	}, []);

	// Get role badge color
	const getRoleBadgeColor = useCallback((role: Participant["role"]) => {
		switch (role) {
			case "host":
				return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
			case "admin":
				return "bg-blue-500/10 text-blue-600 border-blue-500/20";
			case "read":
				return "bg-gray-500/10 text-gray-600 border-gray-500/20";
			default:
				return "bg-gray-500/10 text-gray-600 border-gray-500/20";
		}
	}, []);

	// Get progress color based on percentage
	const getProgressColor = useCallback((percentage: number) => {
		if (percentage === 100) return "bg-green-500";
		if (percentage >= 50) return "bg-yellow-500";
		return "bg-gray-300";
	}, []);

	// Handle kick participant
	const handleKick = useCallback(
		async (participant: Participant) => {
			if (
				!confirm(
					`Are you sure you want to remove ${participant.user?.name || participant.user?.email || "this participant"}?`,
				)
			) {
				return;
			}

			if (onKickParticipant) {
				onKickParticipant(participant.userId);
			}
		},
		[onKickParticipant],
	);

	// Determine grid columns based on participant count
	const gridClass = useMemo(() => {
		const count = participants.length;
		if (count === 1) return "grid-cols-1 max-w-xs mx-auto";
		if (count === 2) return "grid-cols-1 sm:grid-cols-2";
		return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
	}, [participants.length]);

	if (participantsLoading) {
		return (
			<div className="flex items-center justify-center py-8">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (participants.length === 0) {
		return (
			<Card className="border-dashed">
				<CardContent className="flex flex-col items-center justify-center py-8">
					<Users className="mb-2 h-10 w-10 text-muted-foreground" />
					<p className="text-muted-foreground text-sm">No participants yet</p>
					<p className="text-muted-foreground text-xs">
						Share the invite link to get started
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className={`grid gap-4 ${gridClass}`}>
			{participants.map((participant) => {
				const progress = calculateProgress(participant.userId);
				const isCurrentUser = participant.userId === currentUserId;
				const canKick =
					isHost && showKickButton && participant.userId !== currentUserId;

				return (
					<Card
						key={participant.id}
						className={`relative transition-all ${
							isCurrentUser
								? "ring-2 ring-primary/50"
								: "hover:ring-1 hover:ring-primary/20"
						}`}
					>
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between gap-2">
								<div className="flex min-w-0 flex-1 flex-col gap-1">
									{/* Participant name and role */}
									<div className="flex items-center gap-2">
										<h3 className="truncate font-medium text-sm">
											{participant.user?.name ||
												participant.user?.email ||
												"Unknown User"}
										</h3>
										<span
											className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${getRoleBadgeColor(participant.role)}`}
										>
											{getRoleIcon(participant.role)}
											<span className="capitalize">{participant.role}</span>
										</span>
									</div>

									{/* Current user badge */}
									{isCurrentUser && (
										<span className="text-muted-foreground text-xs">You</span>
									)}
								</div>

								{/* Kick button (host only) */}
								{canKick && (
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => handleKick(participant)}
										className="h-6 w-6 shrink-0 text-destructive hover:text-destructive"
									>
										<Trash2 className="h-3 w-3" />
										<span className="sr-only">
											Remove {participant.user?.name || participant.user?.email}
										</span>
									</Button>
								)}
							</div>
						</CardHeader>

						<CardContent className="space-y-3">
							{/* Progress bar */}
							<div className="space-y-1">
								<div className="flex items-center justify-between text-xs">
									<span className="text-muted-foreground">Progress</span>
									<span className="font-medium">{progress}%</span>
								</div>
								<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
									<div
										className={`h-full transition-all duration-300 ${getProgressColor(progress)}`}
										style={{ width: `${progress}%` }}
									/>
								</div>
							</div>

							{/* Stats */}
							<div className="flex items-center justify-between text-xs">
								<div className="flex items-center gap-1 text-muted-foreground">
									<Activity className="h-3 w-3" />
									<span>
										{
											allProgress.filter((p) => p.userId === participant.userId)
												.length
										}{" "}
										exercises
									</span>
								</div>
								{progress === 100 && (
									<span className="font-medium text-green-600 text-xs">
										Complete
									</span>
								)}
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}

// Import Users icon for empty state
import { Users } from "lucide-react";
