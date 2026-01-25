"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Error Boundary for Feed Page
 *
 * Catches and displays errors that occur during feed rendering.
 */
export default function FeedError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Feed page error:", error);
	}, [error]);

	return (
		<div className="container flex max-w-2xl items-center justify-center px-4 py-12 md:px-6">
			<Card className="border-destructive">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<AlertCircle className="h-5 w-5 text-destructive" />
						Could Not Load Feed
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground text-sm">
						Something went wrong while loading your feed. Please try again.
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
