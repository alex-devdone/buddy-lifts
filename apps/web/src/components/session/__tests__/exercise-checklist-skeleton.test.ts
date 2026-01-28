/**
 * Tests for exercise-checklist-skeleton component
 *
 * Run with: bun test apps/web/src/components/session/__tests__/exercise-checklist-skeleton.test.ts
 */

describe("ExerciseChecklistSkeleton Component", () => {
	describe("Component Structure", () => {
		it("should export the component", () => {
			const {
				ExerciseChecklistSkeleton,
			} = require("../exercise-checklist-skeleton");
			expect(ExerciseChecklistSkeleton).toBeDefined();
			expect(typeof ExerciseChecklistSkeleton).toBe("function");
		});

		it("should have a display name matching component name", () => {
			const {
				ExerciseChecklistSkeleton,
			} = require("../exercise-checklist-skeleton");
			expect(ExerciseChecklistSkeleton.name).toBe("ExerciseChecklistSkeleton");
		});

		it("should not require client directive (no hooks/browser APIs)", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-checklist-skeleton.tsx`,
				"utf-8",
			);
			// Skeleton components don't use hooks, so they don't need "use client"
			expect(content).not.toContain('"use client"');
		});
	});

	describe("Dependencies", () => {
		it("should import Skeleton from ui/skeleton", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-checklist-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/components/ui/skeleton");
		});

		it("should import Card components from ui/card", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-checklist-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/components/ui/card");
		});
	});

	describe("Props Interface", () => {
		it("should accept count prop with default value", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-checklist-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("count?: number");
			expect(content).toContain("count = 3");
		});

		it("should use Array.from to render multiple items", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-checklist-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("Array.from({ length: count })");
		});
	});

	describe("Component Structure", () => {
		it("should render Card wrapper", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-checklist-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("<Card>");
			expect(content).toContain("</Card>");
		});

		it("should render CardContent section", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-checklist-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("CardContent");
		});

		it("should render checkbox skeleton for each item", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-checklist-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("h-4 w-4"); // checkbox size
		});

		it("should render exercise name skeleton", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-checklist-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("h-4 w-3/4"); // exercise name
		});

		it("should render sets/reps info skeleton", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-checklist-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("h-3 w-1/2"); // sets/reps info
		});

		it("should render items with border styling", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-checklist-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("border");
		});
	});

	describe("Layout", () => {
		it("should use space-y-3 for vertical spacing", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-checklist-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("space-y-3");
		});

		it("should use flex layout with gap for items", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-checklist-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("flex items-start gap-3");
		});
	});

	describe("Styling", () => {
		it("should use Skeleton component for loading animation", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-checklist-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("<Skeleton");
		});

		it("should use rounded-md for item corners", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-checklist-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("rounded-md");
		});
	});

	describe("Code Quality", () => {
		it("should have proper JSDoc comment", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-checklist-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("/**");
			expect(content).toContain(
				"Loading skeleton for ExerciseChecklist component",
			);
		});

		it("should export component as named export", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../exercise-checklist-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("export function ExerciseChecklistSkeleton");
		});
	});
});
