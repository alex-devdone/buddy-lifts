/**
 * Tests for feed-item-skeleton component
 *
 * Run with: bun test apps/web/src/components/feed/__tests__/feed-item-skeleton.test.ts
 */

describe("FeedItemSkeleton Component", () => {
	describe("Component Structure", () => {
		it("should export the component", () => {
			const { FeedItemSkeleton } = require("../feed-item-skeleton");
			expect(FeedItemSkeleton).toBeDefined();
			expect(typeof FeedItemSkeleton).toBe("function");
		});

		it("should have a display name matching component name", () => {
			const { FeedItemSkeleton } = require("../feed-item-skeleton");
			expect(FeedItemSkeleton.name).toBe("FeedItemSkeleton");
		});

		it("should not require client directive (no hooks/browser APIs)", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../feed-item-skeleton.tsx`,
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
				`${__dirname}/../feed-item-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/components/ui/skeleton");
		});

		it("should import Card components from ui/card", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../feed-item-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/components/ui/card");
		});
	});

	describe("Props Interface", () => {
		it("should not accept any props", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../feed-item-skeleton.tsx`,
				"utf-8",
			);
			// FeedItemSkeleton has no props
			expect(content).toMatch(/export function FeedItemSkeleton\(\)/);
		});
	});

	describe("Component Structure", () => {
		it("should render Card wrapper", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../feed-item-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("<Card>");
			expect(content).toContain("</Card>");
		});

		it("should render CardHeader section", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../feed-item-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("<CardHeader>");
			expect(content).toContain("</CardHeader>");
		});

		it("should render CardContent section", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../feed-item-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("<CardContent>");
			expect(content).toContain("</CardContent>");
		});

		it("should render avatar skeleton with rounded-full class", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../feed-item-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("rounded-full");
			expect(content).toContain("h-8 w-8");
		});

		it("should render title and user name skeletons", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../feed-item-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("h-4 w-3/4"); // title skeleton
			expect(content).toContain("h-3 w-1/2"); // user name skeleton
		});

		it("should render description skeleton lines", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../feed-item-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("h-4 w-full");
			expect(content).toContain("h-4 w-2/3");
		});

		it("should render metadata skeletons with icons", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../feed-item-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("h-3 w-3"); // icon skeleton
			expect(content).toContain("h-3 w-16"); // text skeleton
			expect(content).toContain("h-3 w-20"); // text skeleton
		});

		it("should render button skeleton", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../feed-item-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("h-8 w-full");
		});
	});

	describe("Styling", () => {
		it("should use Skeleton component for loading animation", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../feed-item-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("<Skeleton");
		});
	});

	describe("Code Quality", () => {
		it("should have proper JSDoc comment", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../feed-item-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("/**");
			expect(content).toContain("Loading skeleton for FeedItem component");
		});

		it("should export component as named export", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../feed-item-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("export function FeedItemSkeleton");
		});
	});
});
