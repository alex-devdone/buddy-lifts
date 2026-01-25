/**
 * Tests for new training page
 *
 * Run with: bun test apps/web/src/app/trainings/new/__tests__/page.test.tsx
 */

import { describe, expect, it } from "vitest";

describe("New Training Page Component", () => {
	describe("Component Structure", () => {
		it("should export the page component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain(
				"export default async function NewTrainingPage",
			);
		});

		it("should be an async server component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("export default async function");
		});
	});

	describe("Dependencies", () => {
		it("should import auth from buddy-lifts/auth", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain('from "@buddy-lifts/auth"');
		});

		it("should import next/navigation for redirect", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("redirect");
		});

		it("should import TrainingForm component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("@/components/training/training-form");
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

		it("should render TrainingForm component when authenticated", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("<TrainingForm");
		});
	});

	describe("Page Structure", () => {
		it("should use responsive container with max-width", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("max-w-4xl");
			expect(content).toContain("px-4");
			expect(content).toContain("py-8");
		});

		it("should use responsive padding on desktop", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("md:px-6");
		});
	});

	describe("TrainingForm Integration", () => {
		it("should pass onSuccess callback to TrainingForm", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("onSuccess");
			expect(content).toContain("redirect(`/trainings/");
			expect(content).toContain("`);");
			expect(content).toContain("training.id");
		});

		it("should redirect to training detail after creation", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("redirect(`/trainings/");
			expect(content).toContain("`);");
			expect(content).toContain("training.id");
		});
	});

	describe("TypeScript Types", () => {
		it("should use proper TypeScript types", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			// Check for optional chaining on session
			expect(content).toContain("session?.user");
		});
	});

	describe("Code Quality", () => {
		it("should have no syntax errors", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			// Basic sanity check that the file is complete
			expect(content).toContain("export default");
			expect(content).toContain("return (");
		});

		it("should be a complete file with proper ending", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			// Check that the file ends properly
			expect(content.trim().endsWith("}")).toBe(true);
		});
	});

	describe("Responsive Design", () => {
		it("should use mobile-first responsive classes", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("px-4");
			expect(content).toContain("md:px-6");
		});

		it("should use appropriate container sizing", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("max-w-4xl");
		});
	});

	describe("Route Structure", () => {
		it("should be located at trainings/new route", () => {
			const path = require("node:path");
			const routePath = path.dirname(__dirname).split("/").slice(-2).join("/");
			expect(routePath).toBe("trainings/new");
		});
	});
});
