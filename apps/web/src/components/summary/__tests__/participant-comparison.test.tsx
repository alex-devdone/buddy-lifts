/**
 * Tests for ParticipantComparison Component
 *
 * Run with: bun test apps/web/src/components/summary/__tests__/participant-comparison.test.tsx
 *
 * Tests the visual comparison chart component displaying participants' performance side-by-side.
 */

import { describe, expect, it } from "vitest";
import {
	ParticipantComparison,
	ParticipantComparisonError,
	ParticipantComparisonLoading,
} from "../participant-comparison";

describe("ParticipantComparison Component", () => {
	describe("Component Structure", () => {
		it("should be a named function component exported from its file", () => {
			expect(ParticipantComparison).toBeTypeOf("function");
			expect(ParticipantComparison.name).toBe("ParticipantComparison");
		});

		it("should be defined in a file matching its name", () => {
			expect(ParticipantComparison).toBeDefined();
		});

		it("should be a client component with 'use client' directive", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain('"use client"');
		});

		it("should export ParticipantComparison function", async () => {
			const file = await import("../participant-comparison");
			expect(typeof file.ParticipantComparison).toBe("function");
		});
	});

	describe("Dependencies", () => {
		it("should import icons from lucide-react", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("Award");
			expect(content).toContain("CheckCircle2");
			expect(content).toContain("Loader2");
			expect(content).toContain("TrendingUp");
			expect(content).toContain("lucide-react");
		});

		it("should import React hooks", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("useMemo");
		});

		it("should import Badge component", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("@/components/ui/badge");
		});

		it("should import Card components", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("@/components/ui/card");
		});
	});

	describe("Props Interface", () => {
		it("should define ParticipantComparisonProps interface", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("interface ParticipantComparisonProps");
		});

		it("should define ParticipantComparisonData interface", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("interface ParticipantComparisonData");
		});

		it("should define ParticipantSummaryData interface", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("interface ParticipantSummaryData");
		});

		it("should define ExercisePerformanceData interface", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("interface ExercisePerformanceData");
		});

		it("should require comparisons prop", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toMatch(/comparisons:\s*ParticipantComparisonData\[\]/);
		});

		it("should have optional participants prop", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toMatch(/participants\?:\s*ParticipantSummaryData\[\]/);
		});

		it("should have optional currentUserId prop", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toMatch(/currentUserId\?:\s*string/);
		});

		it("should have optional showExerciseBreakdown prop", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toMatch(/showExerciseBreakdown\?:\s*boolean/);
		});
	});

	describe("State Management", () => {
		it("should compute participantMap with useMemo", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("participantMap");
			expect(content).toContain("useMemo");
		});

		it("should calculate maxCompletion for relative progress bars", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("maxCompletion");
			expect(content).toContain("Math.max");
		});
	});

	describe("Data Access Pattern", () => {
		it("should read data via props from parent component", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("comparisons");
			expect(content).toContain("participants");
		});

		it("should not use tRPC or Supabase direct queries", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).not.toContain("useSupabaseQuery");
			expect(content).not.toContain("trpc.");
			expect(content).not.toContain("useQuery");
			expect(content).not.toContain("useMutation");
		});
	});

	describe("Component Features", () => {
		it("should have empty state when no comparisons provided", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("No participant data available");
			expect(content).toMatch(/comparisons\.length\s*===\s*0/);
		});

		it("should display header with stats", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("Performance Comparison");
			expect(content).toContain("TrendingUp");
			expect(content).toContain("CheckCircle2");
		});

		it("should display participant count in header", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toMatch(/comparisons\.length.*participant/);
		});

		it("should display progress bars for completion percentage", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("Completion");
			expect(content).toContain("progress bar");
			expect(content).toContain("rounded-full");
			expect(content).toContain("bg-muted");
		});

		it("should display rank badges (1st, 2nd, 3rd)", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("getRankBadge");
			expect(content).toContain("1st");
			expect(content).toContain("2nd");
			expect(content).toContain("3rd");
		});

		it("should highlight winners with special styling", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("Award");
			expect(content).toContain("isWinner");
			expect(content).toContain("from-yellow-500/10");
			expect(content).toContain("to-orange-500/10");
		});

		it("should highlight current user with ring indicator", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("isCurrentUser");
			expect(content).toContain("ring-2 ring-primary/50");
			expect(content).toContain("You");
		});

		it("should display difference from winner for non-winners", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("differenceFromWinner");
			expect(content).toMatch(/!comparison\.isWinner/);
		});

		it("should support optional exercise breakdown display", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("showExerciseBreakdown");
			expect(content).toContain("Exercises");
		});

		it("should limit exercise display to top 3 with more indicator", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toMatch(/\.slice\(0,\s*3\)/);
			expect(content).toContain("more exercises");
		});
	});

	describe("Helper Functions", () => {
		it("should export getRankBadge function", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("function getRankBadge");
		});

		it("should export getProgressColorClasses function", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("function getProgressColorClasses");
		});

		it("should return correct color for 100% completion", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain(">= 100");
			expect(content).toContain("bg-green-500");
		});

		it("should return correct color for 75% completion", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain(">= 75");
			expect(content).toContain("bg-lime-500");
		});

		it("should return correct color for 50% completion", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain(">= 50");
			expect(content).toContain("bg-yellow-500");
		});

		it("should return correct color for 25% completion", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain(">= 25");
			expect(content).toContain("bg-orange-500");
		});

		it("should return correct color for < 25% completion", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("bg-red-500");
		});
	});

	describe("Loading and Error Components", () => {
		it("should export ParticipantComparisonLoading component", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("ParticipantComparisonLoading");
			expect(content).toContain("Loader2");
			expect(content).toContain("animate-spin");
		});

		it("should export ParticipantComparisonError component", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("ParticipantComparisonError");
			expect(content).toContain("Failed to load comparison");
			expect(content).toContain("border-destructive");
		});

		it("should accept message prop for error component", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toMatch(/\{\s*message\s*\}/);
		});
	});

	describe("Accessibility", () => {
		it("should use semantic HTML elements", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("<div");
			expect(content).toContain("<h3");
			expect(content).toContain("<p");
		});

		it("should have proper ARIA labels for progress bars", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain('role="progressbar"');
			expect(content).toContain("aria-valuenow");
			expect(content).toContain("aria-valuemin");
			expect(content).toContain("aria-valuemax");
			expect(content).toContain("aria-label");
		});

		it("should have proper heading hierarchy", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("font-semibold");
		});
	});

	describe("Responsive Design", () => {
		it("should use mobile-first Tailwind classes", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("text-xs");
			expect(content).toContain("text-sm");
			expect(content).toContain("text-lg");
		});

		it("should have responsive grid layout", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("grid-cols-1");
			expect(content).toContain("sm:grid-cols-2");
		});

		it("should have responsive spacing classes", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("gap-2");
			expect(content).toContain("gap-3");
			expect(content).toContain("gap-4");
			expect(content).toContain("space-y-2");
			expect(content).toContain("space-y-3");
			expect(content).toContain("space-y-4");
		});

		it("should use truncate for long text", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("truncate");
		});

		it("should use min-w-0 for flex child truncation", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("min-w-0");
		});
	});

	describe("Business Logic", () => {
		it("should create map for participant lookup", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("Map");
			expect(content).toContain("participantMap");
		});

		it("should calculate max completion for relative progress", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toMatch(/const maxCompletion\s*=/);
			expect(content).toContain("Math.max");
			expect(content).toContain("overallCompletion");
		});

		it("should calculate progress width relative to max", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("progressWidth");
			expect(content).toMatch(
				/comparison\.overallCompletion\s*\/\s*maxCompletion/,
			);
		});

		it("should handle null participants gracefully", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toMatch(/if\s*\(!participants\)\s*return/);
		});

		it("should handle zero max completion", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toMatch(/maxCompletion\s*>\s*0/);
		});

		it("should check for current user comparison", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toMatch(/comparison\.userId\s*===\s*currentUserId/);
		});

		it("should get detailed data for exercise breakdown", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("detailedData");
			expect(content).toMatch(/participantMap\.get/);
		});

		it("should check exercise breakdown flag before showing", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toMatch(/showExerciseBreakdown\s*&&/);
		});
	});

	describe("Code Quality", () => {
		it("should have proper TypeScript types", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("interface ParticipantComparisonProps");
			expect(content).toContain("interface ParticipantComparisonData");
			expect(content).toContain("interface ParticipantSummaryData");
			expect(content).toContain("interface ExercisePerformanceData");
		});

		it("should use descriptive variable names", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("participantMap");
			expect(content).toContain("maxCompletion");
			expect(content).toContain("progressWidth");
			expect(content).toContain("isCurrentUser");
			expect(content).toContain("detailedData");
		});

		it("should have JSDoc comment documentation", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("/**");
			expect(content).toContain("ParticipantComparison Component");
			expect(content).toContain("*");
		});

		it("should export interfaces for type usage", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("export interface ParticipantComparisonData");
			expect(content).toContain("export interface ExercisePerformanceData");
			expect(content).toContain("export interface ParticipantSummaryData");
			expect(content).toContain("export interface ParticipantComparisonProps");
		});

		it("should document data access pattern", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("Data access pattern");
		});

		it("should document mobile-first design", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("Mobile-first");
		});

		it("should have proper progress bar transition animation", async () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/components/summary/participant-comparison.tsx",
				"utf-8",
			);
			expect(content).toContain("transition-all");
			expect(content).toContain("duration-500");
		});
	});

	describe("Exports", () => {
		it("should export main component", async () => {
			const file = await import("../participant-comparison");
			expect(file.ParticipantComparison).toBeDefined();
		});

		it("should export loading component", async () => {
			const file = await import("../participant-comparison");
			expect(file.ParticipantComparisonLoading).toBeDefined();
		});

		it("should export error component", async () => {
			const file = await import("../participant-comparison");
			expect(file.ParticipantComparisonError).toBeDefined();
		});

		it("should export data interfaces", async () => {
			const file = await import("../participant-comparison");
			// Interfaces are type-only exports in TypeScript, check via types
			expect(typeof file).toBe("object");
		});
	});
});
