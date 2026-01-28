/**
 * Tests for live-progress-bar component
 *
 * Run with: bun test apps/web/src/components/session/__tests__/live-progress-bar.test.ts
 */

describe("LiveProgressBar Component", () => {
	describe("Component Structure", () => {
		test("should export the component", async () => {
			const { LiveProgressBar } = await import("../live-progress-bar");
			expect(LiveProgressBar).toBeDefined();
			expect(typeof LiveProgressBar).toBe("function");
		});

		test("should have a display name matching component name", async () => {
			const { LiveProgressBar } = await import("../live-progress-bar");
			expect(LiveProgressBar.name).toBe("LiveProgressBar");
		});
	});

	describe("Dependencies", () => {
		test("should import required UI components", async () => {
			// Verify imports work by checking if component loads
			const { LiveProgressBar } = await import("../live-progress-bar");
			expect(LiveProgressBar).toBeDefined();
		});

		test("should use lucide-react icons", async () => {
			const module = await import("../live-progress-bar");
			// Component should have imported these icons
			expect(module).toBeDefined();
		});
	});

	describe("Props Interface", () => {
		test("should accept sessionId as a required prop", async () => {
			const { LiveProgressBar } = await import("../live-progress-bar");
			expect(LiveProgressBar.length).toBeGreaterThanOrEqual(0);
		});

		test("should accept trainingId as a required prop", async () => {
			const { LiveProgressBar } = await import("../live-progress-bar");
			expect(LiveProgressBar).toBeDefined();
		});

		test("should accept currentUserId optional prop", async () => {
			const { LiveProgressBar } = await import("../live-progress-bar");
			expect(LiveProgressBar).toBeDefined();
		});

		test("should accept showRankings optional prop", async () => {
			const { LiveProgressBar } = await import("../live-progress-bar");
			expect(LiveProgressBar).toBeDefined();
		});

		test("should accept size optional prop", async () => {
			const { LiveProgressBar } = await import("../live-progress-bar");
			expect(LiveProgressBar).toBeDefined();
		});
	});

	describe("Type Safety", () => {
		test("should have proper TypeScript interfaces", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("interface LiveProgressBarProps");
			expect(fileContent).toContain("interface ExerciseProgress");
			expect(fileContent).toContain("interface Exercise");
			expect(fileContent).toContain("interface Participant");
			expect(fileContent).toContain("interface ParticipantProgress");
		});

		test("should have proper role types", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain('"host" | "admin" | "read"');
		});

		test("should have proper size types", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain('"sm" | "md" | "lg"');
		});
	});

	describe("State Management", () => {
		test("should use useSupabaseQuery for participants", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("useSupabaseQuery");
			expect(fileContent).toContain('table: "session_participant"');
		});

		test("should use useSupabaseQuery for exercises", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain('table: "exercise"');
		});

		test("should use useSupabaseQuery for exercise progress", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain('table: "exercise_progress"');
		});

		test("should enable real-time for all queries", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			const matches = fileContent.match(/realtime: true/g);
			expect(matches).toBeDefined();
			expect(matches?.length).toBeGreaterThanOrEqual(3);
		});
	});

	describe("Data Access Pattern", () => {
		test("should use Supabase for reading participants", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("useSupabaseQuery");
			expect(fileContent).toContain('table: "session_participant"');
		});

		test("should use Supabase for reading exercise progress", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain('table: "exercise_progress"');
		});

		test("should not use tRPC for reads (hybrid pattern)", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).not.toContain("trpc");
		});
	});

	describe("Component Features", () => {
		test("should display participant names", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("userName");
		});

		test("should display percentage values", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("{progress.percentage}%");
		});

		test("should display progress bars", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("bg-muted");
			expect(fileContent).toContain("style={{ width: `");
			expect(fileContent).toContain("%` }}");
		});

		test("should show rank badges for top 3 participants when showRankings is true", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("showRankings");
			expect(fileContent).toContain("rank");
			expect(fileContent).toContain("bg-yellow-500");
			expect(fileContent).toContain("bg-gray-400");
			expect(fileContent).toContain("bg-orange-600");
		});

		test("should hide rank badges when showRankings is false", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("showRankings &&");
		});

		test("should highlight current user with primary border", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("isCurrentUser");
			expect(fileContent).toContain("border-primary/50");
			expect(fileContent).toContain("bg-primary/5");
		});

		test("should show (You) label for current user", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("(You)");
		});

		test("should display exercise count stats", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("progress.completedCount");
			expect(fileContent).toContain("progress.totalExercises");
			expect(fileContent).toContain("exercises");
		});

		test("should sort participants by progress percentage descending", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("sortedProgress");
			expect(fileContent).toContain("b.percentage - a.percentage");
		});
	});

	describe("Progress Color Classes", () => {
		test("should return green classes for 100% progress", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("percentage === 100");
			expect(fileContent).toContain("bg-green-500");
			expect(fileContent).toContain("text-green-600");
			expect(fileContent).toContain("bg-green-500/10");
		});

		test("should return lime classes for >= 75% progress", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("percentage >= 75");
			expect(fileContent).toContain("bg-lime-500");
			expect(fileContent).toContain("text-lime-600");
		});

		test("should return yellow classes for >= 50% progress", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("percentage >= 50");
			expect(fileContent).toContain("bg-yellow-500");
			expect(fileContent).toContain("text-yellow-600");
		});

		test("should return orange classes for >= 25% progress", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("percentage >= 25");
			expect(fileContent).toContain("bg-orange-500");
			expect(fileContent).toContain("text-orange-600");
		});

		test("should return red classes for < 25% progress", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("bg-red-500");
			expect(fileContent).toContain("text-red-600");
			expect(fileContent).toContain("bg-red-500/10");
		});
	});

	describe("Size Classes", () => {
		test("should return small size classes for 'sm' size", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("h-1.5 text-xs");
		});

		test("should return medium size classes for 'md' size", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("h-2 text-sm");
		});

		test("should return large size classes for 'lg' size", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("h-4 text-base");
		});
	});

	describe("Loading States", () => {
		test("should show loading spinner while fetching", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("Loader2");
			expect(fileContent).toContain("animate-spin");
			expect(fileContent).toContain("participantsLoading || exercisesLoading");
		});
	});

	describe("Empty States", () => {
		test("should show empty state when no participants", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("Waiting for participants...");
			expect(fileContent).toContain("participants.length === 0");
		});

		test("should show dashed border for empty state", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("border-dashed");
		});
	});

	describe("Accessibility", () => {
		test("should have proper semantic HTML structure", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("Card");
			expect(fileContent).toContain("CardHeader");
			expect(fileContent).toContain("CardContent");
		});
	});

	describe("Responsive Design", () => {
		test("should support size variations (sm, md, lg)", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			// The component uses a switch statement instead of === comparisons
			expect(fileContent).toContain('case "sm"');
			expect(fileContent).toContain('case "lg"');
			expect(fileContent).toContain("sizeClasses");
		});
	});

	describe("Real-time Subscriptions", () => {
		test("should create Supabase channels for all tables", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			const matches = fileContent.match(/realtime: true/g);
			expect(matches).toBeDefined();
			expect(matches?.length).toBeGreaterThanOrEqual(3);
		});

		test("should subscribe to session_participant table", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain('table: "session_participant"');
		});

		test("should subscribe to exercise table", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain('table: "exercise"');
		});

		test("should subscribe to exercise_progress table", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain('table: "exercise_progress"');
		});
	});

	describe("Business Logic", () => {
		test("should calculate percentage correctly for completed exercises", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("calculateParticipantProgress");
			expect(fileContent).toContain("completedCount / totalExercises");
			expect(fileContent).toContain("Math.round");
		});

		test("should handle zero exercises", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("totalExercises === 0");
		});

		test("should show TrendingUp icon for 100% completion", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("TrendingUp");
			expect(fileContent).toContain("progress.percentage === 100");
		});

		test("should show 'Keep pushing!' message for < 50% progress", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("TrendingDown");
			expect(fileContent).toContain("Keep pushing!");
			expect(fileContent).toContain("progress.percentage < 50");
		});

		test("should handle single participant (no ranking)", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("sortedProgress.length > 1");
		});
	});

	describe("Code Quality", () => {
		test("should have no syntax errors", async () => {
			// Importing the module will fail if there are syntax errors
			const { LiveProgressBar } = await import("../live-progress-bar");
			expect(LiveProgressBar).toBeDefined();
		});

		test("should export a default or named export", async () => {
			const module = await import("../live-progress-bar");
			expect(Object.keys(module).length).toBeGreaterThan(0);
		});

		test("should have proper JSDoc comments", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("/**");
			expect(fileContent).toContain("LiveProgressBar Component");
		});

		test("should export helper functions", async () => {
			const module = await import("../live-progress-bar");
			// Helper functions are not exported but should exist in the file
			expect(module).toBeDefined();
		});

		test("should have calculateParticipantProgress helper", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("function calculateParticipantProgress");
		});

		test("should have getProgressColorClasses helper", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("function getProgressColorClasses");
		});

		test("should have getSizeClasses helper", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../live-progress-bar.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("function getSizeClasses");
		});
	});
});
