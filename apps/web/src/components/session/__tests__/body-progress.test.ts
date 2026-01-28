import { readFileSync } from "node:fs";

const bodyProgressPath =
	"/Users/klik1301/work/my/buddy-lifts/apps/web/src/components/session/body-progress.tsx";
const readBodyProgressFile = () => readFileSync(bodyProgressPath, "utf-8");

process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??= "test-anon-key";

/**
 * Structural tests for BodyProgress component
 *
 * These tests verify the component structure and exports without requiring
 * a full React Testing Library setup. They ensure the file is syntactically
 * correct and exports the expected component.
 */

describe("BodyProgress Component", () => {
	test("should import without errors", async () => {
		const module = await import("../body-progress");
		expect(module.BodyProgress).toBeDefined();
		expect(typeof module.BodyProgress).toBe("function");
	});

	test("should have correct component name", async () => {
		const module = await import("../body-progress");
		expect(module.BodyProgress.name).toBe("BodyProgress");
	});

	test("component should be a valid React component constructor", async () => {
		const module = await import("../body-progress");
		const component = module.BodyProgress;

		expect(component.prototype).toBeDefined();
		expect(typeof component).toBe("function");
	});

	test("should reference required dependencies", async () => {
		const module = await import("../body-progress");
		const componentString = module.BodyProgress.toString();

		// Verify uses Supabase query hook
		expect(componentString).toContain("useSupabaseQuery");

		// Verify uses required UI components
		expect(componentString).toContain("Card");

		// Verify uses lucide-react icons
		expect(componentString).toContain("Loader2");
	});

	test("should handle all required props", async () => {
		const module = await import("../body-progress");
		const componentString = module.BodyProgress.toString();

		expect(componentString).toContain("sessionId");
		expect(componentString).toContain("userId");
		expect(componentString).toContain("trainingId");
		expect(componentString).toContain("showLabel");
		expect(componentString).toContain("size");
	});

	test("should fetch from exercise table", async () => {
		const module = await import("../body-progress");
		const componentString = module.BodyProgress.toString();

		expect(componentString).toContain("exercise");
	});

	test("should fetch from exercise_progress table", async () => {
		const module = await import("../body-progress");
		const componentString = module.BodyProgress.toString();

		expect(componentString).toContain("exercise_progress");
	});

	test("should calculate progress percentage", async () => {
		const module = await import("../body-progress");
		const componentString = module.BodyProgress.toString();

		expect(componentString).toContain("calculateProgressPercentage");
	});

	test("should have exercise to muscle group mapping", async () => {
		const fileContent = readBodyProgressFile();

		// Verify EXERCISE_MUSCLE_MAP exists with key exercises
		expect(fileContent).toContain("bench");
		expect(fileContent).toContain("squat");
		expect(fileContent).toContain("pull up");
		expect(fileContent).toContain("shoulder press");
		expect(fileContent).toContain("curl");
	});

	test("should have detectMuscleGroups function", async () => {
		const fileContent = readBodyProgressFile();

		expect(fileContent).toContain("detectMuscleGroups");
	});

	test("should render SVG body", async () => {
		const module = await import("../body-progress");
		const componentString = module.BodyProgress.toString();

		// Check for SVG structure
		expect(componentString).toContain("svg");
		expect(componentString).toContain("viewBox");

		// Check for SVG elements
		expect(componentString).toContain("ellipse");
		expect(componentString).toContain("rect");
		expect(componentString).toContain("circle");

		// Check for body parts exist in the SVG
		expect(componentString).toContain("cx");
		expect(componentString).toContain("cy");
	});

	test("should have animation classes", async () => {
		const module = await import("../body-progress");
		const componentString = module.BodyProgress.toString();

		expect(componentString).toContain("transition");
		expect(componentString).toContain("duration");
	});

	test("should have color progress function", async () => {
		const module = await import("../body-progress");
		const componentString = module.BodyProgress.toString();

		expect(componentString).toContain("getProgressColor");
		expect(componentString).toContain("#22c55e"); // green
		expect(componentString).toContain("#eab308"); // yellow
	});

	test("should have scale factor function for muscle growth", async () => {
		const module = await import("../body-progress");
		const componentString = module.BodyProgress.toString();

		expect(componentString).toContain("getScaleFactor");
		expect(componentString).toContain("0.003");
	});

	test("should scale overall body based on total progress", async () => {
		const fileContent = readBodyProgressFile();

		expect(fileContent).toContain("getBodyScale");
		expect(fileContent).toContain("overallProgress");
	});

	test("should have size classes for responsive sizing", async () => {
		const fileContent = readBodyProgressFile();

		expect(fileContent).toContain("getSizeClasses");
		expect(fileContent).toContain("h-32");
		expect(fileContent).toContain("w-24");
		expect(fileContent).toContain("h-48");
		expect(fileContent).toContain("w-32");
		expect(fileContent).toContain("h-64");
		expect(fileContent).toContain("w-48");
	});

	test("should return mobile size classes for small viewports", () => {
		const sizeClassesPromise = import("../body-progress").then((module) =>
			module.getSizeClasses("sm"),
		);

		return sizeClassesPromise.then((sizeClasses) => {
			expect(sizeClasses).toContain("h-full");
			expect(sizeClasses).toContain("w-full");
			expect(sizeClasses).toContain("h-32");
			expect(sizeClasses).toContain("w-24");
		});
	});

	test("should handle loading state", async () => {
		const module = await import("../body-progress");
		const componentString = module.BodyProgress.toString();

		expect(componentString).toContain("Loading");
		expect(componentString).toContain("Loader2");
		expect(componentString).toContain("animate-spin");
	});

	test("should filter completed exercises", async () => {
		const module = await import("../body-progress");
		const componentString = module.BodyProgress.toString();

		expect(componentString).toContain("completedAt");
		expect(componentString).toContain("filter");
	});

	test("should display progress label", async () => {
		const module = await import("../body-progress");
		const componentString = module.BodyProgress.toString();

		expect(componentString).toContain("showLabel");
		expect(componentString).toContain("overallProgress");
		expect(componentString).toContain("length");
	});

	test("should be mobile-first responsive", async () => {
		const module = await import("../body-progress");
		const componentString = module.BodyProgress.toString();

		// Check for responsive size options
		expect(componentString).toContain("h-full");
		expect(componentString).toContain("w-full");
	});

	test("should use client directive", async () => {
		// Read the file content to check for "use client"
		const fileContent = readBodyProgressFile();
		expect(fileContent).toContain('"use client"');
	});

	test("should export component as named export", async () => {
		const module = await import("../body-progress");

		// Should be able to import as named export
		expect(module.BodyProgress).toBeDefined();
		expect(typeof module.BodyProgress).toBe("function");
	});

	test("should have muscle group completion calculation", async () => {
		const module = await import("../body-progress");
		const componentString = module.BodyProgress.toString();

		expect(componentString).toContain("muscleProgress");
		expect(componentString).toContain("chest");
		expect(componentString).toContain("back");
		expect(componentString).toContain("shoulders");
		expect(componentString).toContain("biceps");
		expect(componentString).toContain("triceps");
		expect(componentString).toContain("abs");
		expect(componentString).toContain("quads");
		expect(componentString).toContain("hamstrings");
		expect(componentString).toContain("calves");
	});

	test("should have all muscle groups in type definition", async () => {
		const fileContent = readBodyProgressFile();

		expect(fileContent).toContain("chest");
		expect(fileContent).toContain("back");
		expect(fileContent).toContain("shoulders");
		expect(fileContent).toContain("biceps");
		expect(fileContent).toContain("triceps");
		expect(fileContent).toContain("abs");
		expect(fileContent).toContain("quads");
		expect(fileContent).toContain("hamstrings");
		expect(fileContent).toContain("calves");
	});

	test("should have interface definitions", async () => {
		const fileContent = readBodyProgressFile();

		expect(fileContent).toContain("interface BodyProgressProps");
		expect(fileContent).toContain("interface ExerciseProgress");
		expect(fileContent).toContain("interface Exercise");
	});

	test("should have MuscleGroup type", async () => {
		const fileContent = readBodyProgressFile();

		expect(fileContent).toContain("type MuscleGroup");
	});
});
