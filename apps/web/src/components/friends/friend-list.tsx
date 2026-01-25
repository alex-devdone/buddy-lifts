"use client";

import { useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Trash2, User, UserMinus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { trpc } from "@/utils/trpc";

interface Friend {
	id: string;
	userId: string;
	friendId: string;
	status: "pending" | "accepted" | "blocked";
	createdAt: string;
	friend?: {
		id: string;
		name: string;
		email: string;
		image: string | null;
	};
}

interface FriendListProps {
	currentUserId?: string;
	status?: "accepted" | "pending" | "all";
	onRemove?: (friendId: string) => void;
}

/**
 * FriendList Component
 *
 * Displays a list of friends with remove action.
 * Uses hybrid pattern: reads from Supabase (real-time enabled), writes via tRPC.
 *
 * Features:
 * - Shows friends with their name, email, and status
 * - Real-time updates via Supabase subscriptions
 * - Remove friend action (via tRPC mutation)
 * - Filter by status (accepted, pending, or all)
 * - Loading and empty states
 * - Mobile-first responsive design
 */
export function FriendList({
	currentUserId,
	status = "accepted",
	onRemove,
}: FriendListProps) {
	// Get current user ID from auth
	const [localCurrentUserId, setLocalCurrentUserId] = useState<string | null>(
		null,
	);

	useEffect(() => {
		const fetchCurrentUser = async () => {
			try {
				const { createClient } = await import("@/lib/supabase/client");
				const supabase = createClient();
				const {
					data: { user },
				} = await supabase.auth.getUser();
				setLocalCurrentUserId(user?.id || null);
			} catch {
				setLocalCurrentUserId(null);
			}
		};
		fetchCurrentUser();
	}, []);

	const effectiveUserId = currentUserId || localCurrentUserId;

	// Fetch friends using Supabase (read)
	// We need to query in both directions since userId can be either party
	const { data: friends = [], isLoading } = useSupabaseQuery<Friend>({
		queryFn: (supabase) => {
			// Build the base query
			let query = supabase
				.from("friend")
				.select(
					`
					*,
					friend:friend_id(id,name,email,image)
				`,
				)
				.or(`user_id.eq.${effectiveUserId},friend_id.eq.${effectiveUserId}`);

			// Filter by status if not "all"
			if (status !== "all") {
				query = query.eq("status", status);
			}

			return query.order("created_at", { ascending: false });
		},
		realtime: true,
		table: "friend",
		enabled: !!effectiveUserId,
	});

	// Remove friend mutation
	const removeFriend = useMutation(
		trpc.friend.remove.mutationOptions({
			onSuccess: () => {
				toast.success("Friend removed");
				onRemove?.(effectiveUserId || "");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	// Handle remove friend
	const handleRemove = useCallback(
		(friendId: string) => {
			if (
				!confirm(
					"Are you sure you want to remove this friend? This action cannot be undone.",
				)
			) {
				return;
			}
			removeFriend.mutate({ friendId });
		},
		[removeFriend],
	);

	// Determine if a friend entry was initiated by current user
	const isIncoming = useCallback(
		(friend: Friend): boolean => {
			return friend.userId !== effectiveUserId;
		},
		[effectiveUserId],
	);

	// Filter and display friends
	const displayFriends = friends;

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (displayFriends.length === 0) {
		return (
			<Card>
				<CardContent className="flex flex-col items-center justify-center py-8">
					<User className="mb-2 h-12 w-12 text-muted-foreground" />
					<p className="text-muted-foreground text-sm">
						{status === "accepted"
							? "No friends yet"
							: status === "pending"
								? "No pending friend requests"
								: "No friends or requests"}
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="flex w-full flex-col gap-3">
			{displayFriends.map((friend) => {
				const friendName =
					friend.friend?.name || friend.friend?.email || "Unknown User";
				const friendEmail = friend.friend?.email;
				const timeAgo = formatDistanceToNow(new Date(friend.createdAt), {
					addSuffix: true,
				});
				const isIncomingRequest = isIncoming(friend);

				return (
					<Card
						key={friend.id}
						className="transition-all hover:ring-2 hover:ring-primary/50"
					>
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between gap-2">
								<div className="flex min-w-0 flex-1 items-center gap-3">
									{/* Avatar */}
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
										{friend.friend?.image ? (
											<img
												src={friend.friend.image}
												alt={`${friendName}`}
												className="h-10 w-10 rounded-full object-cover"
											/>
										) : (
											<User
												className="h-5 w-5 text-primary"
												aria-hidden="true"
											/>
										)}
									</div>

									{/* Friend Info */}
									<div className="flex min-w-0 flex-1 flex-col">
										<CardTitle className="truncate text-base">
											{friendName}
										</CardTitle>
										{friendEmail && (
											<CardDescription className="truncate">
												{friendEmail}
											</CardDescription>
										)}
									</div>
								</div>

								{/* Actions */}
								{status === "accepted" && (
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => handleRemove(friend.friendId)}
										disabled={removeFriend.isPending}
										className="shrink-0 text-destructive hover:text-destructive"
									>
										<UserMinus className="h-4 w-4" />
										<span className="sr-only">Remove friend</span>
									</Button>
								)}

								{status === "pending" && isIncomingRequest && (
									<div className="flex shrink-0 items-center gap-1">
										<span className="text-muted-foreground text-xs">
											Incoming
										</span>
									</div>
								)}

								{status === "pending" && !isIncomingRequest && (
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => handleRemove(friend.friendId)}
										disabled={removeFriend.isPending}
										className="shrink-0"
									>
										<Trash2 className="h-4 w-4" />
										<span className="sr-only">Cancel request</span>
									</Button>
								)}
							</div>
						</CardHeader>

						{/* Footer with status and time */}
						{status !== "all" && (
							<CardContent className="pt-0">
								<div className="flex items-center justify-between text-muted-foreground text-xs">
									<span className="capitalize">
										{friend.status === "pending"
											? isIncomingRequest
												? "Request received"
												: "Request sent"
											: "Friend"}
									</span>
									<span>Added {timeAgo}</span>
								</div>
							</CardContent>
						)}
					</Card>
				);
			})}
		</div>
	);
}
