"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2, Search, User, UserPlus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { trpc } from "@/utils/trpc";

export interface UserSearchResult {
	id: string;
	name: string;
	email: string;
	image: string | null;
}

export interface ExistingFriend {
	id: string;
	user_id: string;
	friend_id: string;
	status: "pending" | "accepted" | "blocked";
}

export interface AddFriendDialogProps {
	trigger?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	onFriendRequestSent?: (friendId: string) => void;
}

/**
 * AddFriendDialog Component
 *
 * A dialog component for searching and sending friend requests.
 *
 * Features:
 * - Search users by email or name
 * - Display search results with user info
 * - Send friend request via tRPC mutation
 * - Shows existing relationship status (already friends, pending, etc.)
 * - Prevents duplicate friend requests
 * - Mobile-first responsive design
 *
 * Data Access:
 * - Read: Supabase (useSupabaseQuery) for user search and existing friendships
 * - Write: tRPC mutations (friend.send) for sending friend requests
 */
export function AddFriendDialog({
	trigger,
	open: controlledOpen,
	onOpenChange,
	onFriendRequestSent,
}: AddFriendDialogProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");

	// Use controlled or uncontrolled state
	const isOpen = controlledOpen ?? uncontrolledOpen;
	const setIsOpen = onOpenChange ?? setUncontrolledOpen;

	// Get current user ID from auth
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);

	useEffect(() => {
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

	// Debounce search query to avoid excessive API calls
	useEffect(() => {
		const timer = setTimeout(() => {
			if (searchQuery.trim().length >= 2) {
				setDebouncedQuery(searchQuery.trim());
			} else {
				setDebouncedQuery("");
			}
		}, 300);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Search users by email or name
	const { data: searchResults = [], isLoading: searchLoading } =
		useSupabaseQuery<UserSearchResult>({
			queryFn: (supabase) => {
				if (!debouncedQuery || !currentUserId) {
					return Promise.resolve({ data: [], error: null });
				}

				return supabase
					.from("user")
					.select("id, name, email, image")
					.or(`email.ilike.%${debouncedQuery}%,name.ilike.%${debouncedQuery}%`)
					.neq("id", currentUserId) // Exclude current user
					.limit(10);
			},
			realtime: false,
		});

	// Fetch existing friendships to check status
	const { data: existingFriends = [] } = useSupabaseQuery<ExistingFriend>({
		queryFn: (supabase) => {
			if (!currentUserId) {
				return Promise.resolve({ data: [], error: null });
			}

			return supabase
				.from("friend")
				.select("id, user_id, friend_id, status")
				.or(`user_id.eq.${currentUserId},friend_id.eq.${currentUserId}`);
		},
		realtime: true,
		table: "friend",
	});

	// Send friend request mutation
	const sendRequest = useMutation(
		trpc.friend.send.mutationOptions({
			onSuccess: () => {
				toast.success("Friend request sent!");
				setSearchQuery("");
				setDebouncedQuery("");
				setIsOpen(false);
				onFriendRequestSent?.("");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	// Check if a relationship exists with a user
	const getRelationshipStatus = useCallback(
		(userId: string): "none" | "pending" | "accepted" | "blocked" => {
			const relationship = existingFriends.find(
				(f) =>
					(f.user_id === currentUserId && f.friend_id === userId) ||
					(f.user_id === userId && f.friend_id === currentUserId),
			);

			if (!relationship) return "none";
			return relationship.status;
		},
		[existingFriends, currentUserId],
	);

	// Handle send friend request
	const handleSendRequest = useCallback(
		(userId: string) => {
			sendRequest.mutate({ friendId: userId });
		},
		[sendRequest],
	);

	// Filter search results to exclude users with existing relationships
	const availableUsers = searchResults.filter((user) => {
		const status = getRelationshipStatus(user.id);
		return status === "none";
	});

	// Check if a user has a pending or accepted relationship
	const getUserStatus = (userId: string) => {
		const status = getRelationshipStatus(userId);
		if (status === "accepted") return "Already friends";
		if (status === "pending") return "Request pending";
		if (status === "blocked") return "Blocked";
		return null;
	};

	// Default trigger button
	const defaultTrigger = (
		<Button variant="outline" size="sm">
			<UserPlus className="mr-1 h-4 w-4" />
			Add Friend
		</Button>
	);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{trigger ?? <DialogTrigger>{defaultTrigger}</DialogTrigger>}
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Add Friend</DialogTitle>
					<DialogDescription>
						Search for users by email or name to send them a friend request.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Search Input */}
					<div className="relative">
						<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search by email or name..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9"
							autoFocus
							aria-label="Search users"
						/>
						{searchLoading && (
							<Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
						)}
						{searchQuery && !searchLoading && (
							<button
								type="button"
								onClick={() => {
									setSearchQuery("");
									setDebouncedQuery("");
								}}
								className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								aria-label="Clear search"
							>
								<X className="h-4 w-4" />
							</button>
						)}
					</div>

					{/* Search Results */}
					{searchQuery && debouncedQuery.length >= 2 && (
						<div className="space-y-2">
							{searchLoading ? (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
								</div>
							) : searchResults.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-8">
									<User className="mb-2 h-10 w-10 text-muted-foreground" />
									<p className="text-muted-foreground text-sm">
										No users found
									</p>
								</div>
							) : (
								<div className="space-y-2">
									{/* Available users */}
									{availableUsers.length > 0 && (
										<div className="space-y-2">
											<p className="text-muted-foreground text-xs">
												Send friend request
											</p>
											{availableUsers.map((user) => (
												<div
													key={user.id}
													className="flex items-center justify-between rounded-md border bg-background p-3"
												>
													<div className="flex min-w-0 flex-1 items-center gap-3">
														<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
															{user.image ? (
																<img
																	src={user.image}
																	alt={user.name}
																	className="h-8 w-8 rounded-full object-cover"
																/>
															) : (
																<User
																	className="h-4 w-4 text-primary"
																	aria-hidden="true"
																/>
															)}
														</div>
														<div className="flex min-w-0 flex-1 flex-col">
															<span className="truncate font-medium text-sm">
																{user.name}
															</span>
															<span className="truncate text-muted-foreground text-xs">
																{user.email}
															</span>
														</div>
													</div>
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleSendRequest(user.id)}
														disabled={sendRequest.isPending}
														className="shrink-0"
														aria-label={`Send friend request to ${user.name}`}
													>
														{sendRequest.isPending ? (
															<Loader2 className="h-4 w-4 animate-spin" />
														) : (
															<UserPlus className="h-4 w-4" />
														)}
													</Button>
												</div>
											))}
										</div>
									)}

									{/* Users with existing relationships */}
									{searchResults.some(
										(user) => getUserStatus(user.id) !== null,
									) && (
										<div className="space-y-2">
											{availableUsers.length > 0 && (
												<p className="text-muted-foreground text-xs">
													Existing connections
												</p>
											)}
											{searchResults
												.filter((user) => getUserStatus(user.id) !== null)
												.map((user) => {
													const status = getUserStatus(user.id);
													return (
														<div
															key={user.id}
															className="flex items-center justify-between rounded-md border border-dashed bg-muted/30 p-3"
														>
															<div className="flex min-w-0 flex-1 items-center gap-3">
																<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
																	{user.image ? (
																		<img
																			src={user.image}
																			alt={user.name}
																			className="h-8 w-8 rounded-full object-cover opacity-60"
																		/>
																	) : (
																		<User className="h-4 w-4 text-muted-foreground" />
																	)}
																</div>
																<div className="flex min-w-0 flex-1 flex-col">
																	<span className="truncate font-medium text-sm opacity-70">
																		{user.name}
																	</span>
																	<span className="truncate text-muted-foreground text-xs">
																		{user.email}
																	</span>
																</div>
															</div>
															<span className="text-muted-foreground text-xs">
																{status}
															</span>
														</div>
													);
												})}
										</div>
									)}
								</div>
							)}
						</div>
					)}

					{/* Empty state when no search */}
					{!searchQuery && (
						<div className="flex flex-col items-center justify-center py-8">
							<Search className="mb-2 h-10 w-10 text-muted-foreground" />
							<p className="text-muted-foreground text-sm">
								Enter an email or name to search
							</p>
						</div>
					)}

					{searchQuery &&
						debouncedQuery.length < 2 &&
						searchQuery.length > 0 && (
							<div className="flex flex-col items-center justify-center py-8">
								<Search className="mb-2 h-10 w-10 text-muted-foreground" />
								<p className="text-muted-foreground text-sm">
									Enter at least 2 characters to search
								</p>
							</div>
						)}
				</div>

				<DialogFooter>
					<DialogClose>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
