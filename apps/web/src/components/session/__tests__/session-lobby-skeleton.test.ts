/**
 * Tests for session-lobby-skeleton component
 *
 * Run with: bun test apps/web/src/components/session/__tests__/session-lobby-skeleton.test.ts
 */

describe("SessionLobbySkeleton Component", () => {
	describe("Component Structure", () => {
		it("should export the component", () => {
			const { SessionLobbySkeleton } = require("../session-lobby-skeleton");
			expect(SessionLobbySkeleton).toBeDefined();
			expect(typeof SessionLobbySkeleton).toBe("function");
		});

		it("should have a display name matching component name", () => {
			const { SessionLobbySkeleton } = require("../session-lobby-skeleton");
			expect(SessionLobbySkeleton.name).toBe("SessionLobbySkeleton");
		});

		it("should not require client directive (no hooks/browser APIs)", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-lobby-skeleton.tsx`,
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
				`${__dirname}/../session-lobby-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/components/ui/skeleton");
		});

		it("should import Card components from ui/card", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-lobby-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/components/ui/card");
		});
	});

	describe("Props Interface", () => {
		it("should not accept any props", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-lobby-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toMatch(/export function SessionLobbySkeleton\(\)/);
		});
	});

	describe("Component Structure", () => {
		it("should render invite code card", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-lobby-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("<Card>");
			expect(content).toContain("</Card>");
		});

		it("should render CardHeader for invite code", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-lobby-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("<CardHeader>");
			expect(content).toContain("<CardTitle>");
		});

		it("should render CardContent sections", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-lobby-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("CardContent");
		});

		it("should render invite code display skeleton", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-lobby-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("h-10 w-full");
		});

		it("should render access type toggle skeleton", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-lobby-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("h-6 w-full");
		});

		it("should render participant card skeletons", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-lobby-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("Array.from({ length: 2 })");
		});

		it("should render avatar skeletons for participants", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-lobby-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("rounded-full");
			expect(content).toContain("h-10 w-10");
		});

		it("should render participant name skeleton", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-lobby-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("h-4 w-32");
		});

		it("should render role badge skeleton", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-lobby-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("h-3 w-16");
		});

		it("should render action button skeleton", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-lobby-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("h-11 w-full");
		});
	});

	describe("Layout", () => {
		it("should use space-y-4 for section spacing", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-lobby-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("space-y-4");
		});

		it("should use space-y-3 for participant list", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-lobby-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("space-y-3");
		});

		it("should use flex layout with gap for participant cards", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-lobby-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("flex items-center gap-3");
		});
	});

	describe("Styling", () => {
		it("should use Skeleton component for loading animation", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-lobby-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("<Skeleton");
		});
	});

	describe("Code Quality", () => {
		it("should have proper JSDoc comment", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-lobby-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("/**");
			expect(content).toContain("Loading skeleton for SessionLobby component");
		});

		it("should export component as named export", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../session-lobby-skeleton.tsx`,
				"utf-8",
			);
			expect(content).toContain("export function SessionLobbySkeleton");
		});
	});
});
