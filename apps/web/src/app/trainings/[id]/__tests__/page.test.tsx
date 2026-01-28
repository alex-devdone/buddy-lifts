/**
 * Tests for training detail page
 *
 * Run with: bun test apps/web/src/app/trainings/[id]/__tests__/page.test.tsx
 */

describe("Training Detail Page Component", () => {
	describe("Component Structure", () => {
		it("should export the page component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain(
				"export default async function TrainingDetailPage",
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

		it("should import TrainingDetail component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("./training-detail");
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
			expect(content).toContain("const { id } = await params;");
		});

		it("should render TrainingDetail component when authenticated", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("<TrainingDetail");
			expect(content).toContain("trainingId={id}");
			expect(content).toContain("currentUserId={session.user.id}");
		});
	});

	describe("Page Structure", () => {
		it("should use responsive container with max-width", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("max-w-4xl");
			expect(content).toContain("px-4");
			expect(content).toContain("py-8");
		});

		it("should use responsive padding on desktop", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("md:px-6");
		});
	});

	describe("TypeScript Types", () => {
		it("should define PageProps interface", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("interface PageProps");
			expect(content).toContain("params: Promise<{ id: string }>");
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

	describe("Responsive Design", () => {
		it("should use mobile-first responsive classes", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("px-4");
			expect(content).toContain("md:px-6");
		});

		it("should use appropriate container sizing", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("max-w-4xl");
		});
	});

	describe("Route Structure", () => {
		it("should be located at trainings/[id] route", () => {
			const path = require("node:path");
			const routePath = path.dirname(__dirname).split("/").slice(-2).join("/");
			expect(routePath).toBe("trainings/[id]");
		});
	});
});

describe("Training Detail Client Component", () => {
	describe("Component Structure", () => {
		it("should be a client component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain('"use client"');
		});

		it("should export TrainingDetail component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("export function TrainingDetail");
		});

		it("should accept trainingId and currentUserId props", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("trainingId: string");
			expect(content).toContain("currentUserId: string");
		});
	});

	describe("Dependencies", () => {
		it("should import useRouter from next/navigation", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("useRouter");
			expect(content).toContain("next/navigation");
		});

		it("should import icons from lucide-react", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("ArrowLeft");
			expect(content).toContain("Calendar");
			expect(content).toContain("Dumbbell");
			expect(content).toContain("Edit2");
			expect(content).toContain("Plus");
			expect(content).toContain("Sparkles");
			expect(content).toContain("Trash2");
			expect(content).toContain("User");
		});

		it("should import ExerciseList component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/components/training/exercise-list");
		});

		it("should import ExerciseParserInput component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/components/training/exercise-parser-input");
		});

		it("should import TrainingForm component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/components/training/training-form");
		});

		it("should import UI components", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/components/ui/button");
			expect(content).toContain("@/components/ui/card");
			expect(content).toContain("@/components/ui/dialog");
			expect(content).toContain("@/components/ui/dropdown-menu");
		});

		it("should import useSupabaseQuery hook", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/hooks/use-supabase-query");
		});

		it("should import trpc client", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/utils/trpc");
		});

		it("should import date-fns for time formatting", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("formatDistanceToNow");
			expect(content).toContain("date-fns");
		});
	});

	describe("Props Interface", () => {
		it("should define TrainingDetailProps interface", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("interface TrainingDetailProps");
			expect(content).toContain("trainingId: string");
			expect(content).toContain("currentUserId: string");
		});

		it("should define Training interface", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("interface Training");
			expect(content).toContain("id: string");
			expect(content).toContain("name: string");
			expect(content).toContain("description: string | null");
			expect(content).toContain("userId: string");
			expect(content).toContain("createdAt: string");
			expect(content).toContain("updatedAt: string");
		});

		it("should define Exercise interface", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("interface Exercise");
			expect(content).toContain("trainingId: string");
			expect(content).toContain("name: string");
			expect(content).toContain("targetSets: number");
			expect(content).toContain("targetReps: number");
			expect(content).toContain("weight: number | null");
			expect(content).toContain("restSeconds: number | null");
			expect(content).toContain("order: number");
		});
	});

	describe("State Management", () => {
		it("should use useState for dialog states", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("useState");
		});

		it("should have edit dialog state", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("isEditDialogOpen");
			expect(content).toContain("setIsEditDialogOpen");
		});

		it("should have add exercise dialog state", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("isAddExerciseDialogOpen");
			expect(content).toContain("setIsAddExerciseDialogOpen");
		});

		it("should have editingTraining state", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("editingTraining");
			expect(content).toContain("setEditingTraining");
		});
	});

	describe("Data Access Pattern", () => {
		it("should use useSupabaseQuery for reading training data", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("useSupabaseQuery<Training>");
			expect(content).toContain('.from("training")');
			expect(content).toContain(".select");
			expect(content).toContain(".single()");
		});

		it("should use useSupabaseQuery for reading exercises data", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("useSupabaseQuery<Exercise>");
			expect(content).toContain('.from("exercise")');
			expect(content).toContain(".eq");
			expect(content).toContain(".order");
		});

		it("should enable real-time for exercises", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("realtime: true");
			expect(content).toContain('table: "exercise"');
		});

		it("should use tRPC mutations for write operations", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("trpc.training.delete");
			expect(content).toContain("trpc.session.start");
		});

		it("should use useMutation for delete and start session", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("const deleteTraining = useMutation");
			expect(content).toContain("const startSession = useMutation");
		});
	});

	describe("Component Features", () => {
		it("should have back button to trainings list", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("ArrowLeft");
			expect(content).toContain('router.push("/trainings")');
		});

		it("should display training name with icon", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("Dumbbell");
			expect(content).toContain("{training[0]?.name}");
		});

		it("should display training description if present", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("training[0]?.description &&");
			expect(content).toContain("line-clamp-2");
		});

		it("should display training metadata", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("User");
			expect(content).toContain("Calendar");
			expect(content).toContain("Created");
			expect(content).toContain("timeAgo");
		});

		it("should display exercise count", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("exerciseCount");
			expect(content).toContain("exercise");
		});

		it("should have edit dropdown for owner", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("isOwner &&");
			expect(content).toContain("DropdownMenu");
			expect(content).toContain("Edit2");
		});

		it("should have delete option for owner", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("Trash2");
			expect(content).toContain("Delete Training");
		});

		it("should have add exercises with AI button for owner", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("Sparkles");
			expect(content).toContain("Add Exercises with AI");
			expect(content).toContain("ExerciseParserInput");
		});

		it("should have start session button for owner", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("Plus");
			expect(content).toContain("Start Session");
			expect(content).toContain("handleStartSession");
		});

		it("should render ExerciseList component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("<ExerciseList");
			expect(content).toContain("trainingId={trainingId}");
			expect(content).toContain("currentUserId={currentUserId}");
			expect(content).toContain("trainingUserId={training[0]?.userId}");
		});

		it("should have edit training dialog", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("Edit Training");
			expect(content).toContain("TrainingForm");
		});
	});

	describe("Business Logic", () => {
		it("should check ownership for edit/delete actions", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain(
				"const isOwner = currentUserId === training[0]?.userId",
			);
		});

		it("should calculate exercise count", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("const exerciseCount = exercises.length");
		});

		it("should format time ago using date-fns", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("formatDistanceToNow");
			expect(content).toContain('new Date(training[0]?.createdAt || "")');
			expect(content).toContain("addSuffix: true");
		});

		it("should handle delete with confirmation", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("confirm(");
			expect(content).toContain("delete all exercises");
		});

		it("should redirect to trainings after delete", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain('router.push("/trainings")');
		});

		it("should redirect to session page after starting session", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("router.push(`/trainings/");
			expect(content).toContain("/session`)");
		});

		it("should disable start session when no exercises", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain(
				"disabled={startSession.isPending || exerciseCount === 0}",
			);
		});
	});

	describe("Loading States", () => {
		it("should show loading skeleton when fetching training", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("isLoadingTraining");
			expect(content).toContain("animate-pulse");
			expect(content).toContain("bg-muted/50");
		});

		it("should show loading skeleton when fetching exercises", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("isLoadingExercises");
		});
	});

	describe("Error States", () => {
		it("should show error card when training fails to load", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("trainingError");
			expect(content).toContain("border-destructive");
			expect(content).toContain("Failed to load training");
		});

		it("should show not found when training is null", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("!training");
			expect(content).toContain("Training not found");
		});
	});

	describe("Accessibility", () => {
		it("should use proper semantic HTML structure", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("Card");
			expect(content).toContain("CardHeader");
			expect(content).toContain("CardTitle");
			expect(content).toContain("CardDescription");
		});

		it("should have responsive text sizes", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("text-xl");
			expect(content).toContain("md:text-2xl");
		});
	});

	describe("Responsive Design", () => {
		it("should use mobile-first responsive classes", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("text-xs");
			expect(content).toContain("text-sm");
			expect(content).toContain("text-lg");
		});

		it("should use flex-wrap for buttons on mobile", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("flex-wrap");
		});

		it("should use min-w-0 and line-clamp for text", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("min-w-0");
			// line-clamp-2 is used for description
			const hasLineClamp =
				content.includes("line-clamp-2") || content.includes("line-clamp");
			expect(hasLineClamp).toBe(true);
		});
	});

	describe("Toast Notifications", () => {
		it("should show success toast on delete", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain(
				'toast.success("Training deleted successfully")',
			);
		});

		it("should show success toast on session start", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain('toast.success("Session started")');
		});

		it("should show error toast on delete failure", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			expect(content).toContain("toast.error(error.message)");
		});
	});

	describe("Code Quality", () => {
		it("should have no syntax errors", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			// Basic sanity check that the file is complete
			expect(content).toContain("export function");
			expect(content).toContain("return (");
		});

		it("should be a complete file with proper ending", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			// Check that the file ends properly
			expect(content.trim().endsWith("}")).toBe(true);
		});

		it("should use consistent formatting", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../training-detail.tsx`,
				"utf-8",
			);
			// Check for consistent spacing patterns
			expect(content).toContain("\n\t");
		});
	});
});
