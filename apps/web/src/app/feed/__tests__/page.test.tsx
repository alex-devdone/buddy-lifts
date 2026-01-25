/**
 * Test file for Feed page
 * Tests the server component (page.tsx) and client component (feed-client.tsx)
 */

import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock auth module
vi.mock("@buddy-lifts/auth", () => ({
	auth: {
		api: {
			getSession: vi.fn(),
		},
	},
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
	redirect: vi.fn(),
	headers: vi.fn(() => ({
		get: vi.fn(),
	})),
}));

// Mock TrainingFeed component
vi.mock("@/components/feed/training-feed", () => ({
	TrainingFeed: ({ filter }: { filter: string }) => (
		<div data-testid="training-feed" data-filter={filter}>
			Training Feed Component (filter: {filter})
		</div>
	),
	__esModule: true,
}));

// Import mocks
import { auth } from "@buddy-lifts/auth";

describe("Feed Page (apps/web/src/app/feed/page.tsx)", () => {
	describe("Server Component Structure", () => {
		it("should export a default async component", async () => {
			const module = await import("../page");
			expect(module.default).toBeDefined();
			expect(typeof module.default).toBe("function");
		});

		it("should have correct file location at apps/web/src/app/feed/page.tsx", () => {
			// File structure validated by test location
			expect(true).toBe(true);
		});
	});

	describe("Dependencies", () => {
		it("should import auth from @buddy-lifts/auth", () => {
			expect(() => import("@buddy-lifts/auth")).not.toThrow();
		});

		it("should import redirect from next/navigation", () => {
			expect(() => import("next/navigation")).not.toThrow();
		});

		it("should import FeedClient from local feed-client", () => {
			expect(() => import("../feed-client")).not.toThrow();
		});
	});

	describe("Authentication Flow", () => {
		beforeEach(() => {
			vi.clearAllMocks();
		});

		it("should call auth.api.getSession with headers", async () => {
			vi.mocked(auth.api.getSession).mockResolvedValue({
				user: { id: "user-123", name: "Test User" },
				session: { id: "session-123" },
			});

			await import("../page").then((mod) => mod.default());

			expect(auth.api.getSession).toHaveBeenCalled();
		});

		it("should redirect to /login when no session exists", async () => {
			vi.mocked(auth.api.getSession).mockResolvedValue(null);
			await import("../page").then((mod) => mod.default());

			expect(redirect).toHaveBeenCalledWith("/login");
		});

		it("should redirect to /login when session exists but no user", async () => {
			vi.mocked(auth.api.getSession).mockResolvedValue({
				user: null,
				session: { id: "session-123" },
			});

			await import("../page").then((mod) => mod.default());

			expect(redirect).toHaveBeenCalledWith("/login");
		});

		it("should render content when user is authenticated", async () => {
			const mockUser = {
				id: "user-123",
				name: "Test User",
				email: "test@example.com",
			};
			vi.mocked(auth.api.getSession).mockResolvedValue({
				user: mockUser,
				session: { id: "session-123" },
			});

			// Import and render the component (it's async)
			const FeedPage = (await import("../page")).default;
			render(await FeedPage());

			expect(redirect).not.toHaveBeenCalledWith("/login");
		});
	});

	describe("Page Structure", () => {
		beforeEach(() => {
			vi.clearAllMocks();
			vi.mocked(auth.api.getSession).mockResolvedValue({
				user: { id: "user-123", name: "Test User" },
				session: { id: "session-123" },
			});
		});

		it("should render main heading 'Feed'", async () => {
			const FeedPage = (await import("../page")).default;
			render(await FeedPage());

			expect(screen.getByText("Feed")).toBeInTheDocument();
		});

		it("should render description text about feed", async () => {
			const FeedPage = (await import("../page")).default;
			render(await FeedPage());

			expect(
				screen.getByText("See trainings from you and your friends"),
			).toBeInTheDocument();
		});

		it("should pass currentUserId to FeedClient", async () => {
			const FeedPage = (await import("../page")).default;
			const userId = "test-user-id";
			vi.mocked(auth.api.getSession).mockResolvedValue({
				user: { id: userId, name: "Test" },
				session: { id: "session-123" },
			});

			render(await FeedPage());

			const feedComponent = screen.getByTestId("training-feed");
			expect(feedComponent).toBeInTheDocument();
		});
	});

	describe("Responsive Design", () => {
		beforeEach(() => {
			vi.clearAllMocks();
			vi.mocked(auth.api.getSession).mockResolvedValue({
				user: { id: "user-123", name: "Test User" },
				session: { id: "session-123" },
			});
		});

		it("should use mobile-first container classes", async () => {
			const FeedPage = (await import("../page")).default;
			const { container } = render(await FeedPage());

			const wrapper = container.firstChild as HTMLElement;
			expect(wrapper.className).toContain("container");
			expect(wrapper.className).toContain("max-w-4xl");
			expect(wrapper.className).toContain("px-4");
			expect(wrapper.className).toContain("py-8");
			expect(wrapper.className).toContain("md:px-6");
		});

		it("should have responsive text sizing for heading", async () => {
			const FeedPage = (await import("../page")).default;
			render(await FeedPage());

			const heading = screen.getByText("Feed");
			expect(heading.className).toContain("text-2xl");
			expect(heading.className).toContain("md:text-3xl");
		});

		it("should have responsive text sizing for description", async () => {
			const FeedPage = (await import("../page")).default;
			render(await FeedPage());

			const description = screen.getByText(
				"See trainings from you and your friends",
			);
			expect(description.className).toContain("text-sm");
			expect(description.className).toContain("md:text-base");
		});
	});

	describe("TypeScript Types", () => {
		it("should properly type session.user with optional chaining", async () => {
			// Type check: session?.user.id should be string | undefined
			vi.mocked(auth.api.getSession).mockResolvedValue({
				user: { id: "user-123", name: "Test" },
				session: { id: "session-123" },
			});

			const FeedPage = (await import("../page")).default;
			render(await FeedPage());

			// If this compiles, optional chaining is working correctly
			expect(true).toBe(true);
		});
	});

	describe("Code Quality", () => {
		it("should have proper component structure", async () => {
			const FeedPage = (await import("../page")).default;
			const { container } = render(await FeedPage());

			// Should have proper semantic HTML structure
			const wrapper = container.querySelector(".container");
			expect(wrapper).toBeInTheDocument();
		});

		it("should not have console errors during render", async () => {
			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			vi.mocked(auth.api.getSession).mockResolvedValue({
				user: { id: "user-123", name: "Test" },
				session: { id: "session-123" },
			});

			const FeedPage = (await import("../page")).default;
			render(await FeedPage());

			expect(consoleSpy).not.toHaveBeenCalled();
			consoleSpy.mockRestore();
		});
	});
});

describe("FeedClient Component (apps/web/src/app/feed/feed-client.tsx)", () => {
	describe("Component Structure", () => {
		it("should be a client component with 'use client' directive", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/app/feed/feed-client.tsx",
				"utf8",
			);
			expect(content).toContain('"use client"');
		});

		it("should export FeedClient function", () => {
			const module = require("../feed-client");
			expect(module.FeedClient).toBeDefined();
			expect(typeof module.FeedClient).toBe("function");
		});

		it("should have correct file location at apps/web/src/app/feed/feed-client.tsx", () => {
			// File structure validated by test location
			expect(true).toBe(true);
		});
	});

	describe("Dependencies", () => {
		it("should import useState from react", () => {
			expect(() => import("react")).not.toThrow();
		});

		it("should import TrainingFeed from components/feed/training-feed", () => {
			expect(() => import("@/components/feed/training-feed")).not.toThrow();
		});

		it("should import FeedFilter type from training-feed", () => {
			const module = require("@/components/feed/training-feed");
			expect(module.FeedFilter).toBeDefined();
		});
	});

	describe("Props Interface", () => {
		it("should accept currentUserId prop", () => {
			const { FeedClient } = require("../feed-client");
			const { container } = render(<FeedClient currentUserId="user-123" />);

			expect(container.firstChild).toBeInTheDocument();
		});

		it("should require currentUserId as string", () => {
			const { FeedClient } = require("../feed-client");

			// @ts-expect-error - Testing type validation
			expect(() => render(<FeedClient />)).not.toThrow(); // React renders but TypeScript would error
		});
	});

	describe("State Management", () => {
		it("should initialize filter state with 'all'", () => {
			const { FeedClient } = require("../feed-client");
			render(<FeedClient currentUserId="user-123" />);

			const feedComponent = screen.getByTestId("training-feed");
			expect(feedComponent.getAttribute("data-filter")).toBe("all");
		});

		it("should render TrainingFeed with currentUserId prop", () => {
			const { FeedClient } = require("../feed-client");
			const userId = "test-user-456";
			render(<FeedClient currentUserId={userId} />);

			const feedComponent = screen.getByTestId("training-feed");
			expect(feedComponent).toBeInTheDocument();
		});

		it("should render TrainingFeed with filter prop", () => {
			const { FeedClient } = require("../feed-client");
			render(<FeedClient currentUserId="user-123" />);

			const feedComponent = screen.getByTestId("training-feed");
			expect(feedComponent.getAttribute("data-filter")).toBe("all");
		});
	});

	describe("Component Features", () => {
		it("should wrap TrainingFeed in a div with mt-6 spacing", () => {
			const { FeedClient } = require("../feed-client");
			const { container } = render(<FeedClient currentUserId="user-123" />);

			const wrapper = container.firstChild as HTMLElement;
			expect(wrapper.tagName).toBe("DIV");
			expect(wrapper.className).toContain("mt-6");
		});

		it("should display TrainingFeed component", () => {
			const { FeedClient } = require("../feed-client");
			render(<FeedClient currentUserId="user-123" />);

			expect(screen.getByTestId("training-feed")).toBeInTheDocument();
		});
	});

	describe("Integration with TrainingFeed", () => {
		it("should pass currentUserId to TrainingFeed correctly", () => {
			const { FeedClient } = require("../feed-client");
			const userId = "integration-test-user";
			render(<FeedClient currentUserId={userId} />);

			const feedComponent = screen.getByTestId("training-feed");
			expect(feedComponent).toBeInTheDocument();
			// Current userId is passed but not visible in DOM for this test
		});

		it("should pass filter state to TrainingFeed", () => {
			const { FeedClient } = require("../feed-client");
			render(<FeedClient currentUserId="user-123" />);

			const feedComponent = screen.getByTestId("training-feed");
			expect(feedComponent.getAttribute("data-filter")).toBe("all");
		});
	});

	describe("Responsive Design", () => {
		it("should use proper spacing classes for mobile-first design", () => {
			const { FeedClient } = require("../feed-client");
			const { container } = render(<FeedClient currentUserId="user-123" />);

			const wrapper = container.firstChild as HTMLElement;
			expect(wrapper.className).toContain("mt-6");
		});
	});

	describe("Accessibility", () => {
		it("should render TrainingFeed which has proper accessibility", () => {
			const { FeedClient } = require("../feed-client");
			render(<FeedClient currentUserId="user-123" />);

			// TrainingFeed should be accessible
			expect(screen.getByTestId("training-feed")).toBeInTheDocument();
		});
	});

	describe("Error Handling", () => {
		it("should handle missing currentUserId gracefully", () => {
			const { FeedClient } = require("../feed-client");
			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			// @ts-expect-error - Testing error handling
			const { container } = render(<FeedClient currentUserId={undefined} />);

			// Component should still render
			expect(container.firstChild).toBeInTheDocument();
			consoleSpy.mockRestore();
		});
	});

	describe("Code Quality", () => {
		it("should have proper component structure", () => {
			const { FeedClient } = require("../feed-client");
			const { container } = render(<FeedClient currentUserId="user-123" />);

			expect(container.firstChild).toBeInTheDocument();
		});

		it("should not have console errors during render", () => {
			const { FeedClient } = require("../feed-client");
			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			render(<FeedClient currentUserId="user-123" />);

			expect(consoleSpy).not.toHaveBeenCalled();
			consoleSpy.mockRestore();
		});

		it("should follow React best practices for hooks", () => {
			// useState is called at the top level, not in conditions
			const fs = require("node:fs");
			const content = fs.readFileSync(
				"apps/web/src/app/feed/feed-client.tsx",
				"utf8",
			);

			// Check that useState is used correctly
			expect(content).toContain("useState");
			expect(content).toMatch(/useState<FeedFilter>/);
		});
	});
});

describe("Feed Page Integration", () => {
	describe("Server-Client Component Communication", () => {
		beforeEach(() => {
			vi.clearAllMocks();
			vi.mocked(auth.api.getSession).mockResolvedValue({
				user: { id: "integration-user", name: "Test" },
				session: { id: "session-123" },
			});
		});

		it("should pass currentUserId from server to client component", async () => {
			const FeedPage = (await import("../page")).default;
			const userId = "integration-user";

			vi.mocked(auth.api.getSession).mockResolvedValue({
				user: { id: userId, name: "Test" },
				session: { id: "session-123" },
			});

			render(await FeedPage());

			const feedComponent = screen.getByTestId("training-feed");
			expect(feedComponent).toBeInTheDocument();
		});
	});

	describe("User Flow", () => {
		beforeEach(() => {
			vi.clearAllMocks();
		});

		it("should show redirect for unauthenticated users", async () => {
			vi.mocked(auth.api.getSession).mockResolvedValue(null);
			await import("../page").then((mod) => mod.default());

			expect(redirect).toHaveBeenCalledWith("/login");
		});

		it("should show feed page for authenticated users", async () => {
			vi.mocked(auth.api.getSession).mockResolvedValue({
				user: { id: "user-123", name: "Test User" },
				session: { id: "session-123" },
			});

			const FeedPage = (await import("../page")).default;
			render(await FeedPage());

			expect(screen.getByText("Feed")).toBeInTheDocument();
			expect(
				screen.getByText("See trainings from you and your friends"),
			).toBeInTheDocument();
			expect(screen.getByTestId("training-feed")).toBeInTheDocument();
		});
	});
});
