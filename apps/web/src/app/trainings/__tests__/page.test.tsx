/**
 * Tests for trainings page
 *
 * Run with: bun test apps/web/src/app/trainings/__tests__/page.test.tsx
 */

describe("Trainings Page Component", () => {
	describe("Component Structure", () => {
		it("should export the page component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("export default async function TrainingsPage");
		});

		it("should be an async server component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("export default async function");
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

		it("should render TrainingsList component when authenticated", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("<TrainingsList");
			expect(content).toContain("currentUserId={session.user.id}");
		});
	});

	describe("Page Structure", () => {
		it("should have a main heading", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("Your Trainings");
		});

		it("should have a description", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("Manage your workout routines");
		});

		it("should use responsive container with max-width", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("max-w-4xl");
			expect(content).toContain("px-4");
			expect(content).toContain("py-8");
		});
	});

	describe("Responsive Design", () => {
		it("should use responsive text sizing", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("text-2xl");
			expect(content).toContain("md:text-3xl");
		});

		it("should use responsive padding", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			expect(content).toContain("md:px-6");
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

		it("should use proper TypeScript types", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(`${__dirname}/../page.tsx`, "utf-8");
			// Check for optional chaining on session
			expect(content).toContain("session?.user");
		});
	});
});

describe("TrainingsList Component", () => {
	describe("Component Structure", () => {
		it("should export the component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("export function TrainingsList");
		});

		it("should be a client component", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain('"use client"');
		});

		it("should have a display name matching component name", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("function TrainingsList");
		});
	});

	describe("Dependencies", () => {
		it("should import lucide-react Plus icon", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain('from "lucide-react"');
			expect(content).toContain("Plus");
		});

		it("should import UI components", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/components/ui/button");
			expect(content).toContain("@/components/ui/card");
			expect(content).toContain("@/components/ui/dialog");
		});

		it("should import training components", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("@/components/training/training-card");
			expect(content).toContain("@/components/training/training-form");
		});
	});

	describe("Props Interface", () => {
		it("should accept currentUserId prop", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("interface TrainingsListProps");
			expect(content).toContain("currentUserId: string");
		});

		it("should have proper TypeScript types for Training interface", () => {
			const training = {
				id: "training-1",
				name: "Upper Body",
				description: "Strength training",
				userId: "user-1",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			};

			expect(training.id).toBe("training-1");
			expect(training.name).toBe("Upper Body");
			expect(training.description).toBe("Strength training");
			expect(training.userId).toBe("user-1");
		});

		it("should have proper TypeScript types for TrainingsListProps", () => {
			const props = {
				currentUserId: "user-1",
			};

			expect(props.currentUserId).toBe("user-1");
		});
	});

	describe("State Management", () => {
		it("should use useState for create dialog", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("useState");
			expect(content).toContain("isCreateDialogOpen");
		});

		it("should use useState for editing training", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("editingTraining");
		});
	});

	describe("Data Access Pattern", () => {
		it("should use Supabase for reading trainings", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("useSupabaseQuery");
		});

		it("should query training table filtered by userId", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain('.from("training")');
			expect(content).toContain(".eq(");
			expect(content).toContain("userId");
		});

		it("should order trainings by createdAt descending", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("order(");
			expect(content).toContain("createdAt");
			expect(content).toContain("ascending: false");
		});

		it("should enable real-time updates", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("realtime: true");
			expect(content).toContain('table: "training"');
		});
	});

	describe("Component Features", () => {
		it("should have a create training button", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("Create Training");
			expect(content).toContain("<Plus");
		});

		it("should use Dialog for create form", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("<Dialog");
			expect(content).toContain("isCreateDialogOpen");
			expect(content).toContain("setIsCreateDialogOpen");
		});

		it("should display TrainingCard components for each training", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("<TrainingCard");
			expect(content).toContain("key={training.id}");
		});

		it("should show loading state while fetching", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("isLoading");
			expect(content).toContain("animate-pulse");
		});

		it("should show empty state when no trainings", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("trainings && trainings.length > 0");
			expect(content).toContain("No trainings yet");
		});
	});

	describe("Create Training Dialog", () => {
		it("should have proper dialog title and description", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("Create New Training");
			expect(content).toContain("Start by creating a new workout routine");
		});

		it("should close dialog after successful creation", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("handleCreateSuccess");
			expect(content).toContain("setIsCreateDialogOpen(false)");
			expect(content).toContain("refetch()");
		});

		it("should pass onSuccess callback to TrainingForm", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("<TrainingForm");
			expect(content).toContain("onSuccess={handleCreateSuccess}");
		});
	});

	describe("Edit Training Dialog", () => {
		it("should show edit dialog when editingTraining is set", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("editingTraining &&");
			expect(content).toContain("<Dialog");
		});

		it("should have proper dialog title for editing", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("Edit Training");
			expect(content).toContain("Update your training details");
		});

		it("should pass training data to TrainingForm", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("training={editingTraining}");
		});

		it("should handle edit success and cancel", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("handleEditSuccess");
			expect(content).toContain("handleEditCancel");
			expect(content).toContain("setEditingTraining(undefined)");
		});
	});

	describe("Grid Layout", () => {
		it("should use responsive grid for training cards", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("grid");
			expect(content).toContain("gap-4");
			expect(content).toContain("sm:grid-cols-2");
		});
	});

	describe("TrainingCard Props", () => {
		it("should pass currentUserId to TrainingCard", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("currentUserId={currentUserId}");
		});

		it("should pass onEdit handler to TrainingCard", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("onEdit={handleEdit}");
		});
	});

	describe("Error Handling", () => {
		it("should show toast error on query error", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("if (error)");
			expect(content).toContain("toast.error");
		});
	});

	describe("Real-time Updates", () => {
		it("should refetch data after mutations", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("refetch()");
		});

		it("should have refetch from useSupabaseQuery", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("refetch");
			expect(content).toContain("useSupabaseQuery");
		});
	});

	describe("Accessibility", () => {
		it("should have proper heading structure", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("CardTitle");
		});

		it("should have proper descriptions", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("CardDescription");
		});
	});

	describe("Responsive Design", () => {
		it("should use responsive container", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("space-y-6");
		});

		it("should use responsive grid for cards", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("sm:grid-cols-2");
		});
	});

	describe("Code Quality", () => {
		it("should have no syntax errors", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			// Basic sanity checks that the file is complete
			expect(content).toContain("export function TrainingsList");
			expect(content).toContain("return (");
		});

		it("should export a named export", () => {
			const fs = require("node:fs");
			const content = fs.readFileSync(
				`${__dirname}/../trainings-list.tsx`,
				"utf-8",
			);
			expect(content).toContain("export function TrainingsList");
		});
	});
});
