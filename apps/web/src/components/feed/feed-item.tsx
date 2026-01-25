"use client";

import { formatDistanceToNow } from "date-fns";
import { Calendar, Clock, Dumbbell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";

export interface TrainingFeedItem {
	id: string;
	name: string;
	description: string | null;
	userId: string;
	userName: string;
	userEmail: string;
	userImage: string | null;
	createdAt: string;
	exerciseCount?: number;
	scheduledFor?: string | null; // ISO date string for upcoming sessions
	sessionStatus?: "pending" | "active" | "completed" | null;
}

export interface FeedItemProps {
	item: TrainingFeedItem;
	currentUserId?: string;
	onJoin?: (inviteCode: string) => void;
	onView?: (trainingId: string) => void;
}

export function FeedItem({
	item,
	currentUserId,
	onJoin,
	onView,
}: FeedItemProps) {
	const isOwner = currentUserId === item.userId;
	const isUpcoming =
		item.scheduledFor && new Date(item.scheduledFor) > new Date();

	// Fetch session for this training to get join info
	const { data: sessions } = useSupabaseQuery<{
		id: string;
		trainingId: string;
		inviteCode: string;
		status: string;
		startedAt: string | null;
	}>({
		queryFn: (supabase) =>
			supabase
				.from("training_session")
				.select("id, trainingId, inviteCode, status, startedAt")
				.eq("trainingId", item.id)
				.in("status", ["pending", "active"])
				.order("createdAt", { ascending: false })
				.limit(1),
		realtime: true,
		table: "training_session",
	});

	const activeSession = sessions?.[0];
	const timeAgo = formatDistanceToNow(new Date(item.createdAt), {
		addSuffix: true,
	});

	const scheduledTime = item.scheduledFor
		? formatDistanceToNow(new Date(item.scheduledFor), { addSuffix: true })
		: null;

	return (
		<Card className="group transition-all hover:ring-2 hover:ring-primary/50">
			<CardHeader>
				<div className="flex items-start justify-between gap-2">
					<div className="flex min-w-0 flex-1 items-start gap-2">
						{/* User Avatar */}
						<div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
							{item.userImage ? (
								<img
									src={item.userImage}
									alt={item.userName}
									className="h-full w-full object-cover"
								/>
							) : (
								<User className="h-4 w-4 text-muted-foreground" />
							)}
						</div>
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-2">
								<CardTitle className="truncate text-base">
									{item.name}
								</CardTitle>
								{isOwner && (
									<span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-[10px] text-primary">
										You
									</span>
								)}
							</div>
							<p className="text-muted-foreground text-xs">{item.userName}</p>
						</div>
					</div>
				</div>
				{item.description && (
					<p className="line-clamp-2 text-muted-foreground text-sm">
						{item.description}
					</p>
				)}
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{/* Metadata */}
					<div className="flex flex-wrap items-center gap-3 text-muted-foreground text-xs">
						<div className="flex items-center gap-1">
							<Dumbbell className="h-3 w-3" />
							<span>
								{item.exerciseCount ?? 0} exercise
								{(item.exerciseCount ?? 0) !== 1 ? "s" : ""}
							</span>
						</div>
						<div className="flex items-center gap-1">
							<Calendar className="h-3 w-3" />
							<span>Created {timeAgo}</span>
						</div>
						{item.scheduledFor && scheduledTime && (
							<div className="flex items-center gap-1">
								<Clock className="h-3 w-3" />
								<span className={isUpcoming ? "font-medium text-primary" : ""}>
									{isUpcoming ? "Scheduled" : "Was"} {scheduledTime}
								</span>
							</div>
						)}
					</div>

					{/* Actions */}
					<div className="flex items-center gap-2">
						{activeSession ? (
							<>
								{isOwner ? (
									<Button
										variant="default"
										size="sm"
										className="w-full"
										onClick={() => onView?.(item.id)}
									>
										View Session
									</Button>
								) : (
									<Button
										variant="outline"
										size="sm"
										className="w-full"
										onClick={() => onJoin?.(activeSession.inviteCode)}
									>
										Join Session
									</Button>
								)}
								{item.sessionStatus && (
									<span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-[10px] text-secondary-foreground capitalize">
										{item.sessionStatus}
									</span>
								)}
							</>
						) : (
							<Button
								variant="outline"
								size="sm"
								className="w-full"
								onClick={() => onView?.(item.id)}
							>
								View Training
							</Button>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
