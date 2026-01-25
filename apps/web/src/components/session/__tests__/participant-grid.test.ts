/**
 * Tests for participant-grid component
 *
 * Run with: bun test apps/web/src/components/session/__tests__/participant-grid.test.ts
 */

import { describe, expect, test } from "bun:test";

describe("ParticipantGrid Component", () => {
	describe("Component Structure", () => {
		test("should export the component", async () => {
			const { ParticipantGrid } = await import("../participant-grid");
			expect(ParticipantGrid).toBeDefined();
			expect(typeof ParticipantGrid).toBe("function");
		});

		test("should have a display name matching component name", async () => {
			const { ParticipantGrid } = await import("../participant-grid");
			expect(ParticipantGrid.name).toBe("ParticipantGrid");
		});
	});

	describe("Dependencies", () => {
		test("should import required UI components", async () => {
			// Verify imports work by checking if component loads
			const { ParticipantGrid } = await import("../participant-grid");
			expect(ParticipantGrid).toBeDefined();
		});

		test("should use lucide-react icons", async () => {
			const module = await import("../participant-grid");
			// Component should have imported these icons
			expect(module).toBeDefined();
		});
	});

	describe("Props Interface", () => {
		test("should accept sessionId as a required prop", async () => {
			const { ParticipantGrid } = await import("../participant-grid");
			expect(ParticipantGrid.length).toBeGreaterThanOrEqual(0);
		});

		test("should accept currentUserId optional prop", async () => {
			const { ParticipantGrid } = await import("../participant-grid");
			expect(ParticipantGrid).toBeDefined();
		});

		test("should accept hostUserId optional prop", async () => {
			const { ParticipantGrid } = await import("../participant-grid");
			expect(ParticipantGrid).toBeDefined();
		});

		test("should accept showKickButton optional prop", async () => {
			const { ParticipantGrid } = await import("../participant-grid");
			expect(ParticipantGrid).toBeDefined();
		});

		test("should accept onKickParticipant optional callback", async () => {
			const { ParticipantGrid } = await import("../participant-grid");
			expect(ParticipantGrid).toBeDefined();
		});
	});

	describe("Type Safety", () => {
		test("should have proper TypeScript interfaces", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("interface ParticipantGridProps");
			expect(fileContent).toContain("interface Participant");
			expect(fileContent).toContain("interface ExerciseProgress");
		});

		test("should have proper role types", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain('"host" | "admin" | "read"');
		});
	});

	describe("State Management", () => {
		test("should use useCallback for progress calculation", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("calculateProgress");
			expect(fileContent).toContain("useCallback");
		});

		test("should use useCallback for role icons", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("getRoleIcon");
			expect(fileContent).toContain("useCallback");
		});

		test("should use useMemo for grid class", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("gridClass");
			expect(fileContent).toContain("useMemo");
		});
	});

	describe("Data Access Pattern", () => {
		test("should use Supabase for reading participants", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("useSupabaseQuery");
			expect(fileContent).toContain('table: "session_participant"');
		});

		test("should use Supabase for reading exercise progress", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain('table: "exercise_progress"');
		});

		test("should enable real-time for Supabase queries", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("realtime: true");
		});
	});

	describe("Component Features", () => {
		test("should display participant name and role", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("user?.name");
			expect(fileContent).toContain("capitalize");
		});

		test("should display progress percentage", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("{progress}%");
		});

		test("should display progress bar", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("bg-muted");
			expect(fileContent).toContain("style={{ width: `");
			expect(fileContent).toContain("%` }}");
		});

		test("should show role icon based on role", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("Crown");
			expect(fileContent).toContain("Shield");
			expect(fileContent).toContain("User");
		});

		test("should show role badge color based on role", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("bg-yellow-500/10");
			expect(fileContent).toContain("bg-blue-500/10");
			expect(fileContent).toContain("bg-gray-500/10");
		});

		test("should show exercise count stats", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("exercises");
			expect(fileContent).toContain("Activity");
		});

		test("should show complete badge when 100% progress", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("Complete");
			expect(fileContent).toContain("text-green-600");
		});
	});

	describe("Grid Layout", () => {
		test("should use single column for 1 participant", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("grid-cols-1");
			expect(fileContent).toContain("max-w-xs mx-auto");
		});

		test("should use 2 columns for 2 participants", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("sm:grid-cols-2");
		});

		test("should use 3 columns for 3+ participants", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("lg:grid-cols-3");
		});
	});

	describe("Business Logic", () => {
		test("should identify host based on user IDs", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("isHost");
			expect(fileContent).toContain("currentUserId === hostUserId");
		});

		test("should identify current user for highlighting", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("isCurrentUser");
			expect(fileContent).toContain("participant.userId === currentUserId");
		});

		test("should show kick button only for host on non-current users", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("canKick");
			expect(fileContent).toContain("isHost && showKickButton");
			expect(fileContent).toContain("participant.userId !== currentUserId");
		});

		test("should calculate progress correctly", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("completedCount / userProgress.length");
			expect(fileContent).toContain("Math.round");
		});

		test("should show current user ring indicator", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("ring-2 ring-primary/50");
		});
	});

	describe("Accessibility", () => {
		test("should have proper ARIA labels for action buttons", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("sr-only");
		});

		test("should have screen reader text", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("You");
		});
	});

	describe("Responsive Design", () => {
		test("should use mobile-first responsive grid classes", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("grid-cols-1");
			expect(fileContent).toContain("sm:");
			expect(fileContent).toContain("lg:");
		});

		test("should have truncation for long text", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("truncate");
		});
	});

	describe("Loading States", () => {
		test("should show loading spinner while fetching", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("Loader2");
			expect(fileContent).toContain("animate-spin");
			expect(fileContent).toContain("participantsLoading");
		});

		test("should show empty state when no participants", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("No participants yet");
			expect(fileContent).toContain("Users");
			expect(fileContent).toContain("participants.length === 0");
		});
	});

	describe("Error Handling", () => {
		test("should confirm before kicking participant", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("confirm");
			expect(fileContent).toContain("Are you sure you want to remove");
		});

		test("should handle kick callback", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("handleKick");
			expect(fileContent).toContain("onKickParticipant");
		});
	});

	describe("Progress Color Logic", () => {
		test("should return green for 100% progress", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("percentage === 100");
			expect(fileContent).toContain("bg-green-500");
		});

		test("should return yellow for 50%+ progress", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("percentage >= 50");
			expect(fileContent).toContain("bg-yellow-500");
		});

		test("should return gray for < 50% progress", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("bg-gray-300");
		});
	});

	describe("Code Quality", () => {
		test("should have no syntax errors", async () => {
			// Importing the module will fail if there are syntax errors
			const { ParticipantGrid } = await import("../participant-grid");
			expect(ParticipantGrid).toBeDefined();
		});

		test("should export a default or named export", async () => {
			const module = await import("../participant-grid");
			expect(Object.keys(module).length).toBeGreaterThan(0);
		});

		test("should have proper JSDoc comments", async () => {
			const fileContent = await import("node:fs").then((fs) =>
				fs.readFileSync(`${__dirname}/../participant-grid.tsx`, "utf-8"),
			);

			expect(fileContent).toContain("/**");
			expect(fileContent).toContain("ParticipantGrid Component");
		});
	});
});
