"use client";

import { isPast, isToday, isTomorrow, isYesterday } from "date-fns";
import { Calendar, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { trpc } from "@/utils/trpc";
import { FeedItem } from "./feed-item";
import { FeedItemSkeleton } from "./feed-item-skeleton";

export interface FeedTraining {
	id: string;
	name: string;
	description: string | null;
	userId: string;
	userName?: string;
	userEmail?: string;
	userImage?: string | null;
	createdAt: string;
	exerciseCount?: number;
	user?: {
		id: string;
		name: string;
		email: string;
		image: string | null;
	}[];
}

export interface SessionInfo {
	id: string;
	trainingId: string;
	status: "pending" | "active" | "completed";
	startedAt: string | null;
	completedAt: string | null;
}

export type FeedFilter = "upcoming" | "past" | "all";

interface TrainingFeedProps {
	currentUserId: string;
	filter?: FeedFilter;
}

export function TrainingFeed({
	currentUserId,
	filter = "all",
}: TrainingFeedProps) {
	const router = useRouter();
	const [_joiningSessionId, setJoiningSessionId] = useState<string | null>(
		null,
	);

	// Fetch current user's friends (accepted friendships)
	// Need to fetch both userId->friendId and friendId->userId relationships
	const { data: friends, isLoading: isLoadingFriends } = useSupabaseQuery<{
		friendId: string;
		userId: string;
	}>({
		queryFn: (supabase) =>
			supabase
				.from("friend")
				.select("userId, friendId")
				.or(`userId.eq.${currentUserId},friendId.eq.${currentUserId}`)
				.eq("status", "accepted"),
		realtime: true,
		table: "friend",
	});

	// Extract friend IDs from both directions of the friendship
	// If current user is userId, friendId is the friend
	// If current user is friendId, userId is the friend
	const friendIds =
		friends?.map((f) => (f.userId === currentUserId ? f.friendId : f.userId)) ??
		[];
	const userIdsToFetch = [currentUserId, ...friendIds];

	// Fetch trainings from user and friends
	const {
		data: trainings,
		isLoading: isLoadingTrainings,
		error: trainingsError,
	} = useSupabaseQuery<FeedTraining>({
		queryFn: (supabase) =>
			supabase
				.from("training")
				.select(
					`
					id,
					name,
					description,
					userId,
					createdAt,
					user:user (
						id,
						name,
						email,
						image
					)
				`,
				)
				.in("userId", userIdsToFetch)
				.order("createdAt", { ascending: false }),
		realtime: true,
		table: "training",
	});

	// Fetch sessions to determine status
	const { data: sessions } = useSupabaseQuery<SessionInfo>({
		queryFn: (supabase) =>
			supabase
				.from("training_session")
				.select("id, trainingId, status, startedAt, completedAt")
				.in("trainingId", trainings?.map((t) => t.id) ?? [])
				.order("createdAt", { ascending: false }),
		realtime: true,
		table: "training_session",
	});

	// Fetch exercise counts for each training
	const { data: exercises } = useSupabaseQuery<{
		trainingId: string;
	}>({
		queryFn: (supabase) =>
			supabase
				.from("exercise")
				.select("trainingId")
				.in("trainingId", trainings?.map((t) => t.id) ?? []),
		realtime: true,
		table: "exercise",
	});

	// Calculate exercise counts
	const exerciseCounts = exercises?.reduce(
		(acc, ex) => {
			acc[ex.trainingId] = (acc[ex.trainingId] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);

	// Join session mutation
	// biome-ignore lint/suspicious/noExplicitAny: tRPC type inference issue with useMutation
	const joinSession = (trpc.session.join as any).useMutation({
		onSuccess: () => {
			toast.success("Joined session successfully");
			setJoiningSessionId(null);
		},
		onError: (error: { message: string }) => {
			toast.error(error.message);
			setJoiningSessionId(null);
		},
	});

	// Transform training data and add session info
	const feedItems = (trainings ?? []).map((training) => {
		const trainingSession = sessions?.find((s) => s.trainingId === training.id);
		const latestSessionDate = trainingSession?.startedAt ?? training.createdAt;
		const isCompleted = trainingSession?.status === "completed";
		const isPastSession = isCompleted || isPast(new Date(latestSessionDate));
		const userData = training.user?.[0]; // Supabase returns array

		return {
			...training,
			// Flatten user properties for FeedItem compatibility with defaults
			userName: userData?.name ?? training.userName ?? "Unknown User",
			userEmail: userData?.email ?? training.userEmail ?? "",
			userImage: userData?.image ?? training.userImage ?? null,
			exerciseCount: exerciseCounts?.[training.id] ?? 0,
			scheduledFor: trainingSession?.startedAt ?? null,
			sessionStatus: trainingSession?.status ?? null,
			isPast: isPastSession,
		};
	});

	// Filter items based on filter
	const filteredItems = feedItems.filter((item) => {
		if (filter === "all") return true;
		if (filter === "upcoming") return !item.isPast;
		if (filter === "past") return item.isPast;
		return true;
	});

	// Group by date for better UX
	const groupedItems = filteredItems.reduce(
		(acc, item) => {
			const date = new Date(item.createdAt);
			let groupKey = "Older";

			if (isToday(date)) {
				groupKey = "Today";
			} else if (isYesterday(date)) {
				groupKey = "Yesterday";
			} else if (isTomorrow(date)) {
				groupKey = "Tomorrow";
			}

			if (!acc[groupKey]) {
				acc[groupKey] = [];
			}
			acc[groupKey].push(item);
			return acc;
		},
		{} as Record<string, typeof feedItems>,
	);

	const handleJoin = async (inviteCode: string) => {
		setJoiningSessionId(inviteCode);
		joinSession.mutate({ inviteCode });
	};

	const handleView = (trainingId: string) => {
		router.push(`/trainings/${trainingId}`);
	};

	if (trainingsError) {
		toast.error(trainingsError.message);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-semibold text-lg">
						{filter === "upcoming"
							? "Upcoming Trainings"
							: filter === "past"
								? "Past Trainings"
								: "Training Feed"}
					</h2>
					<p className="text-muted-foreground text-sm">
						{filter === "upcoming"
							? "Trainings scheduled for the future"
							: filter === "past"
								? "Completed training sessions"
								: "Trainings from you and your friends"}
					</p>
				</div>
				{!isLoadingFriends && friendIds.length > 0 && (
					<div className="flex items-center gap-1 text-muted-foreground text-xs">
						<Users className="h-4 w-4" />
						<span>{friendIds.length + 1} connected</span>
					</div>
				)}
			</div>

			{/* Loading State with Skeleton Cards */}
			{(isLoadingTrainings || isLoadingFriends) && (
				<div className="space-y-3">
					<FeedItemSkeleton />
					<FeedItemSkeleton />
					<FeedItemSkeleton />
				</div>
			)}

			{/* Empty State - No Friends */}
			{!isLoadingFriends &&
				!isLoadingTrainings &&
				friendIds.length === 0 &&
				filter === "all" && (
					<Card className="border-dashed">
						<CardContent className="flex flex-col items-center justify-center py-12">
							<Users className="mb-3 h-12 w-12 text-muted-foreground" />
							<p className="text-muted-foreground text-sm">
								No friends yet. Add friends to see their trainings in your feed!
							</p>
						</CardContent>
					</Card>
				)}

			{/* Empty State - No Trainings */}
			{!isLoadingTrainings &&
				!isLoadingFriends &&
				filteredItems.length === 0 &&
				(friendIds.length > 0 || filter !== "all") && (
					<Card className="border-dashed">
						<CardContent className="flex flex-col items-center justify-center py-12">
							<Calendar className="mb-3 h-12 w-12 text-muted-foreground" />
							<p className="text-muted-foreground text-sm">
								{filter === "upcoming"
									? "No upcoming trainings scheduled"
									: filter === "past"
										? "No past trainings yet"
										: "No trainings found. Create one to get started!"}
							</p>
						</CardContent>
					</Card>
				)}

			{/* Feed Items by Date Group */}
			{!isLoadingTrainings &&
				Object.entries(groupedItems).map(([groupKey, items]) => (
					<div key={groupKey} className="space-y-3">
						{groupKey !== "Older" && (
							<h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
								{groupKey}
							</h3>
						)}
						<div className="space-y-3">
							{items.map((item) => (
								<FeedItem
									key={item.id}
									item={item}
									currentUserId={currentUserId}
									onJoin={
										!item.isPast && item.userId !== currentUserId
											? handleJoin
											: undefined
									}
									onView={handleView}
								/>
							))}
						</div>
					</div>
				))}
		</div>
	);
}
