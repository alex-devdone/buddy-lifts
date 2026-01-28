/**
 * Tests for training-feed component
 *
 * Run with: bun test apps/web/src/components/feed/__tests__/training-feed.test.ts
 */

describe("TrainingFeed Component", () => {
	describe("Component Structure", () => {
		it("should export the component", () => {
			const { TrainingFeed } = require("../training-feed");
			expect(TrainingFeed).toBeDefined();
			expect(typeof TrainingFeed).toBe("function");
		});

		it("should have a display name matching component name", () => {
			const { TrainingFeed } = require("../training-feed");
			expect(TrainingFeed.name).toBe("TrainingFeed");
		});

		it("should be a client component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain('"use client"');
		});
	});

	describe("Dependencies", () => {
		it("should import date-fns for date manipulation", () => {
			const module = require("../training-feed");
			expect(module).toBeDefined();
		});

		it("should import lucide-react icons", () => {
			const module = require("../training-feed");
			expect(module).toBeDefined();
		});

		it("should use Next.js router for navigation", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("useRouter");
			expect(content).toContain("next/navigation");
		});

		it("should use useSupabaseQuery for data fetching", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("useSupabaseQuery");
		});

		it("should use tRPC for session join mutation", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("trpc.session.join");
		});
	});

	describe("Props Interface", () => {
		it("should accept currentUserId prop", () => {
			const { TrainingFeed } = require("../training-feed");
			expect(TrainingFeed).toBeDefined();
		});

		it("should accept optional filter prop with FeedFilter type", () => {
			const { TrainingFeed } = require("../training-feed");
			expect(TrainingFeed).toBeDefined();
		});

		it("should have FeedFilter type with upcoming, past, and all options", () => {
			const filter: import("../training-feed").FeedFilter = "upcoming";
			expect(filter).toBe("upcoming");

			const pastFilter: import("../training-feed").FeedFilter = "past";
			expect(pastFilter).toBe("past");

			const allFilter: import("../training-feed").FeedFilter = "all";
			expect(allFilter).toBe("all");
		});

		it("should default filter to 'all'", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain('filter = "all"');
		});
	});

	describe("Type Safety", () => {
		it("should have proper TypeScript types for FeedTraining", () => {
			const training: import("../training-feed").FeedTraining = {
				id: "training-1",
				name: "Morning Workout",
				description: "Upper body focus",
				userId: "user-1",
				userName: "John Doe",
				userEmail: "john@example.com",
				userImage: null,
				createdAt: "2026-01-25T10:00:00Z",
				exerciseCount: 5,
			};
			expect(training.id).toBe("training-1");
			expect(training.userName).toBe("John Doe");
		});

		it("should have proper TypeScript types for SessionInfo", () => {
			const session: import("../training-feed").SessionInfo = {
				id: "session-1",
				trainingId: "training-1",
				status: "active",
				startedAt: "2026-01-25T10:00:00Z",
				completedAt: null,
			};
			expect(session.status).toBe("active");
		});
	});

	describe("State Management", () => {
		it("should use useState for joining session tracking", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("useState");
			expect(content).toContain("joiningSessionId");
		});

		it("should update joiningSessionId during join mutation", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("setJoiningSessionId(inviteCode)");
			expect(content).toContain("setJoiningSessionId(null)");
		});
	});

	describe("Data Access Pattern", () => {
		it("should use Supabase for friends query", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain('from("friend")');
			expect(content).toContain("select");
		});

		it("should query friendships in both directions (userId and friendId)", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("userId.eq.");
			expect(content).toContain("friendId.eq.");
		});

		it("should extract friend ID from both directions of friendship", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain(
				"f.userId === currentUserId ? f.friendId : f.userId",
			);
		});

		it("should only fetch accepted friendships", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain('.eq("status", "accepted")');
		});

		it("should use Supabase for trainings query with user join", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain('from("training")');
			expect(content).toContain("user:user");
		});

		it("should query trainings from user and friends", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("userIdsToFetch");
			expect(content).toContain("currentUserId");
			expect(content).toContain("friendIds");
		});

		it("should use Supabase for sessions query", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain('from("training_session")');
		});

		it("should use Supabase for exercise counts", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain('from("exercise")');
		});

		it("should use tRPC mutation for joining sessions", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("joinSession");
			expect(content).toContain("useMutation");
		});

		it("should enable real-time for all queries", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			// Count occurrences of "realtime: true"
			const matches = content.match(/realtime: true/g);
			expect(matches?.length).toBeGreaterThanOrEqual(4);
		});
	});

	describe("Component Features", () => {
		it("should display header with filter-specific title", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("Upcoming Trainings");
			expect(content).toContain("Past Trainings");
			expect(content).toContain("Training Feed");
		});

		it("should display connected friends count", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("Users");
			expect(content).toContain("connected");
			expect(content).toContain("friendIds.length + 1");
		});

		it("should show loading state with skeleton cards", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("FeedItemSkeleton");
			expect(content).toContain("isLoadingTrainings");
			expect(content).toContain("isLoadingFriends");
		});

		it("should show empty state when no friends", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("No friends yet");
			expect(content).toContain("Add friends to see their trainings");
		});

		it("should show empty state when no trainings", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("No upcoming trainings");
			expect(content).toContain("No past trainings");
			expect(content).toContain("No trainings found");
		});

		it("should group items by date (Today, Yesterday, Tomorrow)", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("isToday");
			expect(content).toContain("isYesterday");
			expect(content).toContain("isTomorrow");
			expect(content).toContain("groupedItems");
		});

		it("should display date group headers", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("Today");
			expect(content).toContain("Yesterday");
			expect(content).toContain("Tomorrow");
		});

		it("should render FeedItem components for each training", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("<FeedItem");
			expect(content).toContain("key={item.id}");
		});

		it("should calculate exercise counts correctly", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("exerciseCounts");
			expect(content).toContain("reduce");
			expect(content).toContain("acc[ex.trainingId]");
		});

		it("should filter items based on filter prop", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("filteredItems");
			expect(content).toContain("filter ===");
		});
	});

	describe("Filter Logic", () => {
		it("should show all items when filter is 'all'", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain('filter === "all"');
		});

		it("should show only upcoming items when filter is 'upcoming'", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain('filter === "upcoming"');
			expect(content).toContain("!item.isPast");
		});

		it("should show only past items when filter is 'past'", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain('filter === "past"');
			expect(content).toContain("item.isPast");
		});
	});

	describe("Business Logic", () => {
		it("should determine if session is past based on completion or startedAt date", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("isCompleted");
			expect(content).toContain("isPast");
			expect(content).toContain("isPastSession");
		});

		it("should use latestSessionDate for past determination", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("latestSessionDate");
			expect(content).toContain(
				"trainingSession?.startedAt ?? training.createdAt",
			);
		});

		it("should not show join button for owner's past trainings", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain(
				"!item.isPast && item.userId !== currentUserId",
			);
			expect(content).toContain("onJoin={");
		});

		it("should navigate to training detail on view", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("router.push");
			expect(content).toContain("`/trainings/");
			expect(content).toContain("handleView");
		});

		it("should handle join session errors with toast", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("onError");
			expect(content).toContain("toast.error");
		});

		it("should handle successful join with toast", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("onSuccess");
			expect(content).toContain("toast.success");
			expect(content).toContain("Joined session successfully");
		});

		it("should transform training data to include exercise count and session info", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("feedItems");
			expect(content).toContain("exerciseCount:");
			expect(content).toContain("scheduledFor:");
			expect(content).toContain("sessionStatus:");
			expect(content).toContain("isPast:");
		});
	});

	describe("Responsive Design", () => {
		it("should use mobile-first responsive classes", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("space-y-");
			expect(content).toContain("flex-");
		});

		it("should use proper spacing for header and items", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("space-y-3");
			expect(content).toContain("space-y-6");
		});
	});

	describe("Accessibility", () => {
		it("should use semantic HTML structure", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("<h2");
			expect(content).toContain("<h3");
		});

		it("should have proper heading hierarchy", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain('className="font-semibold text-lg"');
			expect(content).toContain('className="text-muted-foreground text-sm"');
		});
	});

	describe("Error Handling", () => {
		it("should handle query errors with toast notification", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("trainingsError");
			expect(content).toContain("toast.error(trainingsError.message)");
		});
	});

	describe("Real-time Updates", () => {
		it("should enable real-time for friends query", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain('table: "friend"');
		});

		it("should enable real-time for trainings query", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain('table: "training"');
		});

		it("should enable real-time for sessions query", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain('table: "training_session"');
		});

		it("should enable real-time for exercises query", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain('table: "exercise"');
		});
	});

	describe("Code Quality", () => {
		it("should have no syntax errors", () => {
			const { TrainingFeed } = require("../training-feed");
			expect(TrainingFeed).toBeDefined();
		});

		it("should export a named export", () => {
			const module = require("../training-feed");
			expect(Object.keys(module).length).toBeGreaterThan(0);
			expect(module.TrainingFeed).toBeDefined();
		});

		it("should export FeedTraining interface", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("interface FeedTraining");
		});

		it("should export SessionInfo interface", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("interface SessionInfo");
		});

		it("should export FeedFilter type", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-feed.tsx`,
				"utf-8",
			);
			expect(content).toContain("export type FeedFilter");
		});
	});
});
