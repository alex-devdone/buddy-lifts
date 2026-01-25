"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Error Boundary for Friends Page
 *
 * Catches and displays errors that occur during friends list rendering.
 */
export default function FriendsError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Friends page error:", error);
	}, [error]);

	return (
		<div className="container flex max-w-2xl items-center justify-center px-4 py-12 md:px-6">
			<Card className="border-destructive">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<AlertCircle className="h-5 w-5 text-destructive" />
						Could Not Load Friends
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground text-sm">
						Something went wrong while loading your friends. Please try again.
					</p>

					{process.env.NODE_ENV === "development" && error.message && (
						<div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
							<p className="font-mono text-destructive text-xs">
								{error.message}
							</p>
						</div>
					)}

					<Button onClick={reset} className="w-full gap-1">
						<RefreshCw className="h-4 w-4" />
						Try Again
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
