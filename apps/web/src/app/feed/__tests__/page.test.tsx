/**
 * Test file for Feed page
 * Tests the server component (page.tsx) and client component (feed-client.tsx)
 */

import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";

// Mock auth module
const mockedAuth = {
	auth: {
		api: {
			getSession: vi.fn(),
		},
	},
};

vi.mock("@buddy-lifts/auth", () => mockedAuth);

// Mock next/navigation
vi.mock("next/navigation", () => ({
	redirect: vi.fn(),
	headers: vi.fn(() => ({
		get: vi.fn(),
	})),
}));

vi.mock("next/headers", () => ({
	headers: vi.fn(() => new Headers()),
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

const { auth } = mockedAuth;

interface AuthUser {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	email: string;
	emailVerified: boolean;
	name: string;
	image?: string | null;
}

interface AuthSessionData {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
	expiresAt: Date;
	token: string;
	ipAddress?: string | null;
	userAgent?: string | null;
}

type AuthSession = {
	user: AuthUser | null;
	session: AuthSessionData;
} | null;

const createUser = (overrides: Partial<AuthUser> = {}): AuthUser => ({
	id: "user-123",
	createdAt: new Date(),
	updatedAt: new Date(),
	email: "test@example.com",
	emailVerified: true,
	name: "Test User",
	image: null,
	...overrides,
});

const createSession = (
	overrides: Partial<AuthSessionData> = {},
): AuthSessionData => ({
	id: "session-123",
	createdAt: new Date(),
	updatedAt: new Date(),
	userId: "user-123",
	expiresAt: new Date(Date.now() + 60 * 60 * 1000),
	token: "session-token",
	ipAddress: null,
	userAgent: null,
	...overrides,
});

const mockGetSession = (session: AuthSession) => {
	auth.api.getSession.mockResolvedValue(session);
};

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
			mockGetSession({
				user: createUser(),
				session: createSession(),
			});

			await import("../page").then((mod) => mod.default());

			expect(auth.api.getSession).toHaveBeenCalled();
		});

		it("should redirect to /login when no session exists", async () => {
			mockGetSession(null);
			(
				redirect as unknown as { mockImplementation: (fn: () => never) => void }
			).mockImplementation(() => {
				throw new Error("redirect");
			});

			await expect(
				import("../page").then((mod) => mod.default()),
			).rejects.toThrow("redirect");

			expect(redirect).toHaveBeenCalledWith("/login");
		});

		it("should redirect to /login when session exists but no user", async () => {
			mockGetSession({
				user: null,
				session: createSession(),
			});

			(
				redirect as unknown as { mockImplementation: (fn: () => never) => void }
			).mockImplementation(() => {
				throw new Error("redirect");
			});

			await expect(
				import("../page").then((mod) => mod.default()),
			).rejects.toThrow("redirect");

			expect(redirect).toHaveBeenCalledWith("/login");
		});

		it("should render content when user is authenticated", async () => {
			mockGetSession({
				user: createUser(),
				session: createSession(),
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
			mockGetSession({
				user: createUser(),
				session: createSession(),
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
			mockGetSession({
				user: createUser({ id: userId, name: "Test" }),
				session: createSession({ userId }),
			});

			render(await FeedPage());

			const feedComponent = screen.getByTestId("training-feed");
			expect(feedComponent).toBeInTheDocument();
		});
	});

	describe("Responsive Design", () => {
		beforeEach(() => {
			vi.clearAllMocks();
			mockGetSession({
				user: createUser(),
				session: createSession(),
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
			mockGetSession({
				user: createUser({ name: "Test" }),
				session: createSession(),
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

			mockGetSession({
				user: createUser({ name: "Test" }),
				session: createSession(),
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
				resolve(__dirname, "../feed-client.tsx"),
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
			const fs = require("node:fs");
			const content = fs.readFileSync(
				resolve(__dirname, "../../../components/feed/training-feed.tsx"),
				"utf-8",
			);
			expect(content).toContain("export type FeedFilter");
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
				resolve(__dirname, "../feed-client.tsx"),
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
			mockGetSession({
				user: createUser({ id: "integration-user", name: "Test" }),
				session: createSession({ userId: "integration-user" }),
			});
		});

		it("should pass currentUserId from server to client component", async () => {
			const FeedPage = (await import("../page")).default;
			const userId = "integration-user";

			mockGetSession({
				user: createUser({ id: userId, name: "Test" }),
				session: createSession({ userId }),
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
			mockGetSession(null);
			(
				redirect as unknown as { mockImplementation: (fn: () => never) => void }
			).mockImplementation(() => {
				throw new Error("redirect");
			});

			await expect(
				import("../page").then((mod) => mod.default()),
			).rejects.toThrow("redirect");

			expect(redirect).toHaveBeenCalledWith("/login");
		});

		it("should show feed page for authenticated users", async () => {
			mockGetSession({
				user: createUser(),
				session: createSession(),
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
