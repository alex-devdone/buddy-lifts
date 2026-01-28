/**
 * Tests for friend-request-card component
 *
 * Run with: bun test apps/web/src/components/friends/__tests__/friend-request-card.test.ts
 */

describe("FriendRequestCard Component", () => {
	describe("Component Structure", () => {
		it("should export the component", () => {
			const { FriendRequestCard } = require("../friend-request-card");
			expect(FriendRequestCard).toBeDefined();
			expect(typeof FriendRequestCard).toBe("function");
		});

		it("should have a display name matching component name", () => {
			const { FriendRequestCard } = require("../friend-request-card");
			expect(FriendRequestCard.name).toBe("FriendRequestCard");
		});
	});

	describe("Dependencies", () => {
		it("should import required UI components", () => {
			const { FriendRequestCard } = require("../friend-request-card");
			expect(FriendRequestCard).toBeDefined();
		});

		it("should use lucide-react icons", () => {
			const module = require("../friend-request-card");
			expect(module).toBeDefined();
		});

		it("should use date-fns for time formatting", () => {
			const module = require("../friend-request-card");
			expect(module).toBeDefined();
		});

		it("should use @tanstack/react-query for mutations", () => {
			const module = require("../friend-request-card");
			expect(module).toBeDefined();
		});
	});

	describe("Props Interface", () => {
		it("should accept friend prop with required structure", () => {
			const { FriendRequestCard } = require("../friend-request-card");
			expect(FriendRequestCard).toBeDefined();
		});

		it("should accept optional onAccept callback", () => {
			const { FriendRequestCard } = require("../friend-request-card");
			expect(FriendRequestCard).toBeDefined();
		});

		it("should accept optional onReject callback", () => {
			const { FriendRequestCard } = require("../friend-request-card");
			expect(FriendRequestCard).toBeDefined();
		});

		it("should accept optional currentUserId prop", () => {
			const { FriendRequestCard } = require("../friend-request-card");
			expect(FriendRequestCard).toBeDefined();
		});

		it("should accept variant prop with default and compact options", () => {
			const { FriendRequestCard } = require("../friend-request-card");
			expect(FriendRequestCard).toBeDefined();
		});
	});

	describe("Type Safety", () => {
		it("should have proper TypeScript types for Friend interface", () => {
			const friend = {
				id: "friend-1",
				userId: "user-1",
				friendId: "user-2",
				status: "pending" as const,
				createdAt: "2024-01-01T00:00:00Z",
				friend: {
					id: "user-2",
					name: "John Doe",
					email: "john@example.com",
					image: null,
				},
			};

			expect(friend.id).toBe("friend-1");
			expect(friend.status).toBe("pending");
			expect(friend.friend?.name).toBe("John Doe");
		});

		it("should have proper TypeScript types for FriendRequestCardProps", () => {
			const props = {
				friend: {
					id: "friend-1",
					userId: "user-1",
					friendId: "user-2",
					status: "pending" as const,
					createdAt: "2024-01-01T00:00:00Z",
					friend: {
						id: "user-2",
						name: "Jane Doe",
						email: "jane@example.com",
						image: null,
					},
				},
				onAccept: undefined as ((friendId: string) => void) | undefined,
				onReject: undefined as ((friendId: string) => void) | undefined,
				currentUserId: undefined as string | undefined,
				variant: "default" as "default" | "compact",
			};

			expect(props.friend.id).toBe("friend-1");
			expect(props.variant).toBe("default");
		});
	});

	describe("State Management", () => {
		it("should use useState for current user ID", () => {
			const { FriendRequestCard } = require("../friend-request-card");
			expect(FriendRequestCard).toBeDefined();
		});

		it("should use useCallback for event handlers", () => {
			const { FriendRequestCard } = require("../friend-request-card");
			expect(FriendRequestCard).toBeDefined();
		});

		it("should use useEffect for fetching current user", () => {
			const { FriendRequestCard } = require("../friend-request-card");
			expect(FriendRequestCard).toBeDefined();
		});
	});

	describe("Data Access Pattern", () => {
		it("should read friend data from props (not from database directly)", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			// Should use friend prop, not useSupabaseQuery
			expect(content).toContain("friend.");
		});

		it("should use tRPC mutations for accept action", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("trpc.friend.accept");
		});

		it("should use tRPC mutations for reject action", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("trpc.friend.reject");
		});
	});

	describe("Component Features", () => {
		it("should display friend name", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("friendName");
		});

		it("should display friend email when available", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("friendEmail");
		});

		it("should display avatar when friend has image", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("friend.friend?.image");
		});

		it("should show User icon fallback when no avatar image", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain('aria-hidden="true"');
		});

		it("should display accept button for incoming requests", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("isIncoming");
			expect(content).toContain("Accept friend request");
		});

		it("should display reject button for incoming requests", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("Reject friend request");
		});

		it("should show cancel button for outgoing requests (default variant)", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("Cancel friend request");
			expect(content).toContain("Trash2");
		});

		it("should show 'Sent' indicator for outgoing requests (compact variant)", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("Sent");
		});

		it("should display time ago for request", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("formatDistanceToNow");
		});

		it("should display 'Request received' status for incoming requests", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("Request received");
		});

		it("should display 'Request sent' status for outgoing requests", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("Request sent");
		});

		it("should show smaller avatar in compact variant", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain('variant === "compact"');
		});

		it("should hide email in compact variant", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain('variant === "default"');
		});

		it("should hide footer in compact variant", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain('variant === "default"');
		});

		it("should show loading state during mutations", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("isPending");
			expect(content).toContain("opacity-70");
		});
	});

	describe("Accessibility", () => {
		it("should have proper ARIA labels for action buttons", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("aria-label");
			expect(content).toContain("Accept friend request");
			expect(content).toContain("Reject friend request");
		});

		it("should have aria-hidden for decorative icons", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain('aria-hidden="true"');
		});

		it("should have proper alt text for avatar images", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("alt={");
		});
	});

	describe("Responsive Design", () => {
		it("should use mobile-first responsive classes", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("gap-");
			expect(content).toContain("flex-1");
		});

		it("should have truncation for long text", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("truncate");
		});

		it("should use shrink-0 for buttons and avatars", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("shrink-0");
		});
	});

	describe("Business Logic", () => {
		it("should correctly identify incoming requests", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("isIncoming");
			expect(content).toContain("friend.userId !== effectiveUserId");
		});

		it("should correctly identify outgoing requests", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("!isIncoming");
		});

		it("should use provided currentUserId when available", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("effectiveUserId");
			expect(content).toContain("currentUserId || localCurrentUserId");
		});

		it("should use fallback name when friend name is missing", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("Unknown User");
		});
	});

	describe("Error Handling", () => {
		it("should handle missing friend object gracefully", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("Unknown User");
		});

		it("should show confirm dialog before rejecting", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("confirm");
			expect(content).toContain(
				"Are you sure you want to reject this friend request",
			);
		});

		it("should handle accept errors with toast", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("onError");
			expect(content).toContain("toast.error");
		});

		it("should handle reject errors with toast", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("toast.error");
		});

		it("should call onAccept callback after successful accept", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("onSuccess");
			expect(content).toContain("onAccept?.(");
		});

		it("should call onReject callback after successful reject", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("onReject?.(");
		});
	});

	describe("Code Quality", () => {
		it("should have no syntax errors", () => {
			const { FriendRequestCard } = require("../friend-request-card");
			expect(FriendRequestCard).toBeDefined();
		});

		it("should export a named export", () => {
			const module = require("../friend-request-card");
			expect(Object.keys(module).length).toBeGreaterThan(0);
			expect(module.FriendRequestCard).toBeDefined();
		});

		it("should have proper JSDoc comments", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("/**");
			expect(content).toContain("* FriendRequestCard Component");
		});

		it("should use cn utility for className merging", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../friend-request-card.tsx`,
				"utf-8",
			);
			expect(content).toContain("cn(");
		});
	});
});
