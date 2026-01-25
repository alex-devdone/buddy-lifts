/**
 * Tests for session summary page and component
 *
 * Run with: bun test apps/web/src/app/trainings/[id]/summary/__tests__/page.test.tsx
 */

import { describe, expect, it } from "vitest";

describe("Session Summary Page", () => {
	describe("Component Structure", () => {
		it("should export the page component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain(
				"export default async function SessionSummaryPage",
			);
		});

		it("should be an async server component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("export default async function");
		});

		it("should accept params and searchParams props", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("params: Promise<{ id: string }>");
			expect(content).toContain(
				"searchParams: Promise<{ sessionId?: string }>",
			);
		});
	});

	describe("Authentication Flow", () => {
		it("should check for session using auth.api.getSession", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("auth.api.getSession");
			expect(content).toContain("headers: await headers()");
		});

		it("should redirect to login if no session exists", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("if (!session?.user)");
			expect(content).toContain('redirect("/login")');
		});

		it("should redirect to training when no sessionId provided", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("if (!sessionId)");
			expect(content).toMatch(/redirect\(`\/trainings\/\$\{trainingId\}`\)/);
		});
	});

	describe("Rendering", () => {
		it("should render SessionSummary component with props", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("<SessionSummary");
			expect(content).toContain("trainingId={trainingId}");
			expect(content).toContain("sessionId={sessionId}");
			expect(content).toContain("currentUserId={session.user.id}");
		});

		it("should use responsive container classes", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("max-w-6xl");
			expect(content).toContain("px-4");
			expect(content).toContain("md:px-6");
		});

		it("should be located at trainings/[id]/summary route", () => {
			const path = require("node:path");
			const routePath = path.dirname(__dirname).split("/").slice(-3).join("/");
			expect(routePath).toBe("trainings/[id]/summary");
		});
	});
});

describe("SessionSummary Component", () => {
	describe("Component Structure", () => {
		it("should be a client component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain('"use client"');
		});

		it("should export SessionSummary function", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("export function SessionSummary");
		});

		it("should accept trainingId, sessionId, and currentUserId props", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("trainingId: string");
			expect(content).toContain("sessionId: string");
			expect(content).toContain("currentUserId: string");
		});
	});

	describe("Data Fetching", () => {
		it("should use Supabase for training data", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("useSupabaseQuery<Training>");
			expect(content).toContain('.from("training")');
		});

		it("should use Supabase for session data", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("useSupabaseQuery<TrainingSession>");
			expect(content).toContain('.from("training_session")');
		});

		it("should use tRPC for AI summary", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("trpc.aiSummary.generate.useQuery");
		});

		it("should only fetch AI summary when session is completed", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain('sessionData?.[0]?.status === "completed"');
		});
	});

	describe("UI Components", () => {
		it("should use Trophy icon for header", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("Trophy");
			expect(content).toContain("text-yellow-500");
		});

		it("should display winner card with Crown icon", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("Crown");
			expect(content).toContain("Top Performer");
			expect(content).toContain("Tied for First");
		});

		it("should display average completion and total reps stats", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("Avg Completion");
			expect(content).toContain("Total Reps");
		});

		it("should display Your Performance card for current user", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("Your Performance");
			expect(content).toContain("currentUserRanking");
		});

		it("should use Tabs for Rankings and AI Insights views", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("<Tabs value={activeTab}");
			expect(content).toContain("Rankings");
			expect(content).toContain("AI Insights");
		});

		it("should display participant rankings with Award icon", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("Award");
			expect(content).toContain("aiSummary.comparisons.map");
		});

		it("should display session insights and performance highlights", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("Session Highlights");
			expect(content).toContain("Performance Highlights");
			expect(content).toContain("aiSummary.insights.map");
			expect(content).toContain("aiSummary.highlights.map");
		});
	});

	describe("Loading and Error States", () => {
		it("should show loading state with Loader2", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("Loader2");
			expect(content).toContain("Loading summary...");
		});

		it("should show error state for training/session fetch failure", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("trainingError || sessionError");
			expect(content).toContain("Failed to load summary");
		});

		it("should show error state for AI summary fetch failure", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("aiSummaryError");
			expect(content).toContain("Failed to load AI summary");
		});

		it("should show not ready state for non-completed sessions", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain('session.status !== "completed"');
			expect(content).toContain("Summary not ready yet");
		});
	});

	describe("Rank Badge Function", () => {
		it("should have getRankBadge function", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("const getRankBadge = (index: number)");
		});

		it("should return warning badge for 1st place", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("case 0:");
			expect(content).toContain('variant="warning"');
			expect(content).toContain("1st");
		});

		it("should return secondary badge for 2nd place", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("case 1:");
			expect(content).toContain('variant="secondary"');
			expect(content).toContain("2nd");
		});

		it("should return outline badge for 3rd place", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("case 2:");
			expect(content).toContain('variant="outline"');
			expect(content).toContain("3rd");
		});
	});

	describe("User Highlighting", () => {
		it("should highlight current user in rankings", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain(
				"isCurrentUser = comparison.userId === currentUserId",
			);
			expect(content).toContain("ring-2 ring-primary/50");
		});

		it("should show 'You' badge for current user", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("{isCurrentUser && (");
			expect(content).toContain('<Badge variant="outline"');
		});
	});

	describe("Navigation", () => {
		it("should have back button to training", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-summary.tsx`,
				"utf-8",
			);
			expect(content).toContain("ArrowLeft");
			expect(content).toContain("Back to Training");
			expect(content).toMatch(
				/router\.push\(`\/trainings\/\$\{trainingId\}`\)/,
			);
		});
	});
});
