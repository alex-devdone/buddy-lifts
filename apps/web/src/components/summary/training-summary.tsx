"use client";

import { formatDistanceToNow } from "date-fns";
import {
	Award,
	Calendar,
	CheckCircle2,
	Crown,
	Loader2,
	TrendingUp,
	Trophy,
	Users,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/utils/trpc";

interface TrainingSummaryProps {
	sessionId: string;
	currentUserId?: string;
}

/**
 * TrainingSummary Component
 *
 * Displays a comprehensive post-workout summary with AI-powered analysis.
 * Shows participant comparisons, highlights, and insights for completed training sessions.
 *
 * Uses hybrid pattern:
 * - Reads from Supabase: session status to check if completed
 * - Writes via tRPC: aiSummary.generate query for full summary
 *
 * Features:
 * - Overall completion stats
 * - Participant comparison rankings
 * - Individual performance highlights
 * - Exercise-by-exercise breakdown
 * - Session-wide insights
 *
 * Mobile-first responsive design.
 */
export function TrainingSummary({
	sessionId,
	currentUserId,
}: TrainingSummaryProps) {
	// Fetch training summary via tRPC (read operation for computed data)
	const {
		data: summary,
		isLoading,
		error,
	} = trpc.aiSummary.generate.useQuery(
		{ sessionId },
		{
			enabled: !!sessionId,
			retry: false,
		},
	);

	// Get current user's ranking
	const currentUserRanking = useMemo(() => {
		if (!summary || !currentUserId) return null;
		return summary.comparisons.find((c) => c.userId === currentUserId);
	}, [summary, currentUserId]);

	// Get winner(s)
	const winners = useMemo(() => {
		if (!summary) return [];
		return summary.comparisons.filter((c) => c.isWinner);
	}, [summary]);

	// Get rank badge
	const getRankBadge = useCallback((index: number) => {
		switch (index) {
			case 0:
				return <Badge variant="warning">1st</Badge>;
			case 1:
				return <Badge variant="secondary">2nd</Badge>;
			case 2:
				return <Badge variant="outline">3rd</Badge>;
			default:
				return <Badge variant="outline">{`${index + 1}th`}</Badge>;
		}
	}, []);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (error) {
		return (
			<Card className="border-destructive">
				<CardContent className="flex flex-col items-center justify-center py-8">
					<p className="font-medium text-destructive">Failed to load summary</p>
					<p className="mt-2 text-muted-foreground text-sm">{error.message}</p>
				</CardContent>
			</Card>
		);
	}

	if (!summary) {
		return null;
	}

	// Calculate average completion
	const avgCompletion =
		summary.participants.reduce((sum, p) => sum + p.overallCompletion, 0) /
		summary.participants.length;

	return (
		<div className="w-full space-y-6">
			{/* Header */}
			<div className="space-y-2">
				<div className="flex items-center gap-2">
					<Trophy className="h-5 w-5 text-yellow-500" />
					<h2 className="font-bold text-xl">Training Complete!</h2>
				</div>
				<p className="text-muted-foreground text-sm">
					{summary.trainingName}
					{summary.trainingDescription && ` - ${summary.trainingDescription}`}
				</p>
				<div className="flex items-center gap-4 text-muted-foreground text-xs">
					<div className="flex items-center gap-1">
						<Calendar className="h-3 w-3" />
						<span>
							{formatDistanceToNow(new Date(summary.completedAt), {
								addSuffix: true,
							})}
						</span>
					</div>
					<div className="flex items-center gap-1">
						<Users className="h-3 w-3" />
						<span>
							{summary.participantCount} participant
							{summary.participantCount > 1 ? "s" : ""}
						</span>
					</div>
				</div>
			</div>

			{/* Overall Stats */}
			<div className="grid grid-cols-2 gap-3">
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-4">
						<div className="mb-1 flex items-center gap-1 text-muted-foreground text-xs">
							<TrendingUp className="h-3 w-3" />
							<span>Avg Completion</span>
						</div>
						<p className="font-bold text-2xl">{Math.round(avgCompletion)}%</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-4">
						<div className="mb-1 flex items-center gap-1 text-muted-foreground text-xs">
							<CheckCircle2 className="h-3 w-3" />
							<span>Total Reps</span>
						</div>
						<p className="font-bold text-2xl">
							{summary.participants.reduce(
								(sum, p) => sum + p.totalCompletedReps,
								0,
							)}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Winner(s) */}
			{winners.length > 0 && (
				<Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
					<CardHeader className="pb-3">
						<div className="flex items-center gap-2">
							<Crown className="h-5 w-5 text-yellow-500" />
							<h3 className="font-semibold">
								{winners.length === 1 ? "Top Performer" : "Tied for First"}
							</h3>
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{winners.map((winner) => (
								<Badge
									key={winner.userId}
									variant="success"
									className="px-3 py-1 text-sm"
								>
									{winner.userName} - {winner.overallCompletion}%
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Your Performance (if participant) */}
			{currentUserRanking && (
				<Card className="border-primary/50">
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<h3 className="font-semibold">Your Performance</h3>
							<Badge
								variant={currentUserRanking.isWinner ? "success" : "secondary"}
							>
								{getRankBadge(
									summary.comparisons.findIndex(
										(c) => c.userId === currentUserId,
									),
								)}
							</Badge>
						</div>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="grid grid-cols-2 gap-3">
							<div>
								<p className="text-muted-foreground text-xs">Completion</p>
								<p className="font-bold text-lg">
									{currentUserRanking.overallCompletion}%
								</p>
							</div>
							<div>
								<p className="text-muted-foreground text-xs">Reps Completed</p>
								<p className="font-bold text-lg">
									{currentUserRanking.totalCompletedReps}
								</p>
							</div>
						</div>
						{!currentUserRanking.isWinner && (
							<div className="rounded bg-muted/50 p-2">
								<p className="text-muted-foreground text-xs">
									{currentUserRanking.differenceFromWinner === 0
										? "You tied for first place!"
										: `${currentUserRanking.differenceFromWinner}% behind the leader`}
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Tabs for detailed views */}
			<Tabs defaultValue="comparisons" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="comparisons">Rankings</TabsTrigger>
					<TabsTrigger value="insights">Insights</TabsTrigger>
				</TabsList>

				{/* Comparisons Tab */}
				<TabsContent value="comparisons" className="space-y-3">
					{summary.comparisons.map((comparison, index) => {
						const isCurrentUser = comparison.userId === currentUserId;

						return (
							<Card
								key={comparison.userId}
								className={`transition-all ${
									isCurrentUser ? "ring-2 ring-primary/50" : ""
								} ${comparison.isWinner ? "bg-gradient-to-r from-yellow-500/5 to-transparent" : ""}`}
							>
								<CardContent className="flex items-center justify-between py-4">
									<div className="flex min-w-0 flex-1 items-center gap-3">
										<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
											{comparison.isWinner ? (
												<Award className="h-4 w-4 text-yellow-500" />
											) : (
												<span className="font-semibold text-xs">
													{index + 1}
												</span>
											)}
										</div>
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<p className="truncate font-medium text-sm">
													{comparison.userName}
												</p>
												{isCurrentUser && (
													<Badge variant="outline" className="text-xs">
														You
													</Badge>
												)}
											</div>
											<p className="text-muted-foreground text-xs">
												{comparison.totalCompletedReps} reps completed
											</p>
										</div>
									</div>
									<div className="shrink-0 text-right">
										<p className="font-bold text-lg">
											{comparison.overallCompletion}%
										</p>
										{!comparison.isWinner &&
											comparison.differenceFromWinner > 0 && (
												<p className="text-muted-foreground text-xs">
													-{comparison.differenceFromWinner}%
												</p>
											)}
									</div>
								</CardContent>
							</Card>
						);
					})}
				</TabsContent>

				{/* Insights Tab */}
				<TabsContent value="insights" className="space-y-4">
					{/* Session Insights */}
					<div className="space-y-2">
						<h3 className="font-semibold text-sm">Session Highlights</h3>
						<div className="space-y-2">
							{summary.insights.map((insight) => (
								<Card key={`insight-${insight.slice(0, 20)}`}>
									<CardContent className="py-3">
										<p className="text-sm">{insight}</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>

					{/* Individual Highlights */}
					{summary.highlights.length > 0 && (
						<div className="space-y-2">
							<h3 className="font-semibold text-sm">Performance Highlights</h3>
							<div className="space-y-2">
								{summary.highlights.map((highlight) => (
									<Card key={`highlight-${highlight.slice(0, 20)}`}>
										<CardContent className="py-3">
											<p className="whitespace-pre-wrap text-sm">{highlight}</p>
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
