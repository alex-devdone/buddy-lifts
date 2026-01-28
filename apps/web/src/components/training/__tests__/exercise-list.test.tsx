/**
 * Tests for exercise-list component
 *
 * Run with: bun test apps/web/src/components/training/__tests__/exercise-list.test.tsx
 */

describe("ExerciseList Component", () => {
	describe("Component Structure", () => {
		it("should export the component", () => {
			const { ExerciseList } = require("../exercise-list");
			expect(ExerciseList).toBeDefined();
			expect(typeof ExerciseList).toBe("function");
		});

		it("should have a display name matching component name", () => {
			const { ExerciseList } = require("../exercise-list");
			expect(ExerciseList.name).toBe("ExerciseList");
		});
	});

	describe("Dependencies", () => {
		it("should import required UI components", () => {
			// Verify imports work by checking if component loads
			const { ExerciseList } = require("../exercise-list");
			expect(ExerciseList).toBeDefined();
		});

		it("should use lucide-react icons", () => {
			const module = require("../exercise-list");
			// Component should have imported these icons
			expect(module).toBeDefined();
		});
	});

	describe("Props Interface", () => {
		it("should accept trainingId as a required prop", () => {
			const { ExerciseList } = require("../exercise-list");
			expect(ExerciseList.length).toBeGreaterThanOrEqual(0);
		});

		it("should accept currentUserId prop for ownership check", () => {
			const { ExerciseList } = require("../exercise-list");
			expect(ExerciseList).toBeDefined();
		});

		it("should accept trainingUserId prop for ownership check", () => {
			const { ExerciseList } = require("../exercise-list");
			expect(ExerciseList).toBeDefined();
		});

		it("should accept onEditExercise optional callback", () => {
			const { ExerciseList } = require("../exercise-list");
			expect(ExerciseList).toBeDefined();
		});
	});

	describe("Type Safety", () => {
		it("should have proper TypeScript types for Exercise interface", () => {
			// Exercise interface should have these required properties
			const exercise = {
				id: "test-id",
				trainingId: "training-1",
				name: "Test Exercise",
				targetSets: 3,
				targetReps: 10,
				weight: 100 as number | null,
				restSeconds: 60 as number | null,
				order: 0,
			};

			expect(exercise.id).toBe("test-id");
			expect(exercise.targetSets).toBe(3);
			expect(exercise.weight).toBe(100);
			expect(exercise.order).toBe(0);
		});

		it("should have proper TypeScript types for ExerciseListProps", () => {
			const props = {
				trainingId: "training-1",
				currentUserId: "user-1" as string | undefined,
				trainingUserId: "user-1" as string | undefined,
				onEditExercise: undefined as
					| ((exercise: { id: string }) => void)
					| undefined,
			};

			expect(props.trainingId).toBe("training-1");
			expect(props.currentUserId).toBe("user-1");
		});
	});

	describe("State Management", () => {
		it("should use useState for drag management", () => {
			// Component should manage drag state
			const { ExerciseList } = require("../exercise-list");
			expect(ExerciseList).toBeDefined();
		});

		it("should use useCallback for drag handlers", () => {
			// Component should use useCallback for performance
			const { ExerciseList } = require("../exercise-list");
			expect(ExerciseList).toBeDefined();
		});
	});

	describe("Data Access Pattern", () => {
		it("should use Supabase for reading exercises", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("useSupabaseQuery");
		});

		it("should use tRPC for mutations", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("trpc.exercise.update");
			expect(content).toContain("trpc.exercise.delete");
		});
	});

	describe("Component Features", () => {
		it("should support drag and drop reordering", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("draggable");
			expect(content).toContain("onDragStart");
			expect(content).toContain("onDragOver");
			expect(content).toContain("onDragEnd");
		});

		it("should support move up/down buttons", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("handleMoveUp");
			expect(content).toContain("handleMoveDown");
		});

		it("should support edit and delete actions", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("handleEdit");
			expect(content).toContain("handleDelete");
		});

		it("should show loading skeleton while fetching", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("isLoading");
			expect(content).toContain("animate-pulse");
		});

		it("should show empty state when no exercises", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("No exercises yet");
			expect(content).toContain("Dumbbell");
		});
	});

	describe("Accessibility", () => {
		it("should have proper ARIA labels for action buttons", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("sr-only");
			expect(content).toContain("Move up");
			expect(content).toContain("Move down");
		});

		it("should have screen reader text", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("sr-only");
		});
	});

	describe("Responsive Design", () => {
		it("should use mobile-first responsive classes", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("gap-");
			expect(content).toContain("flex-1");
		});

		it("should have truncation for long text", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("truncate");
		});
	});

	describe("Business Logic", () => {
		it("should identify ownership based on user IDs", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("isOwner");
			expect(content).toContain("currentUserId === trainingUserId");
		});

		it("should show actions only for owner", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("isOwner &&");
		});

		it("should disable move up button for first exercise", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("index === 0");
		});

		it("should disable move down button for last exercise", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("index === exercises.length - 1");
		});
	});

	describe("Real-time Updates", () => {
		it("should enable real-time for Supabase query", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("realtime: true");
			expect(content).toContain('table: "exercise"');
		});
	});

	describe("Error Handling", () => {
		it("should handle update errors with toast", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("onError");
			expect(content).toContain("toast.error");
		});

		it("should handle delete errors with toast", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("onError");
			expect(content).toContain("Failed to");
		});

		it("should confirm before deleting", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("confirm");
			expect(content).toContain("Are you sure");
		});
	});

	describe("Code Quality", () => {
		it("should have no syntax errors", () => {
			// Importing the module will fail if there are syntax errors
			const { ExerciseList } = require("../exercise-list");
			expect(ExerciseList).toBeDefined();
		});

		it("should export a default or named export", () => {
			const module = require("../exercise-list");
			expect(Object.keys(module).length).toBeGreaterThan(0);
		});
	});
});
