"use client";

import { useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Check, Loader2, Trash2, User, X } from "lucide-react";
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
import { cn } from "@/lib/utils";
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

interface FriendRequestCardProps {
	/** Friend request data to display */
	friend: Friend;
	/** Callback fired when request is accepted */
	onAccept?: (friendId: string) => void;
	/** Callback fired when request is rejected */
	onReject?: (friendId: string) => void;
	/** Optional current user ID (auto-fetched from auth if not provided) */
	currentUserId?: string;
	/** Compact variant for smaller displays */
	variant?: "default" | "compact";
}

/**
 * FriendRequestCard Component
 *
 * Displays a single friend request with accept/reject actions.
 * Uses hybrid pattern: reads from Supabase (passed as prop), writes via tRPC.
 *
 * Features:
 * - Shows friend request with user info (name, email, avatar)
 * - Accept and Reject action buttons
 * - Time ago display for request sent time
 * - Loading states during mutations
 * - Toast notifications for success/error
 * - Mobile-first responsive design
 * - Compact variant for space-constrained layouts
 */
export function FriendRequestCard({
	friend,
	onAccept,
	onReject,
	currentUserId,
	variant = "default",
}: FriendRequestCardProps) {
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

	// Accept friend request mutation
	const acceptRequest = useMutation(
		trpc.friend.accept.mutationOptions({
			onSuccess: () => {
				toast.success("Friend request accepted");
				onAccept?.(friend.friendId);
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	// Reject friend request mutation
	const rejectRequest = useMutation(
		trpc.friend.reject.mutationOptions({
			onSuccess: () => {
				toast.success("Friend request rejected");
				onReject?.(friend.friendId);
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	// Handle accept
	const handleAccept = useCallback(() => {
		acceptRequest.mutate({ friendId: friend.friendId });
	}, [acceptRequest, friend.friendId]);

	// Handle reject
	const handleReject = useCallback(() => {
		if (
			!confirm(
				"Are you sure you want to reject this friend request? The sender will not be notified.",
			)
		) {
			return;
		}
		rejectRequest.mutate({ friendId: friend.friendId });
	}, [rejectRequest, friend.friendId]);

	// Determine if this is an incoming request (sent to current user)
	const isIncoming = friend.userId !== effectiveUserId;

	const friendName =
		friend.friend?.name || friend.friend?.email || "Unknown User";
	const friendEmail = friend.friend?.email;
	const timeAgo = formatDistanceToNow(new Date(friend.createdAt), {
		addSuffix: true,
	});

	const isPending = acceptRequest.isPending || rejectRequest.isPending;

	return (
		<Card
			className={cn(
				"transition-all hover:ring-2 hover:ring-primary/50",
				isPending && "opacity-70",
			)}
		>
			<CardHeader className={cn(variant === "compact" && "pb-2")}>
				<div className="flex items-start justify-between gap-2">
					<div className="flex min-w-0 flex-1 items-center gap-3">
						{/* Avatar */}
						<div
							className={cn(
								"flex shrink-0 items-center justify-center rounded-full bg-primary/10",
								variant === "compact" ? "h-8 w-8" : "h-10 w-10",
							)}
						>
							{friend.friend?.image ? (
								<img
									src={friend.friend.image}
									alt={friendName}
									className={cn(
										"rounded-full object-cover",
										variant === "compact" ? "h-8 w-8" : "h-10 w-10",
									)}
								/>
							) : (
								<User
									className={cn(
										"text-primary",
										variant === "compact" ? "h-4 w-4" : "h-5 w-5",
									)}
									aria-hidden="true"
								/>
							)}
						</div>

						{/* Friend Info */}
						<div className="flex min-w-0 flex-1 flex-col">
							<CardTitle
								className={cn(
									"truncate",
									variant === "compact" ? "text-sm" : "text-base",
								)}
							>
								{friendName}
							</CardTitle>
							{friendEmail && variant === "default" && (
								<CardDescription className="truncate">
									{friendEmail}
								</CardDescription>
							)}
						</div>
					</div>

					{/* Actions - only show for incoming requests */}
					{isIncoming && (
						<div className="flex shrink-0 items-center gap-1">
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={handleAccept}
								disabled={isPending}
								className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950"
								aria-label="Accept friend request"
							>
								{acceptRequest.isPending ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Check className="h-4 w-4" />
								)}
							</Button>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={handleReject}
								disabled={isPending}
								className="h-8 w-8 text-destructive hover:text-destructive"
								aria-label="Reject friend request"
							>
								{rejectRequest.isPending ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<X className="h-4 w-4" />
								)}
							</Button>
						</div>
					)}

					{/* Outgoing request indicator */}
					{!isIncoming && (
						<div className="flex shrink-0 items-center gap-1">
							{variant === "compact" ? (
								<span className="text-muted-foreground text-xs">Sent</span>
							) : (
								<Button
									variant="ghost"
									size="icon-sm"
									onClick={handleReject}
									disabled={isPending}
									className="h-8 w-8"
									aria-label="Cancel friend request"
								>
									{isPending ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Trash2 className="h-4 w-4" />
									)}
								</Button>
							)}
						</div>
					)}
				</div>
			</CardHeader>

			{/* Footer with time and status */}
			{variant === "default" && (
				<CardContent className="pt-0">
					<div className="flex items-center justify-between text-muted-foreground text-xs">
						<span className="capitalize">
							{isIncoming ? "Request received" : "Request sent"}
						</span>
						<span>{timeAgo}</span>
					</div>
				</CardContent>
			)}
		</Card>
	);
}
