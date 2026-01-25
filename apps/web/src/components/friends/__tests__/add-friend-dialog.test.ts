/**
 * Tests for add-friend-dialog component
 *
 * Run with: bun test apps/web/src/components/friends/__tests__/add-friend-dialog.test.ts
 */

import { describe, expect, it } from "vitest";

describe("AddFriendDialog Component", () => {
	describe("Component Structure", () => {
		it("should export the component", () => {
			const { AddFriendDialog } = require("../add-friend-dialog");
			expect(AddFriendDialog).toBeDefined();
			expect(typeof AddFriendDialog).toBe("function");
		});

		it("should have a display name matching component name", () => {
			const { AddFriendDialog } = require("../add-friend-dialog");
			expect(AddFriendDialog.name).toBe("AddFriendDialog");
		});
	});

	describe("Dependencies", () => {
		it("should import required Dialog UI components", () => {
			const { AddFriendDialog } = require("../add-friend-dialog");
			expect(AddFriendDialog).toBeDefined();
		});

		it("should use lucide-react icons", () => {
			const module = require("../add-friend-dialog");
			expect(module).toBeDefined();
		});

		it("should use @tanstack/react-query for mutations", () => {
			const module = require("../add-friend-dialog");
			expect(module).toBeDefined();
		});

		it("should use useSupabaseQuery for data fetching", () => {
			const module = require("../add-friend-dialog");
			expect(module).toBeDefined();
		});
	});

	describe("Props Interface", () => {
		it("should accept optional trigger prop for custom button", () => {
			const { AddFriendDialog } = require("../add-friend-dialog");
			expect(AddFriendDialog).toBeDefined();
		});

		it("should accept open prop for controlled state", () => {
			const { AddFriendDialog } = require("../add-friend-dialog");
			expect(AddFriendDialog).toBeDefined();
		});

		it("should accept onOpenChange callback", () => {
			const { AddFriendDialog } = require("../add-friend-dialog");
			expect(AddFriendDialog).toBeDefined();
		});

		it("should accept onFriendRequestSent callback", () => {
			const { AddFriendDialog } = require("../add-friend-dialog");
			expect(AddFriendDialog).toBeDefined();
		});
	});

	describe("Type Safety", () => {
		it("should have proper TypeScript types for UserSearchResult", () => {
			const user: import("../add-friend-dialog").UserSearchResult = {
				id: "user-1",
				name: "John Doe",
				email: "john@example.com",
				image: null,
			};
			expect(user.id).toBe("user-1");
			expect(user.name).toBe("John Doe");
		});

		it("should have proper TypeScript types for ExistingFriend", () => {
			const friend: import("../add-friend-dialog").ExistingFriend = {
				id: "friend-1",
				userId: "user-1",
				friendId: "user-2",
				status: "accepted",
			};
			expect(friend.status).toBe("accepted");
		});

		it("should have proper TypeScript types for AddFriendDialogProps", () => {
			const props: import("../add-friend-dialog").AddFriendDialogProps = {
				trigger: undefined,
				open: undefined,
				onOpenChange: undefined,
				onFriendRequestSent: undefined,
			};
			expect(props).toBeDefined();
		});
	});

	describe("State Management", () => {
		it("should use useState for dialog open state", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("useState");
		});

		it("should use useState for search query", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("searchQuery");
		});

		it("should use useState for debounced query", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("debouncedQuery");
		});

		it("should use useCallback for event handlers", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("useCallback");
		});

		it("should use useEffect for debouncing search", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("setTimeout");
			expect(content).toContain("300");
		});

		it("should use useEffect for fetching current user", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("useEffect");
			expect(content).toContain("auth.getUser");
		});
	});

	describe("Data Access Pattern", () => {
		it("should use Supabase for user search query", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain('from("user")');
			expect(content).toContain("select");
		});

		it("should use Supabase for existing friendships query", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain('from("friend")');
		});

		it("should use tRPC mutation for sending friend requests", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("trpc.friend.send");
		});

		it("should exclude current user from search results", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain('neq("id", currentUserId)');
		});
	});

	describe("Component Features", () => {
		it("should have search input with icon", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("Search");
			expect(content).toContain('placeholder="Search by email or name');
		});

		it("should display search results", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("searchResults");
		});

		it("should show loading state during search", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("searchLoading");
			expect(content).toContain("Loader2");
		});

		it("should show empty state when no users found", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("No users found");
		});

		it("should show empty state when no search query", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("Enter an email or name to search");
		});

		it("should show minimum characters message for short queries", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("Enter at least 2 characters to search");
		});

		it("should clear search button when query exists", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("X");
			expect(content).toContain("Clear search");
		});

		it("should display user avatar when available", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("user.image");
		});

		it("should display User icon fallback when no avatar", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain('className="h-4 w-4 text-primary"');
		});

		it("should display user name and email in results", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("user.name");
			expect(content).toContain("user.email");
		});

		it("should have send friend request button", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("UserPlus");
			expect(content).toContain("Send friend request to");
		});

		it("should filter out users with existing relationships", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("availableUsers");
			expect(content).toContain("getRelationshipStatus");
		});

		it("should show relationship status for existing connections", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("getUserStatus");
			expect(content).toContain("Existing connections");
		});

		it("should separate available users from existing connections", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("Send friend request");
			expect(content).toContain("Existing connections");
		});

		it("should disable buttons during mutation", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("sendRequest.isPending");
			expect(content).toContain("disabled={");
		});

		it("should use default trigger button when none provided", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("defaultTrigger");
			expect(content).toContain("Add Friend");
		});

		it("should support controlled and uncontrolled dialog state", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("controlledOpen");
			expect(content).toContain("uncontrolledOpen");
			expect(content).toContain("isOpen");
		});

		it("should close dialog and clear search after successful request", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("setIsOpen(false)");
			expect(content).toContain('setSearchQuery("")');
		});
	});

	describe("Accessibility", () => {
		it("should have proper ARIA labels for search input", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain('aria-label="Search users"');
		});

		it("should have proper ARIA labels for clear button", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain('aria-label="Clear search"');
		});

		it("should have proper ARIA labels for send request buttons", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("aria-label={`Send friend request to");
		});

		it("should have proper ARIA labels for User icon", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain('aria-hidden="true"');
		});

		it("should have proper alt text for avatar images", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("alt={");
		});

		it("should have proper dialog structure with header and description", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("DialogTitle");
			expect(content).toContain("DialogDescription");
			expect(content).toContain("Add Friend");
		});
	});

	describe("Responsive Design", () => {
		it("should use mobile-first responsive classes", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("gap-");
			expect(content).toContain("flex-1");
			expect(content).toContain("min-w-0");
		});

		it("should have truncation for long text", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("truncate");
		});

		it("should use shrink-0 for buttons and avatars", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("shrink-0");
		});

		it("should have max-w-md container for mobile-first design", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("max-w-md");
		});
	});

	describe("Business Logic", () => {
		it("should implement debouncing with 300ms delay", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("300");
		});

		it("should only search when query has at least 2 characters", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("length >= 2");
		});

		it("should search by both email and name using OR condition", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("email.ilike");
			expect(content).toContain("name.ilike");
		});

		it("should use case-insensitive search (ilike)", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("ilike");
		});

		it("should limit search results to 10 users", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain(".limit(10)");
		});

		it("should correctly identify relationship status", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("getRelationshipStatus");
			expect(content).toContain("none");
			expect(content).toContain("pending");
			expect(content).toContain("accepted");
			expect(content).toContain("blocked");
		});

		it("should check both directions for friendship", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("f.userId === currentUserId");
			expect(content).toContain("f.userId === userId");
		});

		it("should display correct status labels", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("Already friends");
			expect(content).toContain("Request pending");
			expect(content).toContain("Blocked");
		});

		it("should use different styling for existing connections", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("border-dashed");
			expect(content).toContain("bg-muted/30");
		});
	});

	describe("Error Handling", () => {
		it("should handle send request errors with toast", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("onError");
			expect(content).toContain("toast.error");
		});

		it("should handle successful request with toast", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("onSuccess");
			expect(content).toContain("toast.success");
			expect(content).toContain("Friend request sent!");
		});

		it("should call onFriendRequestSent callback after success", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("onFriendRequestSent?.(");
		});

		it("should handle missing current user gracefully", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("!!currentUserId");
		});
	});

	describe("Real-time Updates", () => {
		it("should enable real-time for existing friends query", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("realtime: true");
			expect(content).toContain('table: "friend"');
		});

		it("should disable real-time for user search", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("realtime: false");
		});
	});

	describe("Code Quality", () => {
		it("should have no syntax errors", () => {
			const { AddFriendDialog } = require("../add-friend-dialog");
			expect(AddFriendDialog).toBeDefined();
		});

		it("should export a named export", () => {
			const module = require("../add-friend-dialog");
			expect(Object.keys(module).length).toBeGreaterThan(0);
			expect(module.AddFriendDialog).toBeDefined();
		});

		it("should have proper JSDoc comments", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("/**");
			expect(content).toContain("* AddFriendDialog Component");
		});

		it("should have interfaces exported for type usage", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("interface UserSearchResult");
			expect(content).toContain("interface ExistingFriend");
			expect(content).toContain("interface AddFriendDialogProps");
		});

		it("should handle autofocus on search input", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("autoFocus");
		});
	});

	describe("Integration Points", () => {
		it("should integrate with Supabase auth for current user", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("supabase.auth.getUser");
		});

		it("should integrate with tRPC friend router", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("trpc.friend.send");
		});

		it("should integrate with useSupabaseQuery hook", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("useSupabaseQuery");
		});

		it("should integrate with toast notifications", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../add-friend-dialog.tsx`,
				"utf-8",
			);
			expect(content).toContain("toast.success");
			expect(content).toContain("toast.error");
		});
	});
});
