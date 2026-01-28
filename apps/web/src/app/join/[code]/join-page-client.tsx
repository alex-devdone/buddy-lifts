"use client";

import { AlertCircle, Dumbbell, Loader2, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";

interface JoinPageClientProps {
	inviteCode: string;
	currentUserId: string;
}

/**
 * JoinPageClient Component
 *
 * Client component that handles the session join logic:
 * 1. Automatically attempts to join the session via tRPC mutation
 * 2. Handles success by redirecting to the active session page
 * 3. Handles errors with user-friendly messages
 * 4. Shows loading state during the join process
 *
 * Uses tRPC for write operation (session.join mutation).
 * No Supabase reads needed for this flow.
 */
export function JoinPageClient({
	inviteCode,
}: Omit<JoinPageClientProps, "currentUserId">) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const accessParam = searchParams.get("access");
	const accessType =
		accessParam === "read" || accessParam === "admin" ? accessParam : undefined;

	// tRPC mutation for joining session (write operation)
	// biome-ignore lint/suspicious/noExplicitAny: tRPC type inference issue with useMutation
	const joinMutation = (trpc.session.join as any).useMutation({
		onSuccess: (data: {
			sessionId: string;
			trainingId: string;
			role: string;
		}) => {
			toast.success("Successfully joined the session!", {
				description: "Redirecting to workout...",
			});

			// Redirect to the active session page
			router.push(
				`/trainings/${data.trainingId}/session?sessionId=${data.sessionId}`,
			);
		},
		onError: (error: { message: string }) => {
			console.error("Failed to join session:", error);

			// User-friendly error messages based on error code
			let errorMessage = "Failed to join session. Please try again.";

			if (error.message === "Invalid invite code") {
				errorMessage = "This invite code is invalid or expired.";
			} else if (error.message === "This session is not active") {
				errorMessage = "This session is not currently active.";
			} else if (error.message === "You have already joined this session") {
				errorMessage = "You're already a participant in this session.";
			}

			toast.error("Could not join session", {
				description: errorMessage,
			});
		},
	});

	// Automatically join the session when component mounts
	useEffect(() => {
		joinMutation.mutate({ inviteCode, accessType });
	}, [inviteCode, joinMutation.mutate, accessType]);

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="text-center">
				<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
					{joinMutation.isPending ? (
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
					) : (
						<Users className="h-8 w-8 text-primary" />
					)}
				</div>
				<CardTitle className="font-bold text-2xl">
					{joinMutation.isPending
						? "Joining Session..."
						: "Join Training Session"}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{joinMutation.isPending && (
					<div className="flex flex-col items-center space-y-3 text-center text-muted-foreground text-sm">
						<p>Connecting to the training session...</p>
						<div className="flex items-center space-x-2">
							<code className="rounded bg-muted px-3 py-1 font-mono text-lg">
								{inviteCode}
							</code>
						</div>
					</div>
				)}

				{joinMutation.isError && (
					<div className="flex flex-col space-y-3">
						<div className="flex items-start space-x-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
							<AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
							<div className="flex-1 space-y-1">
								<p className="font-medium text-destructive text-sm">
									{joinMutation.error.message === "Invalid invite code"
										? "Invalid Invite Code"
										: joinMutation.error.message ===
												"This session is not active"
											? "Session Not Active"
											: "Join Failed"}
								</p>
								<p className="text-muted-foreground text-xs">
									{joinMutation.error.message === "Invalid invite code"
										? "The invite code you entered is invalid or has expired."
										: joinMutation.error.message ===
												"This session is not active"
											? "This training session has ended or hasn't started yet."
											: joinMutation.error.message}
								</p>
							</div>
						</div>

						<div className="flex flex-col space-y-2">
							<Button
								onClick={() => router.push("/trainings")}
								variant="default"
								className="w-full"
							>
								<Dumbbell className="mr-2 h-4 w-4" />
								View Your Trainings
							</Button>
						</div>
					</div>
				)}

				{joinMutation.isSuccess && (
					<div className="flex flex-col items-center space-y-3 text-center">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
							<Users className="h-6 w-6 text-green-600 dark:text-green-400" />
						</div>
						<p className="text-muted-foreground text-sm">
							You've joined the session! Redirecting...
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
