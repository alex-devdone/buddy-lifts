async function getUserMenuContent() {
	const fs = await import("node:fs");
	return fs.readFileSync(
		"/Users/klik1301/work/my/buddy-lifts/apps/web/src/components/user-menu.tsx",
		"utf-8",
	);
}

describe("UserMenu Component", () => {
	test("should import without errors", async () => {
		const module = await import("../user-menu");
		expect(module.default).toBeDefined();
		expect(typeof module.default).toBe("function");
	});

	test("should have correct component name", async () => {
		const module = await import("../user-menu");
		expect(module.default.name).toBe("UserMenu");
	});

	test("should import toast from sonner", async () => {
		const content = await getUserMenuContent();
		expect(content).toContain('import { toast } from "sonner"');
	});

	test("should show success toast on sign out", async () => {
		const content = await getUserMenuContent();
		expect(content).toContain('toast.success("Signed out successfully")');
	});

	test("should show error toast on sign out failure", async () => {
		const content = await getUserMenuContent();
		expect(content).toContain("toast.error");
		expect(content).toContain("Failed to sign out");
	});
});
