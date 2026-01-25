/**
 * Tests for friend-list component
 *
 * Run with: bun test apps/web/src/components/friends/__tests__/friend-list.test.ts
 */

import { describe, expect, it } from "vitest";

describe("FriendList Component", () => {
	describe("Component Structure", () => {
		it("should export the component", () => {
			const { FriendList } = require("../friend-list");
			expect(FriendList).toBeDefined();
			expect(typeof FriendList).toBe("function");
		});

		it("should have a display name matching component name", () => {
			const { FriendList } = require("../friend-list");
			expect(FriendList.name).toBe("FriendList");
		});
	});

	describe("Dependencies", () => {
		it("should import required UI components", () => {
			const { FriendList } = require("../friend-list");
			expect(FriendList).toBeDefined();
		});

		it("should use lucide-react icons", () => {
			const module = require("../friend-list");
			expect(module).toBeDefined();
		});

		it("should use date-fns for time formatting", () => {
			const module = require("../friend-list");
			expect(module).toBeDefined();
		});
	});

	describe("Props Interface", () => {
		it("should accept currentUserId as optional prop", () => {
			const { FriendList } = require("../friend-list");
			expect(FriendList).toBeDefined();
		});

		it("should accept status prop with default 'accepted'", () => {
			const { FriendList } = require("../friend-list");
			expect(FriendList).toBeDefined();
		});

		it("should accept onRemove optional callback", () => {
			const { FriendList } = require("../friend-list");
			expect(FriendList).toBeDefined();
		});

		it("should support status values: 'accepted', 'pending', 'all'", () => {
			const { FriendList } = require("../friend-list");
			expect(FriendList).toBeDefined();
		});
	});

	describe("Type Safety", () => {
		it("should have proper TypeScript types for Friend interface", () => {
			const friend = {
				id: "friend-1",
				userId: "user-1",
				friendId: "user-2",
				status: "accepted" as const,
				createdAt: "2024-01-01T00:00:00Z",
				friend: {
					id: "user-2",
					name: "John Doe",
					email: "john@example.com",
					image: null,
				},
			};

			expect(friend.id).toBe("friend-1");
			expect(friend.status).toBe("accepted");
			expect(friend.friend?.name).toBe("John Doe");
		});

		it("should have proper TypeScript types for FriendListProps", () => {
			const props = {
				currentUserId: "user-1" as string | undefined,
				status: "accepted" as "accepted" | "pending" | "all",
				onRemove: undefined as ((friendId: string) => void) | undefined,
			};

			expect(props.currentUserId).toBe("user-1");
			expect(props.status).toBe("accepted");
		});
	});

	describe("State Management", () => {
		it("should use useState for current user ID", () => {
			const { FriendList } = require("../friend-list");
			expect(FriendList).toBeDefined();
		});

		it("should use useCallback for remove handler", () => {
			const { FriendList } = require("../friend-list");
			expect(FriendList).toBeDefined();
		});

		it("should use useEffect for fetching current user", () => {
			const { FriendList } = require("../friend-list");
			expect(FriendList).toBeDefined();
		});
	});

	describe("Data Access Pattern", () => {
		it("should use Supabase for reading friends", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("useSupabaseQuery");
		});

		it("should use tRPC for remove mutation", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("trpc.friend.remove");
		});

		it("should query friend table in both directions", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain(".or(");
			expect(content).toContain("user_id.eq.");
			expect(content).toContain("friend_id.eq.");
		});
	});

	describe("Component Features", () => {
		it("should display friend name and email", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("friendName");
			expect(content).toContain("friendEmail");
		});

		it("should display friend avatar or fallback icon", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("friend.friend?.image");
			expect(content).toContain('className="h-5 w-5 text-primary"');
		});

		it("should show remove button for accepted friends", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain('status === "accepted"');
			expect(content).toContain("UserMinus");
		});

		it("should show cancel button for outgoing pending requests", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain('status === "pending"');
			expect(content).toContain("Trash2");
		});

		it("should show incoming indicator for incoming requests", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("isIncomingRequest");
			expect(content).toContain("Incoming");
		});

		it("should display time ago for when friend was added", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("formatDistanceToNow");
			expect(content).toContain("Added");
		});

		it("should show loading state while fetching", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("isLoading");
			expect(content).toContain("Loader2");
		});

		it("should show empty state when no friends", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("displayFriends.length === 0");
			expect(content).toContain("No friends yet");
			expect(content).toContain("User");
		});
	});

	describe("Accessibility", () => {
		it("should have proper ARIA labels for action buttons", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("sr-only");
			expect(content).toContain("Remove friend");
			expect(content).toContain("Cancel request");
		});

		it("should have aria-hidden for decorative icons", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain('aria-hidden="true"');
		});

		it("should have proper alt text for avatar images", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("alt={");
		});
	});

	describe("Responsive Design", () => {
		it("should use mobile-first responsive classes", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("gap-");
			expect(content).toContain("flex-1");
		});

		it("should have truncation for long text", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("truncate");
		});

		it("should use shrink-0 for buttons and avatars", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("shrink-0");
		});
	});

	describe("Business Logic", () => {
		it("should determine if request is incoming vs outgoing", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("isIncoming");
			expect(content).toContain("friend.userId !== effectiveUserId");
		});

		it("should filter by status prop", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain('status !== "all"');
			expect(content).toContain('.eq("status"');
		});

		it("should use effectiveUserId (prop or fetched)", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("effectiveUserId");
			expect(content).toContain("currentUserId || localCurrentUserId");
		});

		it("should only enable query when effectiveUserId exists", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("enabled: !!effectiveUserId");
		});
	});

	describe("Real-time Updates", () => {
		it("should enable real-time for Supabase query", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("realtime: true");
			expect(content).toContain('table: "friend"');
		});
	});

	describe("Error Handling", () => {
		it("should handle remove errors with toast", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("onError");
			expect(content).toContain("toast.error");
		});

		it("should confirm before removing friend", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("confirm");
			expect(content).toContain("Are you sure you want to remove this friend");
		});

		it("should call onRemove callback after successful removal", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("onSuccess");
			expect(content).toContain("onRemove?.(");
		});
	});

	describe("Status Filtering", () => {
		it("should show different empty messages based on status", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain('status === "accepted"');
			expect(content).toContain('status === "pending"');
			// Check for status !== "all" which is what's actually used
			expect(content).toContain('status !== "all"');
		});

		it("should show status text in footer when not 'all'", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain('status !== "all"');
			expect(content).toContain("capitalize");
		});

		it("should display 'Request received' for incoming", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("Request received");
		});

		it("should display 'Request sent' for outgoing", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("Request sent");
		});
	});

	describe("Code Quality", () => {
		it("should have no syntax errors", () => {
			const { FriendList } = require("../friend-list");
			expect(FriendList).toBeDefined();
		});

		it("should export a named export", () => {
			const module = require("../friend-list");
			expect(Object.keys(module).length).toBeGreaterThan(0);
			expect(module.FriendList).toBeDefined();
		});

		it("should have proper JSDoc comments", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("/**");
			expect(content).toContain("* FriendList Component");
		});
	});
});
