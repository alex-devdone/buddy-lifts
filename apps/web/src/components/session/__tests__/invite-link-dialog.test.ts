import { describe, expect, test } from "bun:test";

/**
 * Structural tests for InviteLinkDialog component
 *
 * These tests verify the component structure and exports without requiring
 * a full React Testing Library setup. They ensure the file is syntactically
 * correct and exports the expected component.
 */

describe("InviteLinkDialog Component", () => {
	test("should import without errors", async () => {
		const module = await import("../invite-link-dialog");
		expect(module.InviteLinkDialog).toBeDefined();
		expect(typeof module.InviteLinkDialog).toBe("function");
	});

	test("should have correct component name", async () => {
		const module = await import("../invite-link-dialog");
		expect(module.InviteLinkDialog.name).toBe("InviteLinkDialog");
	});

	test("component should be a valid React component constructor", async () => {
		const module = await import("../invite-link-dialog");
		const component = module.InviteLinkDialog;

		expect(component.prototype).toBeDefined();
		expect(typeof component).toBe("function");

		const componentString = component.toString();
		expect(componentString).toContain("use");
		expect(componentString).toContain("useState");
		expect(componentString).toContain("useMutation");
	});

	test("should reference required dependencies", async () => {
		const module = await import("../invite-link-dialog");
		const componentString = module.InviteLinkDialog.toString();

		// Verify the component uses expected tRPC mutations
		expect(componentString).toContain("session.updateAccess");

		// Verify it uses required UI components
		expect(componentString).toContain("Button");
		expect(componentString).toContain("Dialog");
		expect(componentString).toContain("DialogContent");
		expect(componentString).toContain("DialogHeader");
		expect(componentString).toContain("DialogTitle");
		expect(componentString).toContain("DialogDescription");
		expect(componentString).toContain("DialogFooter");
		expect(componentString).toContain("DialogClose");
		expect(componentString).toContain("DialogTrigger");

		// Verify it uses lucide-react icons
		expect(componentString).toContain("Copy");
		expect(componentString).toContain("Link");
		expect(componentString).toContain("Loader2");
		expect(componentString).toContain("Lock");
		expect(componentString).toContain("LockOpen");
	});

	test("should handle all required props", async () => {
		const module = await import("../invite-link-dialog");
		const componentString = module.InviteLinkDialog.toString();

		expect(componentString).toContain("sessionId");
		expect(componentString).toContain("trigger");
		expect(componentString).toContain("open");
		expect(componentString).toContain("onOpenChange");
	});

	test("should use Supabase for reading session data", async () => {
		const module = await import("../invite-link-dialog");
		const componentString = module.InviteLinkDialog.toString();

		expect(componentString).toContain("useSupabaseQuery");
		expect(componentString).toContain('from("training_session")');
	});

	test("should use tRPC for mutations", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("trpc.session.updateAccess");
	});

	test("should have proper state management", async () => {
		const module = await import("../invite-link-dialog");
		const componentString = module.InviteLinkDialog.toString();

		expect(componentString).toContain("useState");
		expect(componentString).toContain("uncontrolledOpen");
		expect(componentString).toContain("copied");
		expect(componentString).toContain("currentUserId");
	});

	test("should have real-time subscriptions enabled", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("realtime: true");
		expect(fileContent).toContain('table: "training_session"');
	});

	test("should handle invite link copying", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("handleCopyInviteLink");
		expect(fileContent).toContain("handleCopyInviteCode");
		expect(fileContent).toContain("navigator.clipboard.writeText");
		expect(fileContent).toContain("window.location.origin");
	});

	test("should handle access type toggling", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("handleToggleAccess");
		expect(fileContent).toContain("accessType");
		expect(fileContent).toContain('"read"');
		expect(fileContent).toContain('"admin"');
	});

	test("should support controlled and uncontrolled state", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("controlledOpen");
		expect(fileContent).toContain("uncontrolledOpen");
		expect(fileContent).toContain("onOpenChange");
	});

	test("should display invite code", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("Invite Code");
		expect(fileContent).toContain("inviteCode");
		expect(fileContent).toContain("font-mono");
	});

	test("should display full invite URL", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("Full Invite Link");
		expect(fileContent).toContain("inviteUrl");
		expect(fileContent).toContain("/join/");
	});

	test("should show loading state while fetching", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("sessionLoading");
		expect(fileContent).toContain("Loader2");
		expect(fileContent).toContain("Loading...");
	});

	test("should show error state if session fails to load", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("sessionError");
		expect(fileContent).toContain("Session unavailable");
	});

	test("should determine if current user is host", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("isHost");
		expect(fileContent).toContain("hostUserId");
	});

	test("should display access type toggle for host only", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("isHost");
		expect(fileContent).toContain("Participant Access");
		expect(fileContent).toContain(
			"Read Only - Participants can view but not modify",
		);
		expect(fileContent).toContain("Admin - Participants can modify exercises");
	});

	test("should show access info for non-host participants", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("Current access level");
		expect(fileContent).toContain("Only the host can change this setting");
	});

	test("should have proper dialog title and description", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("Share Invite Link");
		expect(fileContent).toContain("Share this invite link with friends");
	});

	test("should have proper toast notifications", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("toast.success");
		expect(fileContent).toContain("toast.error");
		expect(fileContent).toContain("Invite link copied!");
		expect(fileContent).toContain("Invite code copied!");
		expect(fileContent).toContain("Access type updated");
	});

	test("should be mobile-first responsive", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("max-w-md");
		expect(fileContent).toContain("break-all");
	});

	test("should handle copied state with timeout", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("setCopied");
		expect(fileContent).toContain("setTimeout");
		expect(fileContent).toContain("Copied!");
	});

	test("should have proper TypeScript interfaces", async () => {
		const module = await import("../invite-link-dialog");
		const fileContent = await import("node:fs").then((fs) =>
			fs.readFileSync(`${__dirname}/../invite-link-dialog.tsx`, "utf-8"),
		);

		expect(fileContent).toContain("interface InviteLinkDialogProps");
		expect(fileContent).toContain("interface TrainingSession");
	});

	test("should use useCallback for event handlers", async () => {
		const module = await import("../invite-link-dialog");
		const componentString = module.InviteLinkDialog.toString();

		expect(componentString).toContain("useCallback");
		expect(componentString).toContain("handleCopyInviteLink");
		expect(componentString).toContain("handleCopyInviteCode");
		expect(componentString).toContain("handleToggleAccess");
	});

	test("should disable buttons during mutations", async () => {
		const module = await import("../invite-link-dialog");
		const componentString = module.InviteLinkDialog.toString();

		expect(componentString).toContain("updateAccess.isPending");
	});

	test("should have custom trigger support", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("trigger");
		expect(fileContent).toContain("defaultTrigger");
		expect(fileContent).toContain("DialogTrigger asChild");
	});

	test("should have default trigger button with share icon", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("Share Invite");
		expect(fileContent).toContain('Link className="mr-1');
	});

	test("should have Done button in footer", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("DialogFooter");
		expect(fileContent).toContain("Done");
	});

	test("should handle SSR safely for window object", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain('typeof window !== "undefined"');
	});

	test("should fetch current user from auth", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("useEffect");
		expect(fileContent).toContain("fetchCurrentUser");
		expect(fileContent).toContain("supabase.auth.getUser()");
	});

	test("should have proper accessibility attributes", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("aria-label");
		expect(fileContent).toContain("Copy invite code");
		expect(fileContent).toContain("Copy invite link");
		expect(fileContent).toContain("sr-only");
	});

	test("should generate invite URL with correct format", async () => {
		const fs = await import("node:fs");
		const fileContent = fs.readFileSync(
			`${__dirname}/../invite-link-dialog.tsx`,
			"utf-8",
		);

		expect(fileContent).toContain("inviteUrl");
		expect(fileContent).toContain("/join/");
	});
});
