"use client";

import { useMutation } from "@tanstack/react-query";
import { Copy, Link, Loader2, Lock, LockOpen } from "lucide-react";
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
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { trpc } from "@/utils/trpc";

interface InviteLinkDialogProps {
	sessionId: string;
	trigger?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
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
 * InviteLinkDialog Component
 *
 * A dialog component for generating and sharing invite links with configurable access levels.
 *
 * Features:
 * - Displays invite code with copy link button
 * - Toggle access type between read/admin
 * - Shows full invite URL for sharing
 * - Host-only functionality
 * - Mobile-first responsive design
 *
 * Data Access:
 * - Read: Supabase (useSupabaseQuery) for session data
 * - Write: tRPC mutations for updating access type
 */
export function InviteLinkDialog({
	sessionId,
	trigger,
	open: controlledOpen,
	onOpenChange,
}: InviteLinkDialogProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const [copied, setCopied] = useState(false);

	// Use controlled or uncontrolled state
	const isOpen = controlledOpen ?? uncontrolledOpen;
	const setIsOpen = onOpenChange ?? setUncontrolledOpen;

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

	// Update access type mutation
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

	// Determine if current user is host
	const isHost = currentUserId && sessionData?.hostUserId === currentUserId;

	// Generate invite URL
	const inviteUrl = sessionData?.inviteCode
		? `${typeof window !== "undefined" ? window.location.origin : ""}/join/${sessionData.inviteCode}`
		: "";

	// Copy invite link to clipboard
	const handleCopyInviteLink = useCallback(() => {
		if (!inviteUrl) return;

		navigator.clipboard.writeText(inviteUrl).then(() => {
			setCopied(true);
			toast.success("Invite link copied!");
			setTimeout(() => setCopied(false), 2000);
		});
	}, [inviteUrl]);

	// Copy invite code only
	const handleCopyInviteCode = useCallback(() => {
		if (!sessionData?.inviteCode) return;

		navigator.clipboard.writeText(sessionData.inviteCode).then(() => {
			setCopied(true);
			toast.success("Invite code copied!");
			setTimeout(() => setCopied(false), 2000);
		});
	}, [sessionData?.inviteCode]);

	// Toggle access type
	const handleToggleAccess = useCallback(() => {
		if (!sessionData) return;

		const newAccessType = sessionData.accessType === "read" ? "admin" : "read";
		updateAccess.mutate({
			sessionId,
			accessType: newAccessType,
		});
	}, [sessionData, sessionId, updateAccess]);

	// Default trigger button
	const defaultTrigger = (
		<Button variant="outline" size="sm">
			<Link className="mr-1 h-4 w-4" />
			Share Invite
		</Button>
	);

	if (sessionLoading) {
		return (
			<Button variant="outline" size="sm" disabled>
				<Loader2 className="mr-1 h-4 w-4 animate-spin" />
				Loading...
			</Button>
		);
	}

	if (sessionError || !sessionData) {
		return (
			<Button variant="outline" size="sm" disabled>
				Session unavailable
			</Button>
		);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{trigger ?? <DialogTrigger>{defaultTrigger}</DialogTrigger>}
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Share Invite Link</DialogTitle>
					<DialogDescription>
						Share this invite link with friends to let them join your training
						session.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Invite Code Display */}
					<div className="space-y-2">
						<span className="font-medium text-muted-foreground text-xs">
							Invite Code
						</span>
						<div className="flex items-center gap-2">
							<div className="flex flex-1 items-center rounded-md border bg-muted px-3 py-2">
								<span className="font-bold font-mono text-sm">
									{sessionData.inviteCode}
								</span>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={handleCopyInviteCode}
								className="shrink-0"
								aria-label="Copy invite code"
							>
								<Copy className="h-4 w-4" />
								<span className="sr-only">Copy code</span>
							</Button>
						</div>
					</div>

					{/* Invite URL Display */}
					<div className="space-y-2">
						<span className="font-medium text-muted-foreground text-xs">
							Full Invite Link
						</span>
						<div className="rounded-md border bg-muted p-3">
							<p className="break-all font-mono text-xs">{inviteUrl}</p>
						</div>
						<Button
							variant={copied ? "default" : "outline"}
							size="sm"
							onClick={handleCopyInviteLink}
							className="w-full"
							aria-label="Copy invite link"
						>
							{copied ? (
								<>Copied!</>
							) : (
								<>
									<Copy className="mr-1 h-4 w-4" />
									Copy Link
								</>
							)}
						</Button>
					</div>

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
								aria-label={`Change access type. Currently: ${sessionData.accessType}`}
							>
								{sessionData.accessType === "read" ? (
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

					{/* Access Info for Non-Host */}
					{!isHost && (
						<div className="rounded-md bg-muted/50 p-3">
							<p className="text-muted-foreground text-xs">
								Current access level:{" "}
								<span className="font-medium capitalize">
									{sessionData.accessType}
								</span>
								. Only the host can change this setting.
							</p>
						</div>
					)}
				</div>

				<DialogFooter>
					<DialogClose>
						<Button variant="outline">Done</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
