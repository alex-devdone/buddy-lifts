import { describe, expect, test } from "bun:test";

/**
 * Tests for Header component
 *
 * Coverage:
 * - Component structure and dependencies
 * - Props interface (component has no props)
 * - TypeScript type safety
 * - Navigation links (Trainings, Feed, Friends)
 * - Icon usage (Dumbbell, Newspaper, Users)
 * - Link href attributes
 * - Mobile-first responsive design
 * - Hover states and transitions
 * - Integration with ModeToggle and UserMenu
 * - Code quality and best practices
 */

// Read the file content once for tests that need source code inspection
async function getHeaderContent() {
	const fs = await import("node:fs");
	return fs.readFileSync(
		"/Users/klik1301/work/my/buddy-lifts/apps/web/src/components/header.tsx",
		"utf-8",
	);
}

describe("Header Component", () => {
	test("should import without errors", async () => {
		const module = await import("../header");
		expect(module.default).toBeDefined();
		expect(typeof module.default).toBe("function");
	});

	test("should have correct component name", async () => {
		const module = await import("../header");
		expect(module.default.name).toBe("Header");
	});

	test("component should be a valid React component", async () => {
		const module = await import("../header");
		const component = module.default;

		expect(component.prototype).toBeDefined();
		expect(typeof component).toBe("function");
	});

	test("should use client directive", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain('"use client"');
	});

	test("should import Link from next/link", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain('import Link from "next/link"');
	});

	test("should import icons from lucide-react", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("lucide-react");
		expect(headerContent).toContain("Dumbbell");
		expect(headerContent).toContain("Newspaper");
		expect(headerContent).toContain("Users");
	});

	test("should import ModeToggle component", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("ModeToggle");
		expect(headerContent).toContain('./mode-toggle"');
	});

	test("should import UserMenu component", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("UserMenu");
		expect(headerContent).toContain('./user-menu"');
	});

	test("should define links array with Trainings route", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("/trainings");
		expect(headerContent).toContain("Trainings");
	});

	test("should define links array with Feed route", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("/feed");
		expect(headerContent).toContain("Feed");
	});

	test("should define links array with Friends route", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("/friends");
		expect(headerContent).toContain("Friends");
	});

	test("should use as const assertion for links array", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("as const");
	});

	test("should have exactly 3 navigation links", async () => {
		const headerContent = await getHeaderContent();
		// Count occurrences of "to:" in the links array
		const toCount = (headerContent.match(/\bto:\s*["']/g) || []).length;
		expect(toCount).toBe(3);
	});

	test("should map over links to render navigation", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain(".map");
		expect(headerContent).toContain("({ to, label, icon: Icon })");
	});

	test("should render Link components with correct structure", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("<Link");
		expect(headerContent).toContain("href={to}");
	});

	test("should use semantic nav element", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("<nav");
	});

	test("should apply mobile-first padding classes", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("px-4");
		expect(headerContent).toContain("py-3");
	});

	test("should apply md breakpoint padding", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("md:px-6");
	});

	test("should apply responsive text sizing", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("text-sm");
		expect(headerContent).toContain("md:text-base");
	});

	test("should apply responsive gap spacing", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("gap-4");
		expect(headerContent).toContain("md:gap-6");
	});

	test("should apply hover transition classes", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("hover:text-primary");
		expect(headerContent).toContain("transition-colors");
	});

	test("should use flex layout", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("flex");
		expect(headerContent).toContain("flex-row");
		expect(headerContent).toContain("items-center");
		expect(headerContent).toContain("justify-between");
	});

	test("should render icons with consistent sizing", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain('className="h-4 w-4"');
	});

	test("should use flex for icon and label layout", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("flex items-center gap-1.5");
	});

	test("should render ModeToggle component", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("<ModeToggle");
	});

	test("should render UserMenu component", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("<UserMenu");
	});

	test("should render controls in flex container", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("flex items-center gap-2");
	});

	test("should have horizontal rule separator", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("<hr />");
	});

	test("should use key prop for mapped links", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("key={to}");
	});

	test("should use Icon component correctly", async () => {
		const headerContent = await getHeaderContent();
		expect(headerContent).toContain("<Icon");
		expect(headerContent).toContain('className="h-4 w-4"');
	});

	test("should export as default", async () => {
		const module = await import("../header");
		expect(module.default).toBeDefined();
	});

	test("should have no props parameter", async () => {
		const module = await import("../header");
		const component = module.default;
		expect(component.length).toBe(0);
	});
});
