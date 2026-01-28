/**
 * Tests for friend-card-skeleton component
 *
 * Run with: bun test apps/web/src/components/friends/__tests__/friend-card-skeleton.test.ts
 */

describe("FriendCardSkeleton Component", () => {
	describe("Component Structure", () => {
		it("should export the component", () => {
			const { FriendCardSkeleton } = require("../friend-card-skeleton");
			expect(FriendCardSkeleton).toBeDefined();
			expect(typeof FriendCardSkeleton).toBe("function");
		});

		it("should have a display name matching component name", () => {
			const { FriendCardSkeleton } = require("../friend-card-skeleton");
			expect(FriendCardSkeleton.name).toBe("FriendCardSkeleton");
		});

		it("should not require client directive (no hooks/browser APIs)", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-card-skeleton.tsx`,
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
				`${__dirname}/../friend-card-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/components/ui/skeleton");
		});

		it("should import Card components from ui/card", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-card-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/components/ui/card");
		});
	});

	describe("Props Interface", () => {
		it("should not accept any props", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-card-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toMatch(/export function FriendCardSkeleton\(\)/);
		});
	});

	describe("Component Structure", () => {
		it("should render Card wrapper", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-card-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("<Card>");
			expect(content).toContain("</Card>");
		});

		it("should render CardHeader section", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-card-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("<CardHeader>");
			expect(content).toContain("</CardHeader>");
		});

		it("should render CardContent section", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-card-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("<CardContent>");
			expect(content).toContain("</CardContent>");
		});

		it("should render avatar skeleton with rounded-full class", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-card-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("rounded-full");
			expect(content).toContain("h-10 w-10");
		});

		it("should render name and email skeletons", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-card-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("h-4 w-32"); // name skeleton
			expect(content).toContain("h-3 w-48"); // email skeleton
		});

		it("should render status/time skeleton", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-card-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("h-3 w-24");
		});

		it("should render two action button skeletons", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-card-skeleton.tsx`,
				"utf-8",
			);
			const buttonSkeletonCount = (content.match(/h-8 w-16/g) || []).length;
			expect(buttonSkeletonCount).toBeGreaterThanOrEqual(2);
		});
	});

	describe("Styling", () => {
		it("should use Skeleton component for loading animation", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-card-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("<Skeleton");
		});
	});

	describe("Code Quality", () => {
		it("should have proper JSDoc comment", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-card-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("/**");
			expect(content).toContain("Loading skeleton for friend request card");
		});

		it("should export component as named export", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-card-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("export function FriendCardSkeleton");
		});
	});
});
