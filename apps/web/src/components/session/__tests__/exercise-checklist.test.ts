import { readFileSync } from "node:fs";

const exerciseChecklistPath =
	"/Users/klik1301/work/my/buddy-lifts/apps/web/src/components/session/exercise-checklist.tsx";
const readExerciseChecklistFile = () =>
	readFileSync(exerciseChecklistPath, "utf-8");

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
	process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
}

/**
 * Structural tests for ExerciseChecklist component
 *
 * These tests verify the component structure and exports without requiring
 * a full React Testing Library setup. They ensure the file is syntactically
 * correct and exports the expected component.
 */

describe("ExerciseChecklist Component", () => {
	test("should import without errors", async () => {
		const module = await import("../exercise-checklist");
		expect(module.ExerciseChecklist).toBeDefined();
		expect(typeof module.ExerciseChecklist).toBe("function");
	});

	test("should have correct component name", async () => {
		const module = await import("../exercise-checklist");
		expect(module.ExerciseChecklist.name).toBe("ExerciseChecklist");
	});

	test("component should be a valid React component constructor", async () => {
		const module = await import("../exercise-checklist");
		const component = module.ExerciseChecklist;

		expect(component.prototype).toBeDefined();
		expect(typeof component).toBe("function");
	});

	test("should use client directive", async () => {
		const fileContent = readExerciseChecklistFile();
		expect(fileContent).toContain('"use client"');
	});

	test("should have correct interface definitions", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("interface ExerciseChecklistProps");
		expect(fileContent).toContain("interface Exercise");
		expect(fileContent).toContain("interface ExerciseProgress");
		expect(fileContent).toContain("interface ExerciseWithProgress");
	});

	test("should have required props in interface", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("sessionId:");
		expect(fileContent).toContain("userId:");
		expect(fileContent).toContain("trainingId:");
		expect(fileContent).toContain("showBodyOverlay");
		expect(fileContent).toContain("className");
	});

	test("should reference required dependencies", async () => {
		const fileContent = readExerciseChecklistFile();

		// Verify uses Supabase query hook
		expect(fileContent).toContain("useSupabaseQuery");

		// Verify uses tRPC for mutations
		expect(fileContent).toContain("trpc");

		// Verify uses required UI components
		expect(fileContent).toContain("Checkbox");
		expect(fileContent).toContain("Card");
		expect(fileContent).toContain("CardContent");
		expect(fileContent).toContain("CardHeader");
		expect(fileContent).toContain("CardTitle");

		// Verify uses lucide-react icons
		expect(fileContent).toContain("CheckCircle2");
		expect(fileContent).toContain("Circle");
		expect(fileContent).toContain("Dumbbell");
		expect(fileContent).toContain("ExerciseChecklistSkeleton");

		// Verify uses toast for notifications
		expect(fileContent).toContain("toast");
	});

	test("should fetch from exercise table", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("exercise");
		expect(fileContent).toContain('eq("trainingId"');
		expect(fileContent).toContain("order");
	});

	test("should fetch from exercise_progress table", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("exercise_progress");
		expect(fileContent).toContain('eq("sessionId"');
		expect(fileContent).toContain('eq("userId"');
	});

	test("should use real-time subscriptions", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("realtime: true");
		expect(fileContent).toContain('table: "exercise"');
		expect(fileContent).toContain('table: "exercise_progress"');
	});

	test("should have progress map for quick lookup", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("progressMap");
		expect(fileContent).toContain("new Map");
		expect(fileContent).toContain("useMemo");
	});

	test("should combine exercises with progress status", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("exercisesWithProgress");
		expect(fileContent).toContain("isCompleted");
		expect(fileContent).toContain("completedAt");
	});

	test("should have tRPC mutations for progress management", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("recordProgress");
		expect(fileContent).toContain("deleteProgress");
		expect(fileContent).toContain("progress.record");
		expect(fileContent).toContain("progress.delete");
	});

	test("should handle checkbox changes", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("handleCheckboxChange");
		expect(fileContent).toContain("useCallback");
	});

	test("should mark exercise as complete with target reps", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("Array(exercise.targetSets)");
		expect(fileContent).toContain("exercise.targetReps");
		expect(fileContent).toContain("completedReps");
	});

	test("should calculate completion stats", async () => {
		const module = await import("../exercise-checklist");
		const componentString = module.ExerciseChecklist.toString();

		expect(componentString).toContain("completedCount");
		expect(componentString).toContain("totalCount");
		expect(componentString).toContain("completionPercentage");
	});

	test("should have loading state", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("exercisesLoading");
		expect(fileContent).toContain("progressLoading");
		expect(fileContent).toContain("ExerciseChecklistSkeleton");
	});

	test("should have empty state when no exercises", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("exercises.length === 0");
		expect(fileContent).toContain("No exercises yet");
	});

	test("should display exercise details correctly", async () => {
		const fileContent = readExerciseChecklistFile();

		// Check for exercise name display
		expect(fileContent).toContain("exercise.name");

		// Check for sets and reps display
		expect(fileContent).toContain("targetSets");
		expect(fileContent).toContain("targetReps");
		expect(fileContent).toContain("×");

		// Check for weight display
		expect(fileContent).toContain("weight");
		expect(fileContent).toContain("lbs");

		// Check for rest time display
		expect(fileContent).toContain("restSeconds");
		expect(fileContent).toContain("s rest");
	});

	test("should have completion icon indicators", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("CheckCircle2");
		expect(fileContent).toContain("Circle");
		expect(fileContent).toContain("text-green-500");
		expect(fileContent).toContain("text-muted-foreground/30");
	});

	test("should have styling for completed exercises", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("border-green-500/30");
		expect(fileContent).toContain("bg-green-500/5");
		expect(fileContent).toContain("text-green-600");
	});

	test("should have styling for incomplete exercises", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("border-border");
		expect(fileContent).toContain("bg-card");
	});

	test("should support overlay mode for body visualization", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("showBodyOverlay");
		expect(fileContent).toContain("backdrop-blur-sm");
		expect(fileContent).toContain("bg-background/95");
	});

	test("should have proper ARIA labels for accessibility", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("aria-label");
		expect(fileContent).toMatch(/Mark \$\{exercise\.name\} as/);
	});

	test("should disable checkbox during mutations", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("disabled");
		expect(fileContent).toContain("recordProgress.isPending");
		expect(fileContent).toContain("deleteProgress.isPending");
	});

	test("should show toast notifications", async () => {
		const fileContent = readExerciseChecklistFile();

		// Toast is still used for error notifications in optimistic update callbacks
		expect(fileContent).toContain("toast.error");
		expect(fileContent).toContain("toast.success");
		// Check for optimistic update state management
		expect(fileContent).toContain("setOptimisticUpdates");
		expect(fileContent).toContain("optimisticUpdates");
	});

	test("should display completion stats in header", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("Exercises");
		expect(fileContent).toContain("Dumbbell");
		expect(fileContent).toContain("CardTitle");
	});

	test("should have green text for 100% completion", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("completionPercentage === 100");
		expect(fileContent).toContain("text-green-500");
	});

	test("should use cn utility for className merging", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("cn(");
	});

	test("should be mobile-first responsive", async () => {
		const fileContent = readExerciseChecklistFile();

		// Check for responsive gap classes
		expect(fileContent).toContain("gap-3");
		expect(fileContent).toContain("gap-2");
		expect(fileContent).toContain("gap-0.5");

		// Check for text size classes
		expect(fileContent).toContain("text-sm");
		expect(fileContent).toContain("text-xs");
	});

	test("should handle error states with toast", async () => {
		const module = await import("../exercise-checklist");
		const componentString = module.ExerciseChecklist.toString();

		expect(componentString).toContain("onError");
		expect(componentString).toContain("error.message");
	});

	test("should have ExerciseWithProgress interface extending Exercise", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("interface ExerciseWithProgress");
		expect(fileContent).toContain("progress?: ExerciseProgress");
		expect(fileContent).toContain("isCompleted: boolean");
	});

	test("should export component as named export", async () => {
		const module = await import("../exercise-checklist");

		// Should be able to import as named export
		expect(module.ExerciseChecklist).toBeDefined();
		expect(typeof module.ExerciseChecklist).toBe("function");
	});

	test("should have proper TypeScript types", async () => {
		const fileContent = readExerciseChecklistFile();

		// Check for proper type annotations
		expect(fileContent).toContain(": string");
		expect(fileContent).toContain(": number");
		expect(fileContent).toContain(": boolean");
		expect(fileContent).toContain("| null");
	});

	test("should use flexbox for layout", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("flex flex-col");
		expect(fileContent).toContain("flex items-center");
		expect(fileContent).toContain("flex-1");
	});

	test("should have proper component JSDoc comment", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("/**");
		expect(fileContent).toContain("ExerciseChecklist Component");
		expect(fileContent).toContain("Displays a checklist of exercises");
	});

	test("should handle group hover and transition effects", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("group");
		expect(fileContent).toContain("transition-colors");
	});

	test("should filter exercises by trainingId", async () => {
		const fileContent = readExerciseChecklistFile();

		expect(fileContent).toContain("trainingId");
		expect(fileContent).toContain(".eq(");
	});

	test("should implement optimistic updates for progress recording", async () => {
		const fileContent = readExerciseChecklistFile();

		// Should have optimistic state management
		expect(fileContent).toContain("useState");
		expect(fileContent).toContain("optimisticUpdates");
		expect(fileContent).toContain("setOptimisticUpdates");

		// Should include optimistic flag in interface
		expect(fileContent).toContain("isOptimistic?: boolean");

		// Should update optimistic state immediately on checkbox change
		expect(fileContent).toContain("handleCheckboxChange");
		expect(fileContent).toContain("Immediately update UI optimistically");

		// Should have error handling with rollback
		expect(fileContent).toContain("onError");
		expect(fileContent).toContain("Rollback optimistic update");

		// Should clear optimistic state on success
		expect(fileContent).toContain("onSuccess");
		expect(fileContent).toContain("Clear optimistic state");

		// Should use optimistic state in rendering
		expect(fileContent).toContain("optimisticState");
		expect(fileContent).toContain("isOptimistic");
	});

	test("should show visual feedback for optimistic updates", async () => {
		const fileContent = readExerciseChecklistFile();

		// Should have animate-pulse class for optimistic updates
		expect(fileContent).toContain("animate-pulse");
		expect(fileContent).toContain("exercise.isOptimistic");
	});
});
