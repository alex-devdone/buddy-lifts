/**
 * Tests for training-form component
 *
 * Run with: bun test apps/web/src/components/training/__tests__/training-form.test.tsx
 */

describe("TrainingForm Component", () => {
	describe("Component Structure", () => {
		it("should export the component", () => {
			const { TrainingForm } = require("../training-form");
			expect(TrainingForm).toBeDefined();
			expect(typeof TrainingForm).toBe("function");
		});

		it("should have a display name matching component name", () => {
			const { TrainingForm } = require("../training-form");
			expect(TrainingForm.name).toBe("TrainingForm");
		});
	});

	describe("AI Training Creation", () => {
		it("should include an optional natural language workout input", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-form.tsx`,
				"utf-8",
			);
			expect(content).toContain("Workout (Natural Language, Optional)");
			expect(content).toContain("exerciseInput");
		});

		it("should use the createWithExercises mutation when workout input exists", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-form.tsx`,
				"utf-8",
			);
			expect(content).toContain("createWithExercises");
			expect(content).toContain("exerciseInput.trim()");
		});
	});
});
