"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";
import { AddFriendDialog } from "@/components/friends/add-friend-dialog";
import { FriendList } from "@/components/friends/friend-list";
import { FriendRequestCard } from "@/components/friends/friend-request-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";

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

interface FriendsPageClientProps {
	currentUserId: string;
}

type TabValue = "all" | "pending" | "accepted";

/**
 * FriendsPageClient Component
 *
 * Client component for the friends page.
 * Displays friends list and friend requests with filtering.
 *
 * Features:
 * - Tab navigation (All, Pending, Accepted)
 * - Add friend dialog
 * - Friend list with remove action
 * - Friend request cards with accept/reject actions
 * - Real-time updates via Supabase
 * - Mobile-first responsive design
 *
 * Data Access:
 * - Read: Supabase (useSupabaseQuery) for friends and requests
 * - Write: Handled by child components via tRPC mutations
 */
export function FriendsPageClient({ currentUserId }: FriendsPageClientProps) {
	const [activeTab, setActiveTab] = useState<TabValue>("all");

	// Fetch friends using Supabase (read)
	const { data: friends = [], isLoading } = useSupabaseQuery<Friend>({
		queryFn: (supabase) =>
			supabase
				.from("friend")
				.select(
					`
					*,
					friend:friend_id(id,name,email,image)
				`,
				)
				.or(`user_id.eq.${currentUserId},friend_id.eq.${currentUserId}`)
				.order("created_at", { ascending: false }),
		realtime: true,
		table: "friend",
	});

	// Filter friends based on active tab (not currently used but kept for future extensibility)
	const _filteredFriends = friends.filter((friend) => {
		if (activeTab === "all") return true;
		return friend.status === activeTab;
	});

	// Separate pending requests into incoming and outgoing
	const pendingRequests = friends.filter((f) => f.status === "pending");
	const incomingRequests = pendingRequests.filter(
		(f) => f.userId !== currentUserId,
	);
	const outgoingRequests = pendingRequests.filter(
		(f) => f.userId === currentUserId,
	);

	const handleFriendRequestSent = () => {
		// Refetch is handled by real-time subscription
	};

	return (
		<div className="space-y-6">
			{/* Add Friend Button */}
			<div className="flex justify-end">
				<AddFriendDialog onFriendRequestSent={handleFriendRequestSent} />
			</div>

			{/* Tabs for filtering */}
			<Tabs
				value={activeTab}
				onValueChange={(v) => setActiveTab(v as TabValue)}
			>
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="pending">
						Pending
						{pendingRequests.length > 0 && (
							<span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-primary-foreground text-xs">
								{pendingRequests.length}
							</span>
						)}
					</TabsTrigger>
					<TabsTrigger value="accepted">Friends</TabsTrigger>
				</TabsList>

				{/* Pending Requests Tab */}
				<TabsContent value="pending" className="space-y-4">
					{/* Incoming Requests - with accept/reject */}
					{incomingRequests.length > 0 && (
						<div className="space-y-4">
							<div>
								<h2 className="mb-2 font-semibold text-lg">
									Incoming Requests
								</h2>
								<p className="text-muted-foreground text-sm">
									People who want to be your friend
								</p>
							</div>
							<div className="space-y-3">
								{incomingRequests.map((friend) => (
									<FriendRequestCard
										key={friend.id}
										friend={friend}
										currentUserId={currentUserId}
									/>
								))}
							</div>
						</div>
					)}

					{/* Outgoing Requests - sent by current user */}
					{outgoingRequests.length > 0 && (
						<div className="space-y-4">
							<div>
								<h2 className="mb-2 font-semibold text-lg">Sent Requests</h2>
								<p className="text-muted-foreground text-sm">
									Friend requests you've sent
								</p>
							</div>
							<div className="space-y-3">
								{outgoingRequests.map((friend) => (
									<FriendRequestCard
										key={friend.id}
										friend={friend}
										currentUserId={currentUserId}
									/>
								))}
							</div>
						</div>
					)}

					{/* No pending requests */}
					{pendingRequests.length === 0 && !isLoading && (
						<div className="flex flex-col items-center justify-center py-12">
							<UserPlus className="mb-2 h-12 w-12 text-muted-foreground" />
							<p className="text-muted-foreground text-sm">
								No pending friend requests
							</p>
						</div>
					)}

					{isLoading && (
						<div className="space-y-3">
							{[1, 2].map((i) => (
								<div
									key={i}
									className="h-24 animate-pulse rounded-lg bg-muted"
								/>
							))}
						</div>
					)}
				</TabsContent>

				{/* Accepted Friends Tab */}
				<TabsContent value="accepted" className="space-y-4">
					<FriendList currentUserId={currentUserId} status="accepted" />
				</TabsContent>

				{/* All Tab */}
				<TabsContent value="all" className="space-y-4">
					<FriendList currentUserId={currentUserId} status="all" />
				</TabsContent>
			</Tabs>
		</div>
	);
}
