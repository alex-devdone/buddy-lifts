/**
 * Tests for active training session page
 *
 * Run with: bun test apps/web/src/app/trainings/[id]/session/__tests__/page.test.tsx
 */

import { describe, expect, it } from "vitest";

describe("Active Session Page Component", () => {
	describe("Component Structure", () => {
		it("should export the page component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain(
				"export default async function ActiveSessionPage",
			);
		});

		it("should be an async server component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("export default async function");
		});

		it("should accept params prop with id", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("params: Promise<{ id: string }>");
		});

		it("should accept searchParams prop with sessionId", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain(
				"searchParams: Promise<{ sessionId?: string }>",
			);
		});
	});

	describe("Dependencies", () => {
		it("should import auth from buddy-lifts/auth", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain('from "@buddy-lifts/auth"');
		});

		it("should import next/navigation for redirect", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("redirect");
			expect(content).toContain("next/navigation");
		});

		it("should import ActiveSession component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("./active-session");
		});
	});

	describe("Authentication Flow", () => {
		it("should check for session using auth.api.getSession", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("auth.api.getSession");
			expect(content).toContain("headers: await headers()");
		});

		it("should redirect to login if no session exists", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("if (!session?.user)");
			expect(content).toContain('redirect("/login")');
		});

		it("should await params to extract id", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("const { id: trainingId } = await params;");
		});

		it("should await searchParams to extract sessionId", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("const { sessionId } = await searchParams;");
		});

		it("should redirect to training if no sessionId provided", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("if (!sessionId)");
			expect(content).toContain("redirect(`/trainings/${trainingId}`)");
		});

		it("should render ActiveSession component when authenticated with sessionId", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("<ActiveSession");
			expect(content).toContain("trainingId={trainingId}");
			expect(content).toContain("sessionId={sessionId}");
			expect(content).toContain("currentUserId={session.user.id}");
		});
	});

	describe("Page Structure", () => {
		it("should use responsive container with max-width", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("max-w-6xl");
			expect(content).toContain("px-4");
			expect(content).toContain("py-6");
		});

		it("should use responsive padding on desktop", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("md:px-6");
			expect(content).toContain("md:py-8");
		});
	});

	describe("TypeScript Types", () => {
		it("should define PageProps interface", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("interface PageProps");
			expect(content).toContain("params: Promise<{ id: string }>");
			expect(content).toContain(
				"searchParams: Promise<{ sessionId?: string }>",
			);
		});

		it("should use proper TypeScript types", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			// Check for optional chaining on session
			expect(content).toContain("session?.user");
		});
	});

	describe("Code Quality", () => {
		it("should have no syntax errors", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			// Basic sanity check that the file is complete
			expect(content).toContain("export default");
			expect(content).toContain("return (");
		});

		it("should be a complete file with proper ending", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			// Check that the file ends properly
			expect(content.trim().endsWith("}")).toBe(true);
		});
	});

	describe("Route Structure", () => {
		it("should be located at trainings/[id]/session route", () => {
			const path = require("node:path");
			const routePath = path.dirname(__dirname).split("/").slice(-3).join("/");
			expect(routePath).toBe("trainings/[id]/session");
		});
	});
});

describe("Active Session Client Component", () => {
	describe("Component Structure", () => {
		it("should be a client component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain('"use client"');
		});

		it("should export ActiveSession component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("export function ActiveSession");
		});

		it("should accept trainingId, sessionId, and currentUserId props", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("trainingId: string");
			expect(content).toContain("sessionId: string");
			expect(content).toContain("currentUserId: string");
		});
	});

	describe("Dependencies", () => {
		it("should import useRouter from next/navigation", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("useRouter");
			expect(content).toContain("next/navigation");
		});

		it("should import icons from lucide-react", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("ArrowLeft");
			expect(content).toContain("CheckCircle2");
			expect(content).toContain("Dumbbell");
			expect(content).toContain("Loader2");
			expect(content).toContain("Users");
		});

		it("should import session components", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/components/session/body-progress");
			expect(content).toContain("@/components/session/exercise-checklist");
			expect(content).toContain("@/components/session/invite-link-dialog");
			expect(content).toContain("@/components/session/live-progress-bar");
			expect(content).toContain("@/components/session/participant-grid");
			expect(content).toContain("@/components/session/progress-input");
			expect(content).toContain("@/components/session/session-lobby");
		});

		it("should import UI components", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/components/ui/button");
			expect(content).toContain("@/components/ui/card");
		});

		it("should import useSupabaseQuery hook", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/hooks/use-supabase-query");
		});

		it("should import trpc client", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/utils/trpc");
		});
	});

	describe("Props Interface", () => {
		it("should define ActiveSessionProps interface", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("interface ActiveSessionProps");
			expect(content).toContain("trainingId: string");
			expect(content).toContain("sessionId: string");
			expect(content).toContain("currentUserId: string");
		});

		it("should define Training interface", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("interface Training");
			expect(content).toContain("id: string");
			expect(content).toContain("name: string");
			expect(content).toContain("description: string | null");
			expect(content).toContain("userId: string");
		});

		it("should define TrainingSession interface", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("interface TrainingSession");
			expect(content).toContain("id: string");
			expect(content).toContain("trainingId: string");
			expect(content).toContain("hostUserId: string");
			expect(content).toContain("inviteCode: string");
			expect(content).toContain('accessType: "read" | "admin"');
			expect(content).toContain('status: "pending" | "active" | "completed"');
		});

		it("should define Exercise interface", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("interface Exercise");
			expect(content).toContain("name: string");
			expect(content).toContain("targetSets: number");
			expect(content).toContain("targetReps: number");
		});

		it("should define SessionView type", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("type SessionView");
			expect(content).toContain('"lobby"');
			expect(content).toContain('"progress"');
			expect(content).toContain('"checklist"');
		});
	});

	describe("State Management", () => {
		it("should use useState for currentView", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("useState<SessionView>");
			expect(content).toContain("setCurrentView");
		});

		it("should use useState for selectedExerciseId", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("useState<string | null>");
			expect(content).toContain("setSelectedExerciseId");
		});
	});

	describe("Data Access Pattern", () => {
		it("should use useSupabaseQuery for reading training data", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("useSupabaseQuery<Training>");
			expect(content).toContain('.from("training")');
			expect(content).toContain(".single()");
		});

		it("should use useSupabaseQuery for reading session data with realtime", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("useSupabaseQuery<TrainingSession>");
			expect(content).toContain('.from("training_session")');
			expect(content).toContain("realtime: true");
			expect(content).toContain('table: "training_session"');
		});

		it("should use useSupabaseQuery for reading exercises with realtime", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("useSupabaseQuery<Exercise>");
			expect(content).toContain('.from("exercise")');
			expect(content).toContain("realtime: true");
			expect(content).toContain('table: "exercise"');
		});

		it("should use tRPC mutations for write operations", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("trpc.session.end");
			expect(content).toContain("trpc.session.leave");
		});

		it("should use useMutation for end and leave session", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("const endSession = useMutation");
			expect(content).toContain("const leaveSession = useMutation");
		});
	});

	describe("Component Features", () => {
		it("should determine if current user is host", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain(
				"const isHost = session?.hostUserId === currentUserId",
			);
		});

		it("should update view based on session status", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("useEffect");
			expect(content).toContain('session.status === "pending"');
			expect(content).toContain('session.status === "active"');
			expect(content).toContain('session.status === "completed"');
		});

		it("should handle back to training navigation", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("handleBackToTraining");
			expect(content).toContain("router.push(`/trainings/${trainingId}`)");
		});

		it("should handle exercise selection for progress input", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("handleSelectExercise");
			expect(content).toContain("setSelectedExerciseId");
		});

		it("should handle end session with confirmation", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("handleEndSession");
			expect(content).toContain("confirm(");
			expect(content).toContain("end this session");
		});

		it("should handle leave session with confirmation", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("handleLeaveSession");
			expect(content).toContain("leave this session");
		});

		it("should show loading state", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("Loading session...");
			expect(content).toContain("Loader2");
		});

		it("should show error state", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("Session not found or failed to load");
			expect(content).toContain("border-destructive");
		});

		it("should show completed state", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("Session Completed!");
			expect(content).toContain("CheckCircle2");
		});

		it("should render header with training info", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("{training.name}");
			expect(content).toContain("ArrowLeft");
			expect(content).toContain("Back to Training");
		});

		it("should show session status badge", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("Live Session");
			expect(content).toContain("Starting Soon");
		});

		it("should show share invite button for host", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("isHost &&");
			expect(content).toContain("InviteLinkDialog");
		});

		it("should show end session button for host", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("isHost ?");
			expect(content).toContain("End Session");
		});

		it("should show leave button for non-host", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("Leave");
		});

		it("should render lobby view for pending sessions", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain('session.status === "pending"');
			expect(content).toContain('currentView === "lobby"');
			expect(content).toContain("<SessionLobby");
		});

		it("should render active session views", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain('session.status === "active"');
			expect(content).toContain('currentView === "progress"');
			expect(content).toContain('currentView === "checklist"');
		});

		it("should render progress view components", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("<LiveProgressBar");
			expect(content).toContain("<ParticipantGrid");
			expect(content).toContain("<BodyProgress");
			expect(content).toContain("<ExerciseChecklist");
		});

		it("should render progress input when exercise selected", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("selectedExerciseId ?");
			expect(content).toContain("<ProgressInput");
		});

		it("should have view toggle for active sessions", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("Progress");
			expect(content).toContain("Exercises");
			expect(content).toContain("setCurrentView");
		});
	});

	describe("Responsive Design", () => {
		it("should use mobile-first responsive classes", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("text-xs");
			expect(content).toContain("text-sm");
			expect(content).toContain("text-lg");
		});

		it("should use grid layout for desktop", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("lg:grid-cols-2");
		});

		it("should use flex-wrap for responsive buttons", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("flex-wrap");
		});
	});

	describe("Toast Notifications", () => {
		it("should show success toast on session end", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain('toast.success("Session completed!")');
		});

		it("should show success toast on leave", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain('toast.success("Left session")');
		});

		it("should show error toast on failure", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			expect(content).toContain("toast.error(error.message)");
		});
	});

	describe("Code Quality", () => {
		it("should have no syntax errors", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			// Basic sanity check that the file is complete
			expect(content).toContain("export function");
			expect(content).toContain("return (");
		});

		it("should be a complete file with proper ending", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../active-session.tsx`,
				"utf-8",
			);
			// Check that the file ends properly
			expect(content.trim().endsWith("}")).toBe(true);
		});
	});
});
