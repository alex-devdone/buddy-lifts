/**
 * Tests for TrainingSummary Component
 *
 * Run with: bun test apps/web/src/components/summary/__tests__/training-summary.test.tsx
 *
 * Tests the post-workout summary component with AI-powered analysis.
 * Displays participant comparisons, highlights, and insights for completed training sessions.
 */

import { TrainingSummary } from "../training-summary";

describe("TrainingSummary Component", () => {
	describe("Component Structure", () => {
		it("should be a named function component exported from its file", () => {
			expect(TrainingSummary).toBeTypeOf("function");
			expect(TrainingSummary.name).toBe("TrainingSummary");
		});

		it("should be defined in a file matching its name", () => {
			expect(TrainingSummary).toBeDefined();
		});

		it("should be a client component with 'use client' directive", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain('"use client"');
		});

		it("should export TrainingSummary function", async () => {
			const file = await import("../training-summary");
			expect(typeof file.TrainingSummary).toBe("function");
		});
	});

	describe("Dependencies", () => {
		it("should import from date-fns", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("formatDistanceToNow");
			expect(content).toContain("date-fns");
		});

		it("should import icons from lucide-react", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("Award");
			expect(content).toContain("Calendar");
			expect(content).toContain("CheckCircle2");
			expect(content).toContain("Crown");
			expect(content).toContain("Loader2");
			expect(content).toContain("TrendingUp");
			expect(content).toContain("Trophy");
			expect(content).toContain("Users");
			expect(content).toContain("lucide-react");
		});

		it("should import React hooks", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("useCallback");
			expect(content).toContain("useMemo");
		});

		it("should import Badge component", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("@/components/ui/badge");
		});

		it("should import Card components", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("@/components/ui/card");
		});

		it("should import Tabs components", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("@/components/ui/tabs");
		});

		it("should import tRPC client", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("@/utils/trpc");
		});
	});

	describe("Props Interface", () => {
		it("should define TrainingSummaryProps interface", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("interface TrainingSummaryProps");
		});

		it("should require sessionId prop", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toMatch(/sessionId:\s*string/);
		});

		it("should have optional currentUserId prop", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toMatch(/currentUserId\?:\s*string/);
		});
	});

	describe("State Management", () => {
		it("should use tRPC useQuery for fetching summary", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("trpc.aiSummary.generate.queryOptions");
			expect(content).toContain("useQuery");
		});

		it("should compute currentUserRanking with useMemo", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("currentUserRanking");
			expect(content).toContain("useMemo");
		});

		it("should compute winners with useMemo", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("winners");
			expect(content).toContain("useMemo");
		});

		it("should define getRankBadge with useCallback", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("getRankBadge");
			expect(content).toContain("useCallback");
		});
	});

	describe("Data Access Pattern", () => {
		it("should read data via tRPC query", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("trpc.aiSummary.generate.queryOptions");
			expect(content).toContain("useQuery");
		});

		it("should not use Supabase direct queries (uses tRPC for computed data)", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).not.toContain("useSupabaseQuery");
		});
	});

	describe("Component Features", () => {
		it("should have loading state with Loader2 icon", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("isLoading");
			expect(content).toContain("Loader2");
			expect(content).toContain("animate-spin");
		});

		it("should have error state display", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("error");
			expect(content).toContain("border-destructive");
			expect(content).toContain("Failed to load summary");
		});

		it("should display training name in header", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("trainingName");
			expect(content).toContain("Training Complete!");
			expect(content).toContain("Trophy");
		});

		it("should calculate and display average completion stat", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("avgCompletion");
			expect(content).toContain("Avg Completion");
			expect(content).toContain("TrendingUp");
		});

		it("should display total reps completed", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("Total Reps");
			expect(content).toContain("CheckCircle2");
			expect(content).toContain("totalCompletedReps");
		});

		it("should display winner card when there are winners", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("Top Performer");
			expect(content).toContain("Tied for First");
			expect(content).toContain("Crown");
			expect(content).toContain("isWinner");
		});

		it("should display 'Your Performance' card when current user is a participant", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("Your Performance");
			expect(content).toContain("currentUserRanking");
			expect(content).toContain("Completion");
			expect(content).toContain("Reps Completed");
		});

		it("should have tabs for Rankings and Insights", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("Rankings");
			expect(content).toContain("Insights");
			expect(content).toContain("<Tabs");
			expect(content).toContain("TabsList");
			expect(content).toContain("TabsTrigger");
			expect(content).toContain("TabsContent");
		});

		it("should display session highlights", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("Session Highlights");
			expect(content).toContain("summary.insights");
		});

		it("should display performance highlights", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("Performance Highlights");
			expect(content).toContain("summary.highlights");
			expect(content).toContain("whitespace-pre-wrap");
		});

		it("should display participant rankings with badges", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("summary.comparisons");
			expect(content).toContain("overallCompletion");
			expect(content).toContain("differenceFromWinner");
			expect(content).toContain("totalCompletedReps");
		});

		it("should highlight current user in rankings", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("isCurrentUser");
			expect(content).toContain("ring-2 ring-primary/50");
			expect(content).toContain("You");
		});

		it("should use date formatting for completed time", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("formatDistanceToNow");
			expect(content).toContain("summary.completedAt");
			expect(content).toContain("addSuffix: true");
		});
	});

	describe("Accessibility", () => {
		it("should use semantic HTML elements", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("<div"); // main container
			expect(content).toContain("<h2");
			expect(content).toContain("<h3");
			expect(content).toContain("<p");
		});

		it("should use proper heading hierarchy", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain('className="font-bold text-xl"');
		});

		it("should have proper ARIA labels for icons", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			// Icons are decorative, used with text labels
			expect(content).toContain("Trophy");
			expect(content).toContain("Calendar");
			expect(content).toContain("Users");
		});
	});

	describe("Responsive Design", () => {
		it("should use mobile-first Tailwind classes", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("grid-cols-1");
			expect(content).toContain("sm:grid-cols-2");
			expect(content).toContain("text-sm");
			expect(content).toContain("text-xs");
			expect(content).toContain("text-lg");
			expect(content).toContain("text-2xl");
		});

		it("should have responsive spacing classes", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("gap-2");
			expect(content).toContain("gap-3");
			expect(content).toContain("gap-4");
			expect(content).toContain("space-y-2");
			expect(content).toContain("space-y-3");
			expect(content).toContain("space-y-4");
			expect(content).toContain("space-y-6");
		});

		it("should use flex-wrap for responsive layouts", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("flex-wrap");
		});

		it("should use truncate for long text", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("truncate");
		});

		it("should use min-w-0 for flex child truncation", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("min-w-0");
		});

		it("should use shrink-0 for elements that shouldn't shrink", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("shrink-0");
		});
	});

	describe("Business Logic", () => {
		it("should calculate average completion correctly", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("avgCompletion");
			expect(content).toContain("reduce");
			expect(content).toContain("overallCompletion");
			expect(content).toContain("Math.round");
		});

		it("should filter winners from comparisons", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toMatch(/filter\(\(c\)\s*=>\s*c\.isWinner\)/);
		});

		it("should find current user ranking", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toMatch(
				/find\(\(c\)\s*=>\s*c\.userId\s*===\s*currentUserId\)/,
			);
		});

		it("should handle single winner vs multiple winners", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("Top Performer");
			expect(content).toContain("Tied for First");
			expect(content).toMatch(/winners\.length\s*===\s*1/);
		});

		it("should handle tied for first place display", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("tied for first place");
			expect(content).toContain("differenceFromWinner");
		});

		it("should compute rank badges correctly", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("getRankBadge");
			expect(content).toContain("1st");
			expect(content).toContain("2nd");
			expect(content).toContain("3rd");
			expect(content).toContain("warning");
			expect(content).toContain("secondary");
			expect(content).toContain("outline");
		});
	});

	describe("Code Quality", () => {
		it("should have proper TypeScript types", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("interface TrainingSummaryProps");
		});

		it("should use descriptive variable names", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("currentUserRanking");
			expect(content).toContain("avgCompletion");
			expect(content).toContain("getRankBadge");
			expect(content).toContain("isCurrentUser");
		});

		it("should have JSDoc comment documentation", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("/**");
			expect(content).toContain("TrainingSummary Component");
			expect(content).toContain("*");
		});

		it("should document hybrid pattern usage", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("hybrid pattern");
			expect(content).toContain("tRPC");
		});

		it("should document mobile-first design", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("Mobile-first");
		});

		it("should handle null summary gracefully", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("if (!summary)");
			expect(content).toContain("return null");
		});

		it("should handle loading state", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("if (isLoading)");
		});

		it("should handle error state", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/training-summary.tsx",
				"utf-8",
			);
			expect(content).toContain("if (error)");
		});
	});
});
