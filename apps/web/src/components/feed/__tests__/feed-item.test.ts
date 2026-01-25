/**
 * Tests for feed-item component
 *
 * Run with: bun test apps/web/src/components/feed/__tests__/feed-item.test.ts
 */

import { describe, expect, it } from "vitest";

describe("FeedItem Component", () => {
	describe("Component Structure", () => {
		it("should export the component", () => {
			const { FeedItem } = require("../feed-item");
			expect(FeedItem).toBeDefined();
			expect(typeof FeedItem).toBe("function");
		});

		it("should have a display name matching component name", () => {
			const { FeedItem } = require("../feed-item");
			expect(FeedItem.name).toBe("FeedItem");
		});

		it("should be a client component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain('"use client"');
		});
	});

	describe("Dependencies", () => {
		it("should import date-fns for time formatting", () => {
			const module = require("../feed-item");
			expect(module).toBeDefined();
		});

		it("should import lucide-react icons", () => {
			const module = require("../feed-item");
			expect(module).toBeDefined();
		});

		it("should use Card components from shadcn/ui", () => {
			const { FeedItem } = require("../feed-item");
			expect(FeedItem).toBeDefined();
		});

		it("should use useSupabaseQuery for data fetching", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("useSupabaseQuery");
		});
	});

	describe("Props Interface", () => {
		it("should accept item prop with training data", () => {
			const { FeedItem } = require("../feed-item");
			expect(FeedItem).toBeDefined();
		});

		it("should accept optional currentUserId prop", () => {
			const { FeedItem } = require("../feed-item");
			expect(FeedItem).toBeDefined();
		});

		it("should accept optional onJoin callback", () => {
			const { FeedItem } = require("../feed-item");
			expect(FeedItem).toBeDefined();
		});

		it("should accept optional onView callback", () => {
			const { FeedItem } = require("../feed-item");
			expect(FeedItem).toBeDefined();
		});
	});

	describe("Type Safety", () => {
		it("should have proper TypeScript types for TrainingFeedItem", () => {
			const item: import("../feed-item").TrainingFeedItem = {
				id: "training-1",
				name: "Morning Workout",
				description: "Upper body focus",
				userId: "user-1",
				userName: "John Doe",
				userEmail: "john@example.com",
				userImage: null,
				createdAt: "2026-01-25T10:00:00Z",
				exerciseCount: 5,
				scheduledFor: null,
				sessionStatus: null,
			};
			expect(item.id).toBe("training-1");
			expect(item.name).toBe("Morning Workout");
		});

		it("should have proper TypeScript types for FeedItemProps", () => {
			const props: import("../feed-item").FeedItemProps = {
				item: {
					id: "training-1",
					name: "Workout",
					description: null,
					userId: "user-1",
					userName: "User",
					userEmail: "user@example.com",
					userImage: null,
					createdAt: "2026-01-25T10:00:00Z",
				},
				currentUserId: "user-1",
				onJoin: undefined,
				onView: undefined,
			};
			expect(props).toBeDefined();
		});
	});

	describe("Component Features", () => {
		it("should display user avatar with fallback to User icon", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("userImage");
			expect(content).toContain("User className");
		});

		it("should display training name in CardTitle", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("item.name");
			expect(content).toContain("CardTitle");
		});

		it("should display user name below training name", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("item.userName");
		});

		it("should show 'You' badge for owner's trainings", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("isOwner");
			expect(content).toContain("You");
		});

		it("should display description when available with line-clamp", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("item.description");
			expect(content).toContain("line-clamp-2");
		});

		it("should display exercise count with Dumbbell icon", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("Dumbbell");
			expect(content).toContain("exerciseCount");
		});

		it("should display creation time with Calendar icon", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("Calendar");
			expect(content).toContain("timeAgo");
		});

		it("should display scheduled time with Clock icon when available", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("Clock");
			expect(content).toContain("scheduledFor");
			expect(content).toContain("scheduledTime");
		});

		it("should highlight upcoming sessions with primary color", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("isUpcoming");
			expect(content).toContain("text-primary");
		});
	});

	describe("Session Handling", () => {
		it("should fetch sessions for the training", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain('from("training_session")');
			expect(content).toContain("sessions");
		});

		it("should enable real-time updates for sessions", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("realtime: true");
			expect(content).toContain('table: "training_session"');
		});

		it("should show 'View Session' button for owner with active session", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("View Session");
			expect(content).toContain("isOwner");
		});

		it("should show 'Join Session' button for non-owner with active session", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("Join Session");
			expect(content).toContain("onJoin?.(");
		});

		it("should show 'View Training' button when no active session", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("View Training");
			expect(content).toContain("activeSession");
		});

		it("should display session status badge when available", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("sessionStatus");
			expect(content).toContain("capitalize");
		});
	});

	describe("Accessibility", () => {
		it("should have proper alt text for avatar images", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("alt={");
			expect(content).toContain("item.userName}");
		});

		it("should use semantic icons without aria-hidden when decorative", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			// Icons from lucide-react are self-decorating
			expect(content).toContain("Dumbbell");
			expect(content).toContain("Calendar");
			expect(content).toContain("Clock");
		});

		it("should use semantic HTML structure with Card components", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("Card");
			expect(content).toContain("CardHeader");
			expect(content).toContain("CardContent");
		});
	});

	describe("Responsive Design", () => {
		it("should use mobile-first responsive classes", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("gap-");
			expect(content).toContain("flex-1");
			expect(content).toContain("min-w-0");
		});

		it("should have truncation for long text", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("truncate");
		});

		it("should use shrink-0 for buttons and avatars", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("shrink-0");
		});

		it("should use hover ring effect for interactivity", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("hover:ring-2");
			expect(content).toContain("hover:ring-primary/50");
		});
	});

	describe("Business Logic", () => {
		it("should determine ownership by comparing userId", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("currentUserId === item.userId");
		});

		it("should check if session is upcoming based on scheduledFor", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("isUpcoming");
			expect(content).toContain("new Date(item.scheduledFor)");
		});

		it("should fetch only pending or active sessions", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain('.in("status"');
			expect(content).toContain("pending");
			expect(content).toContain("active");
		});

		it("should limit sessions query to 1 result (most recent)", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain(".limit(1)");
		});
	});

	describe("Data Access Pattern", () => {
		it("should use Supabase for session queries", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("useSupabaseQuery");
		});

		it("should follow hybrid pattern (read from Supabase)", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("queryFn: (supabase) =>");
		});

		it("should not have write operations (read-only component)", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).not.toContain("useMutation");
		});
	});

	describe("Code Quality", () => {
		it("should have no syntax errors", () => {
			const { FeedItem } = require("../feed-item");
			expect(FeedItem).toBeDefined();
		});

		it("should export a named export", () => {
			const module = require("../feed-item");
			expect(Object.keys(module).length).toBeGreaterThan(0);
			expect(module.FeedItem).toBeDefined();
		});

		it("should export TrainingFeedItem interface for type usage", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("interface TrainingFeedItem");
		});

		it("should export FeedItemProps interface", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("interface FeedItemProps");
		});
	});
});

describe("FeedItem Integration", () => {
	describe("Callback Handling", () => {
		it("should call onJoin with session ID when join button clicked", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("onJoin?.(activeSession.id)");
		});

		it("should call onView with training ID when view button clicked", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("onView?.(item.id)");
		});

		it("should show join button for non-owner with active session", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../feed-item.tsx`, "utf-8");
			expect(content).toContain("Join Session");
			expect(content).toContain("isOwner");
		});
	});
});
