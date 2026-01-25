"use client";

import {
	ArrowLeft,
	Award,
	CheckCircle2,
	Crown,
	Loader2,
	Trophy,
	Users,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { trpc } from "@/utils/trpc";

interface Training {
	id: string;
	name: string;
	description: string | null;
}

interface TrainingSession {
	id: string;
	trainingId: string;
	hostUserId: string;
	status: "pending" | "active" | "completed";
	startedAt: string | null;
	completedAt: string | null;
}

interface SessionSummaryProps {
	trainingId: string;
	sessionId: string;
	currentUserId: string;
}

export function SessionSummary({
	trainingId,
	sessionId,
	currentUserId,
}: SessionSummaryProps) {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<"overview" | "insights">(
		"overview",
	);

	const {
		data: trainingData,
		isLoading: trainingLoading,
		error: trainingError,
	} = useSupabaseQuery<Training>({
		queryFn: (supabase) =>
			supabase
				.from("training")
				.select("id, name, description")
				.eq("id", trainingId),
	});

	const {
		data: sessionData,
		isLoading: sessionLoading,
		error: sessionError,
	} = useSupabaseQuery<TrainingSession>({
		queryFn: (supabase) =>
			supabase
				.from("training_session")
				.select("id, trainingId, hostUserId, status, startedAt, completedAt")
				.eq("id", sessionId),
	});

	// Fetch AI-generated summary using tRPC
	const {
		data: aiSummary,
		isLoading: aiSummaryLoading,
		error: aiSummaryError,
	} = (trpc as any).aiSummary.generate.useQuery(
		{ sessionId },
		{
			enabled: !!sessionId && sessionData?.[0]?.status === "completed",
		},
	);

	const training = trainingData?.[0];
	const session = sessionData?.[0];
	const isLoading = trainingLoading || sessionLoading || aiSummaryLoading;

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="flex flex-col items-center gap-3">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					<p className="text-muted-foreground text-sm">Loading summary...</p>
				</div>
			</div>
		);
	}

	if (trainingError || sessionError) {
		return (
			<Card className="border-destructive">
				<CardContent className="flex flex-col items-center gap-3 py-10">
					<p className="font-medium text-destructive text-sm">
						Failed to load summary
					</p>
					<Button
						variant="outline"
						className="gap-2"
						onClick={() => router.push(`/trainings/${trainingId}`)}
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Training
					</Button>
				</CardContent>
			</Card>
		);
	}

	if (!training || !session) {
		return (
			<Card>
				<CardContent className="flex flex-col items-center gap-3 py-10">
					<p className="text-muted-foreground text-sm">Summary not available</p>
					<Button
						variant="outline"
						className="gap-2"
						onClick={() => router.push(`/trainings/${trainingId}`)}
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Training
					</Button>
				</CardContent>
			</Card>
		);
	}

	if (session.status !== "completed") {
		return (
			<Card>
				<CardContent className="flex flex-col items-center gap-3 py-10 text-center">
					<CheckCircle2 className="h-10 w-10 text-muted-foreground" />
					<div className="space-y-1">
						<p className="font-medium">Summary not ready yet</p>
						<p className="text-muted-foreground text-sm">
							Finish the session to view the full summary.
						</p>
					</div>
					<Button
						variant="outline"
						className="gap-2"
						onClick={() =>
							router.push(
								`/trainings/${trainingId}/session?sessionId=${sessionId}`,
							)
						}
					>
						<ArrowLeft className="h-4 w-4" />
						Return to Session
					</Button>
				</CardContent>
			</Card>
		);
	}

	if (aiSummaryError) {
		return (
			<Card>
				<CardContent className="flex flex-col items-center gap-3 py-10">
					<p className="font-medium text-destructive">
						Failed to load AI summary
					</p>
					<p className="text-muted-foreground text-sm">
						{aiSummaryError.message}
					</p>
					<Button
						variant="outline"
						className="gap-2"
						onClick={() => router.push(`/trainings/${trainingId}`)}
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Training
					</Button>
				</CardContent>
			</Card>
		);
	}

	if (!aiSummary) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	const avgCompletion =
		aiSummary.participants.reduce(
			(sum: number, p: any) => sum + p.overallCompletion,
			0,
		) / aiSummary.participants.length;

	const currentUserRanking = aiSummary.comparisons.find(
		(c: any) => c.userId === currentUserId,
	);
	const winners = aiSummary.comparisons.filter((c: any) => c.isWinner);

	// Get rank badge component
	const getRankBadge = (index: number): React.ReactNode => {
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
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label="Back to training"
							onClick={() => router.push(`/trainings/${trainingId}`)}
						>
							<ArrowLeft className="h-4 w-4" />
						</Button>
						<Trophy className="h-5 w-5 text-yellow-500" />
						<h1 className="font-semibold text-xl">Training Complete!</h1>
					</div>
					<p className="text-muted-foreground text-sm">
						{aiSummary.trainingName}
						{aiSummary.trainingDescription
							? ` - ${aiSummary.trainingDescription}`
							: ""}
					</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					className="gap-2"
					onClick={() => router.push(`/trainings/${trainingId}`)}
				>
					<ArrowLeft className="h-4 w-4" />
					Back to Training
				</Button>
			</div>

			{/* Overall Stats */}
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-4">
						<div className="mb-1 flex items-center gap-1 text-muted-foreground text-xs">
							<Users className="h-3 w-3" />
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
							{aiSummary.participants.reduce(
								(sum: number, p: any) => sum + p.totalCompletedReps,
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
							{winners.map((winner: any) => (
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
									aiSummary.comparisons.findIndex(
										(c: any) => c.userId === currentUserId,
									),
								)}
							</Badge>
						</div>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
			<Tabs
				value={activeTab}
				onValueChange={(v) => setActiveTab(v as typeof activeTab)}
				className="w-full"
			>
				<TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
					<TabsTrigger value="overview">Rankings</TabsTrigger>
					<TabsTrigger value="insights">AI Insights</TabsTrigger>
				</TabsList>

				{/* Rankings Tab */}
				<TabsContent value="overview" className="space-y-3">
					{aiSummary.comparisons.map((comparison: any, index: number) => {
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

				{/* AI Insights Tab */}
				<TabsContent value="insights" className="space-y-4">
					{/* Session Insights */}
					<div className="space-y-2">
						<h3 className="font-semibold text-sm">Session Highlights</h3>
						<div className="space-y-2">
							{aiSummary.insights.map((insight: string) => (
								<Card key={`insight-${insight.slice(0, 20)}`}>
									<CardContent className="py-3">
										<p className="text-sm">{insight}</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>

					{/* Individual Highlights */}
					{aiSummary.highlights.length > 0 && (
						<div className="space-y-2">
							<h3 className="font-semibold text-sm">Performance Highlights</h3>
							<div className="space-y-2">
								{aiSummary.highlights.map((highlight: string) => (
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
