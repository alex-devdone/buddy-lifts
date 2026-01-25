"use client";

import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Error Boundary for Active Session Page
 *
 * Catches and displays errors that occur during session rendering.
 * Provides options to retry or navigate away.
 *
 * This is a Next.js App Router error boundary that automatically
 * catches errors from the page.tsx and its child components.
 */
export default function SessionError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	// Log error to error reporting service
	useEffect(() => {
		console.error("Session page error:", error);
	}, [error]);

	return (
		<div className="container flex max-w-2xl items-center justify-center px-4 py-12 md:px-6">
			<Card className="border-destructive">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<AlertCircle className="h-5 w-5 text-destructive" />
						Session Error
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground text-sm">
						Something went wrong while loading the training session. This could
						be due to a network issue or a temporary problem with the service.
					</p>

					{/* Error details (in development) */}
					{process.env.NODE_ENV === "development" && error.message && (
						<div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
							<p className="font-mono text-destructive text-xs">
								{error.message}
							</p>
							{error.digest && (
								<p className="text-muted-foreground text-xs">
									Error ID: {error.digest}
								</p>
							)}
						</div>
					)}

					{/* Action buttons */}
					<div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
						<Button
							variant="outline"
							onClick={() => window.history.back()}
							className="gap-1"
						>
							<ArrowLeft className="h-4 w-4" />
							Go Back
						</Button>
						<div className="flex gap-2">
							<Button variant="default" onClick={reset} className="gap-1">
								<RefreshCw className="h-4 w-4" />
								Try Again
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
