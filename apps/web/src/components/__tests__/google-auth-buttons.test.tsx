const readFile = async (path: string) => {
	const fs = await import("node:fs");
	return fs.readFileSync(path, "utf-8");
};

describe("Google OAuth buttons", () => {
	test("sign-in form should wire Google OAuth", async () => {
		const content = await readFile(
			"/Users/klik1301/work/my/buddy-lifts/apps/web/src/components/sign-in-form.tsx",
		);
		expect(content).toContain("authClient.signIn.social");
		expect(content).toContain("Continue with Google");
	});

	test("sign-up form should wire Google OAuth", async () => {
		const content = await readFile(
			"/Users/klik1301/work/my/buddy-lifts/apps/web/src/components/sign-up-form.tsx",
		);
		expect(content).toContain("authClient.signIn.social");
		expect(content).toContain("Continue with Google");
	});
});
