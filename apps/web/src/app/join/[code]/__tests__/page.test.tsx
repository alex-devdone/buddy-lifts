/**
 * Tests for Join Page
 *
 * Run with: bun test apps/web/src/app/join/[code]/__tests__/page.test.tsx
 *
 * Tests the invite link handler page at /join/[code]
 * This page handles the flow for joining a training session via invite link.
 *
 * Server Component (/join/[code]/page.tsx):
 * - Checks authentication and redirects to login with invite code if not authenticated
 * - Renders JoinPageClient component for authenticated users
 *
 * Client Component (join-page-client.tsx):
 * - Automatically attempts to join session via tRPC mutation
 * - Shows loading state during join
 * - Shows error state with helpful messages on failure
 * - Redirects to active session page on success
 */

// Mock dependencies
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
	}),
	redirect: vi.fn(),
}));

vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

// Mock tRPC
vi.mock("@/utils/trpc", () => ({
	trpc: {
		session: {
			join: {
				useMutation: vi.fn(() => ({
					mutate: vi.fn(),
					isPending: false,
					isError: false,
					isSuccess: false,
					error: null,
					data: null,
				})),
			},
		},
	},
}));

describe("Join Page - Server Component", () => {
	const fs = require("node:fs");
	const pageContent = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
	const clientContent = fs.readFileSync(
		`${__dirname}/../join-page-client.tsx`,
		"utf-8",
	);

	describe("Component Structure", () => {
		it("should export the page component as default async function", () => {
			expect(pageContent).toContain("export default async function JoinPage");
		});

		it("should export JoinPageClient as named export", () => {
			expect(clientContent).toContain("export function JoinPageClient");
		});
	});

	describe("Dependencies", () => {
		it("should import auth from buddy-lifts/auth", () => {
			expect(pageContent).toContain('import { auth } from "@buddy-lifts/auth"');
		});

		it("should import redirect from next/navigation", () => {
			expect(pageContent).toContain("redirect");
			expect(pageContent).toContain("next/navigation");
		});

		it("should import JoinPageClient component", () => {
			expect(pageContent).toContain("./join-page-client");
		});

		it("should import useRouter from next/navigation in client component", () => {
			expect(clientContent).toContain("useRouter");
			expect(clientContent).toContain("next/navigation");
		});

		it("should import toast from sonner", () => {
			expect(clientContent).toContain("sonner");
			expect(clientContent).toContain("toast");
		});

		it("should import trpc from utils/trpc", () => {
			expect(clientContent).toContain("trpc");
			expect(clientContent).toContain("@/utils/trpc");
		});

		it("should import UI components", () => {
			expect(clientContent).toContain("@/components/ui/button");
			expect(clientContent).toContain("@/components/ui/card");
		});

		it("should import lucide-react icons", () => {
			expect(clientContent).toContain("AlertCircle");
			expect(clientContent).toContain("Dumbbell");
			expect(clientContent).toContain("Loader2");
			expect(clientContent).toContain("Users");
		});
	});

	describe("Authentication Flow - Server Component", () => {
		it("should check for session using auth.api.getSession", () => {
			expect(pageContent).toContain("auth.api.getSession");
			expect(pageContent).toContain("headers: await headers()");
		});

		it("should redirect to login with invite code if no session exists", () => {
			expect(pageContent).toContain("if (!session?.user)");
			expect(pageContent).toContain("redirect");
			expect(pageContent).toContain("/login?redirect=");
		});

		it("should extract inviteCode from params", () => {
			expect(pageContent).toContain(
				"const { code: inviteCode } = await params;",
			);
		});

		it("should read access from searchParams for redirect handling", () => {
			expect(pageContent).toContain("const { access } = await searchParams");
		});

		it("should render JoinPageClient component when authenticated", () => {
			expect(pageContent).toContain("<JoinPageClient");
			expect(pageContent).toContain("inviteCode={inviteCode}");
		});
	});

	describe("Page Structure", () => {
		it("should use centered container with flex", () => {
			expect(pageContent).toContain("flex");
			expect(pageContent).toContain("items-center");
			expect(pageContent).toContain("justify-center");
		});

		it("should use responsive container classes", () => {
			expect(pageContent).toContain("container");
			expect(pageContent).toContain("min-h-screen");
			expect(pageContent).toContain("px-4");
		});
	});

	describe("TypeScript Types - Server Component", () => {
		it("should define PageProps interface", () => {
			expect(pageContent).toContain("interface PageProps");
			expect(pageContent).toContain("params: Promise<{ code: string }>");
			expect(pageContent).toContain(
				"searchParams: Promise<{ access?: string }>",
			);
		});

		it("should properly type the async params", () => {
			expect(pageContent).toContain("await params");
		});
	});

	describe("Code Quality - Server Component", () => {
		it("should include comments explaining the flow", () => {
			expect(pageContent).toContain("*");
			expect(pageContent).toContain("Handles invite link flow");
		});

		it("should handle both server and client components separation", () => {
			// Server component should NOT have "use client"
			expect(pageContent).not.toContain('"use client"');
			// Client component should have "use client"
			expect(clientContent).toContain('"use client"');
		});
	});
});

describe("JoinPageClient - Client Component", () => {
	const fs = require("node:fs");
	const content = fs.readFileSync(
		`${__dirname}/../join-page-client.tsx`,
		"utf-8",
	);

	describe("Props Interface", () => {
		it("should have inviteCode as string prop", () => {
			expect(content).toContain("inviteCode: string");
		});

		it("should have currentUserId as string prop", () => {
			expect(content).toContain("currentUserId: string");
		});

		it("should define JoinPageClientProps interface", () => {
			expect(content).toContain("interface JoinPageClientProps");
		});
	});

	describe("State Management", () => {
		it("should use useRouter for navigation", () => {
			expect(content).toContain("const router = useRouter()");
		});

		it("should read access type from search params", () => {
			expect(content).toContain("useSearchParams");
			expect(content).toContain("searchParams.get");
			expect(content).toContain('accessParam === "read"');
			expect(content).toContain('accessParam === "admin"');
		});

		it("should use tRPC session.join mutation", () => {
			expect(content).toContain("trpc.session.join");
			expect(content).toContain("useMutation");
		});

		it("should have useEffect for automatic join on mount", () => {
			expect(content).toContain("useEffect");
			expect(content).toContain(
				"joinMutation.mutate({ inviteCode, accessType })",
			);
		});
	});

	describe("Data Access Pattern (tRPC Write)", () => {
		it("should use tRPC for write operation (session.join)", () => {
			expect(content).toContain("trpc.session.join");
			expect(content).toContain("useMutation");
		});

		it("should NOT use Supabase for write operations", () => {
			expect(content).not.toContain("createBrowserClient");
			expect(content).not.toContain("createServerClient");
			expect(content).not.toContain("useSupabaseQuery");
		});

		it("should call mutate with inviteCode", () => {
			expect(content).toContain("mutate({ inviteCode, accessType })");
		});
	});

	describe("Component Features - Success State", () => {
		it("should define onSuccess callback in mutation", () => {
			expect(content).toContain("onSuccess:");
			expect(content).toContain("toast.success");
			expect(content).toContain("Successfully joined the session");
		});

		it("should redirect to active session page on success", () => {
			expect(content).toContain("router.push");
			expect(content).toContain("/trainings/");
			expect(content).toContain("/session?sessionId=");
		});

		it("should use data.trainingId and data.sessionId for redirect", () => {
			expect(content).toContain("data.trainingId");
			expect(content).toContain("data.sessionId");
		});

		it("should display success state with Users icon", () => {
			expect(content).toContain("isSuccess");
			expect(content).toContain("You've joined the session");
		});
	});

	describe("Component Features - Error States", () => {
		it("should define onError callback in mutation", () => {
			expect(content).toContain("onError:");
			expect(content).toContain("toast.error");
			expect(content).toContain("Could not join session");
		});

		it("should handle 'Invalid invite code' error", () => {
			expect(content).toContain("Invalid invite code");
			expect(content).toContain("Invalid Invite Code");
		});

		it("should handle 'This session is not active' error", () => {
			expect(content).toContain("This session is not active");
			expect(content).toContain("Session Not Active");
		});

		it("should handle 'You have already joined this session' error", () => {
			expect(content).toContain("You have already joined this session");
		});

		it("should show AlertCircle icon in error state", () => {
			expect(content).toContain("isError");
			expect(content).toContain("AlertCircle");
		});

		it("should provide navigation buttons on error", () => {
			expect(content).toContain("View Your Trainings");
			expect(content).toContain('router.push("/trainings")');
		});
	});

	describe("Component Features - Loading State", () => {
		it("should show Loader2 icon during join", () => {
			expect(content).toContain("isPending");
			expect(content).toContain("Loader2");
		});

		it("should display 'Joining Session...' title during loading", () => {
			expect(content).toContain("Joining Session...");
		});

		it("should display invite code in code element during loading", () => {
			expect(content).toContain("Connecting to the training session");
			expect(content).toContain("{inviteCode}");
		});
	});

	describe("Component Features - UI Structure", () => {
		it("should render Card component", () => {
			expect(content).toContain("<Card");
			expect(content).toContain("CardHeader");
			expect(content).toContain("CardTitle");
			expect(content).toContain("CardContent");
		});

		it("should have max-w-md for mobile-first design", () => {
			expect(content).toContain("max-w-md");
		});

		it("should have proper error styling", () => {
			expect(content).toContain("border-destructive");
			expect(content).toContain("bg-destructive/10");
			expect(content).toContain("text-destructive");
		});
	});

	describe("Accessibility", () => {
		it("should use semantic HTML with Card components", () => {
			expect(content).toContain("CardHeader");
			expect(content).toContain("CardContent");
		});

		it("should have proper text elements", () => {
			expect(content).toContain("CardTitle");
		});

		it("should have icon container with proper sizing", () => {
			expect(content).toContain("h-16 w-16");
			expect(content).toContain("h-8 w-8");
		});
	});

	describe("Responsive Design", () => {
		it("should use mobile-first responsive classes", () => {
			expect(content).toContain("max-w-md");
			expect(content).toContain("w-full");
		});
	});

	describe("Business Logic", () => {
		it("should handle different error messages with user-friendly text", () => {
			expect(content).toContain("errorMessage =");
			expect(content).toContain("This invite code is invalid or expired.");
			expect(content).toContain(
				"This training session has ended or hasn't started yet.",
			);
		});

		it("should extract sessionId and trainingId from mutation response", () => {
			expect(content).toContain("data.sessionId");
			expect(content).toContain("data.trainingId");
		});

		it("should handle mutation status states", () => {
			expect(content).toContain("joinMutation.isPending");
			expect(content).toContain("joinMutation.isError");
			expect(content).toContain("joinMutation.isSuccess");
		});

		it("should console.error on failure for debugging", () => {
			expect(content).toContain("console.error");
			expect(content).toContain("Failed to join session");
		});
	});

	describe("Code Quality", () => {
		it("should use proper TypeScript typing", () => {
			expect(content).toContain(":");
			expect(content).toContain("string");
		});

		it("should include JSDoc comments", () => {
			expect(content).toContain("*");
			expect(content).toContain("JoinPageClient Component");
		});

		it("should handle conditional rendering properly", () => {
			expect(content).toContain("{joinMutation.isPending &&");
			expect(content).toContain("{joinMutation.isError &&");
			expect(content).toContain("{joinMutation.isSuccess &&");
		});
	});

	describe("Error Handling", () => {
		it("should show descriptive error messages", () => {
			expect(content).toContain("description:");
			expect(content).toContain("The invite code you entered is invalid");
		});

		it("should handle error.message safely", () => {
			expect(content).toContain("error.message");
		});

		it("should provide fallback navigation options", () => {
			expect(content).toContain("View Your Trainings");
		});
	});
});

describe("Login Page Redirect Integration", () => {
	const fs = require("node:fs");
	const loginPageContent = fs.readFileSync(
		`${__dirname}/../../../login/page.tsx`,
		"utf-8",
	);
	const signInContent = fs.readFileSync(
		`${__dirname}/../../../../components/sign-in-form.tsx`,
		"utf-8",
	);
	const signUpContent = fs.readFileSync(
		`${__dirname}/../../../../components/sign-up-form.tsx`,
		"utf-8",
	);

	describe("LoginPage Component", () => {
		it("should use useSearchParams to get redirect parameter", () => {
			expect(loginPageContent).toContain("useSearchParams");
			expect(loginPageContent).toContain("redirectPath");
		});

		it("should pass redirectPath to SignInForm", () => {
			expect(loginPageContent).toContain("redirectPath={redirectPath}");
		});

		it("should pass redirectPath to SignUpForm", () => {
			expect(loginPageContent).toContain("redirectPath={redirectPath}");
		});

		it("should default to /dashboard if no redirect parameter", () => {
			expect(loginPageContent).toContain('|| "/dashboard"');
		});
	});

	describe("SignInForm Integration", () => {
		it("should accept redirectPath prop", () => {
			expect(signInContent).toContain("redirectPath?: string");
		});

		it("should have default value for redirectPath", () => {
			expect(signInContent).toContain('= "/dashboard"');
		});

		it("should use redirectPath in onSuccess callback", () => {
			expect(signInContent).toContain("router.push(redirectPath as Route)");
		});
	});

	describe("SignUpForm Integration", () => {
		it("should accept redirectPath prop", () => {
			expect(signUpContent).toContain("redirectPath?: string");
		});

		it("should have default value for redirectPath", () => {
			expect(signUpContent).toContain('= "/dashboard"');
		});

		it("should use redirectPath in onSuccess callback", () => {
			expect(signUpContent).toContain("router.push(redirectPath as Route)");
		});
	});
});

describe("Join Page Integration", () => {
	const fs = require("node:fs");
	const pageContent = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");

	describe("Route Structure", () => {
		it("should follow Next.js 13+ App Router pattern", () => {
			expect(pageContent).toContain("export default async function");
		});

		it("should use dynamic route parameter [code]", () => {
			expect(pageContent).toContain("params: Promise<{ code: string }>");
		});
	});

	describe("Authentication Redirect Flow", () => {
		it("should preserve invite code when redirecting to login", () => {
			expect(pageContent).toContain("/login?redirect=");
			expect(pageContent).toContain("code: inviteCode");
		});

		it("should use proper redirect URL format", () => {
			expect(pageContent).toMatch(
				/redirect\(`\/login\?redirect=\$\{encodeURIComponent\(redirectPath\)\}`\)/,
			);
		});
	});
});
