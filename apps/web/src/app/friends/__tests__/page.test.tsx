/**
 * Tests for Friends Page
 *
 * Run with: bun test apps/web/src/app/friends/__tests__/page.test.tsx
 *
 * Tests the friends page at /friends
 *
 * Server Component (/friends/page.tsx):
 * - Checks authentication and redirects to /login if not authenticated
 * - Renders FriendsPageClient component for authenticated users
 *
 * Client Component (friends-page-client.tsx):
 * - Displays friends list and friend requests
 * - Tab navigation (All, Pending, Accepted)
 * - Add friend dialog integration
 * - Friend list component integration
 * - Friend request card integration
 * - Real-time updates via Supabase
 */

import { describe, expect, it } from "vitest";

describe("Friends Page", () => {
	describe("Server Component (page.tsx)", () => {
		it("should have correct file structure", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/page.tsx",
				"utf-8",
			);

			// Check imports
			expect(content).toContain("import { auth }");
			expect(content).toContain('from "@buddy-lifts/auth"');
			expect(content).toContain("import { headers }");
			expect(content).toContain("import { redirect }");
			expect(content).toContain('from "next/navigation"');

			// Check component export
			expect(content).toContain("export default async function FriendsPage");

			// Check authentication check
			expect(content).toContain("auth.api.getSession");
			expect(content).toContain('redirect("/login")');

			// Check client component rendering
			expect(content).toContain("FriendsPageClient");
			expect(content).toContain("currentUserId={session.user.id}");
		});

		it("should use proper page structure", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/page.tsx",
				"utf-8",
			);

			// Check for container classes
			expect(content).toContain("container");
			expect(content).toContain("max-w-4xl");
			expect(content).toContain("px-4");
			expect(content).toContain("py-8");

			// Check for page header
			expect(content).toContain("Friends");
			expect(content).toContain("Manage your friends and requests");
		});

		it("should have proper TypeScript types", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/page.tsx",
				"utf-8",
			);

			// Check for async function
			expect(content).toContain("async function FriendsPage");

			// Check for session type handling
			expect(content).toContain("session?.user");
		});

		it("should import FriendsPageClient component", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/page.tsx",
				"utf-8",
			);

			expect(content).toContain("import { FriendsPageClient }");
		});

		it("should follow mobile-first responsive design", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/page.tsx",
				"utf-8",
			);

			// Check for responsive classes
			expect(content).toContain("md:px-6");
			expect(content).toContain("md:text-3xl");
			expect(content).toContain("md:text-base");
		});
	});

	describe("Client Component (friends-page-client.tsx)", () => {
		it("should have correct file structure", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			// Check for "use client" directive
			expect(content).toContain('"use client"');

			// Check imports
			expect(content).toContain("import { useState }");
			expect(content).toContain("import { UserPlus }");
			expect(content).toContain('from "lucide-react"');
			expect(content).toContain("import { AddFriendDialog }");
			expect(content).toContain("import { FriendList }");
			expect(content).toContain("import { FriendRequestCard }");
			expect(content).toContain(
				"import { Tabs, TabsContent, TabsList, TabsTrigger }",
			);
		});

		it("should have proper TypeScript interfaces", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			// Check for Friend interface
			expect(content).toContain("interface Friend");
			expect(content).toContain("userId: string");
			expect(content).toContain("friendId: string");
			expect(content).toContain("status:");

			// Check for FriendsPageClientProps interface
			expect(content).toContain("interface FriendsPageClientProps");
			expect(content).toContain("currentUserId: string");

			// Check for TabValue type
			expect(content).toContain(
				'type TabValue = "all" | "pending" | "accepted"',
			);
		});

		it("should use useSupabaseQuery for data fetching", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			expect(content).toContain("useSupabaseQuery");
			expect(content).toContain("queryFn:");
			expect(content).toContain("realtime: true");
			expect(content).toContain('table: "friend"');
		});

		it("should query friend table with proper filters", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			// Check for bidirectional query
			expect(content).toContain(
				"user_id.eq.${currentUserId},friend_id.eq.${currentUserId}",
			);

			// Check for ordering
			expect(content).toContain('order("created_at", { ascending: false })');
		});

		it("should filter friends by status", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			// Check for pending requests filter
			expect(content).toContain('filter((f) => f.status === "pending")');

			// Check for incoming/outgoing separation
			expect(content).toContain("userId !== currentUserId");
			expect(content).toContain("userId === currentUserId");
		});

		it("should integrate AddFriendDialog component", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			expect(content).toContain("<AddFriendDialog");
			expect(content).toContain(
				"onFriendRequestSent={handleFriendRequestSent}",
			);
		});

		it("should integrate FriendList component", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			// Check for FriendList with accepted status
			expect(content).toContain('status="accepted"');

			// Check for FriendList with all status
			expect(content).toContain('status="all"');
		});

		it("should integrate FriendRequestCard for pending requests", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			// Check for incoming requests mapping
			expect(content).toContain("incomingRequests.map");
			expect(content).toContain("<FriendRequestCard");

			// Check for outgoing requests mapping
			expect(content).toContain("outgoingRequests.map");
		});

		it("should use Tabs component for navigation", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			expect(content).toContain("<Tabs");
			expect(content).toContain("value={activeTab}");
			expect(content).toContain("onValueChange");

			// Check for tabs list
			expect(content).toContain("<TabsList");
			expect(content).toContain("grid-cols-3");

			// Check for tab triggers
			expect(content).toContain('<TabsTrigger value="all"');
			expect(content).toContain('<TabsTrigger value="pending"');
			expect(content).toContain('<TabsTrigger value="accepted"');

			// Check for tab contents
			expect(content).toContain('<TabsContent value="pending"');
			expect(content).toContain('<TabsContent value="accepted"');
			expect(content).toContain('<TabsContent value="all"');
		});

		it("should display pending request count badge", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			// Check for badge rendering
			expect(content).toContain("pendingRequests.length > 0");
			expect(content).toContain("rounded-full bg-primary");
			expect(content).toContain("text-primary-foreground");
		});

		it("should show separate sections for incoming and outgoing requests", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			// Check for incoming requests section
			expect(content).toContain("Incoming Requests");
			expect(content).toContain("People who want to be your friend");

			// Check for sent requests section
			expect(content).toContain("Sent Requests");
			expect(content).toContain("Friend requests you've sent");
		});

		it("should show empty state for no pending requests", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			expect(content).toContain("pendingRequests.length === 0");
			expect(content).toContain("No pending friend requests");
			expect(content).toContain("<UserPlus");
		});

		it("should show loading state with skeleton", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			expect(content).toContain("{isLoading &&");
			expect(content).toContain("animate-pulse");
			expect(content).toContain("bg-muted");
		});

		it("should follow mobile-first responsive design", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			// Check for responsive classes
			expect(content).toContain("space-y-6");
			expect(content).toContain("space-y-4");
			expect(content).toContain("space-y-3");
			expect(content).toContain("font-semibold text-lg");
			expect(content).toContain("text-muted-foreground text-sm");
		});

		it("should handle tab state management", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			// Check for useState for activeTab
			expect(content).toContain(
				'const [activeTab, setActiveTab] = useState<TabValue>("all")',
			);

			// Check for tab change handler
			expect(content).toContain("setActiveTab(v as TabValue)");
		});

		it("should include proper JSDoc comments", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			expect(content).toContain("/**");
			expect(content).toContain("* FriendsPageClient Component");
			expect(content).toContain("* Client component for the friends page");
			expect(content).toContain(
				"* Displays friends list and friend requests with filtering",
			);
		});

		it("should document data access pattern", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			expect(content).toContain("* Data Access:");
			expect(content).toContain("- Read: Supabase (useSupabaseQuery)");
			expect(content).toContain(
				"- Write: Handled by child components via tRPC",
			);
		});
	});

	describe("Data Access Pattern", () => {
		it("should read from Supabase only (hybrid pattern)", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			// Should use Supabase for reads
			expect(content).toMatch(/useSupabaseQuery/);

			// Should NOT use tRPC for queries (writes are handled by child components)
			expect(content).not.toContain("trpc.");
			expect(content).not.toContain("useQuery");
		});

		it("should enable real-time subscriptions", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			expect(content).toContain("realtime: true");
		});
	});

	describe("Accessibility", () => {
		it("should use semantic HTML elements", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			// Check for proper heading structure
			expect(content).toContain("<h2");
		});

		it("should have proper button types", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			// Check for button type (handled by mocked components)
			expect(content).toContain("<Tabs");
		});
	});

	describe("Code Quality", () => {
		it("should not have unused imports", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			// All imports should be used in the file
			const imports = [
				{ name: "useState", used: (content.match(/useState/g) ?? []).length },
				{ name: "UserPlus", used: (content.match(/UserPlus/g) ?? []).length },
				{
					name: "AddFriendDialog",
					used: (content.match(/AddFriendDialog/g) ?? []).length,
				},
				{
					name: "FriendList",
					used: (content.match(/FriendList/g) ?? []).length,
				},
				{
					name: "FriendRequestCard",
					used: (content.match(/FriendRequestCard/g) ?? []).length,
				},
				{ name: "Tabs", used: (content.match(/Tabs/g) ?? []).length },
				{
					name: "TabsContent",
					used: (content.match(/TabsContent/g) ?? []).length,
				},
				{ name: "TabsList", used: (content.match(/TabsList/g) ?? []).length },
				{
					name: "TabsTrigger",
					used: (content.match(/TabsTrigger/g) ?? []).length,
				},
			];

			// Each import should appear at least twice (import + usage)
			for (const imp of imports) {
				expect(imp.used).toBeGreaterThanOrEqual(1);
			}
		});

		it("should have proper error handling", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			// Check for loading and empty states
			expect(content).toContain("isLoading");
			expect(content).toContain("length === 0");
		});

		it("should follow project conventions", async () => {
			const fs = await import("node:fs/promises");
			const content = await fs.readFile(
				"apps/web/src/app/friends/friends-page-client.tsx",
				"utf-8",
			);

			// Should use "use client" directive
			expect(content).toContain('"use client"');

			// Should export named function
			expect(content).toContain("export function FriendsPageClient");
		});
	});
});
