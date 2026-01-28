/**
 * Tests for session summary client component
 *
 * Run with: bun test apps/web/src/app/trainings/[id]/summary/__tests__/session-summary.test.tsx
 */

describe("Session Summary Client Component", () => {
	it("should be a client component", () => {
		const fs = require("node:fs");
		const content = fs.readFileSync(
			`${__dirname}/../session-summary.tsx`,
			"utf-8",
		);
		expect(content).toContain('"use client"');
	});

	it("should export SessionSummary component", () => {
		const fs = require("node:fs");
		const content = fs.readFileSync(
			`${__dirname}/../session-summary.tsx`,
			"utf-8",
		);
		expect(content).toContain("export function SessionSummary");
	});

	it("should use Supabase queries for reads", () => {
		const fs = require("node:fs");
		const content = fs.readFileSync(
			`${__dirname}/../session-summary.tsx`,
			"utf-8",
		);
		expect(content).toContain("useSupabaseQuery");
		expect(content).toContain('.from("training")');
		expect(content).toContain('.from("training_session")');
		expect(content).toContain('.from("exercise")');
		expect(content).toContain('.from("session_participant")');
		expect(content).toContain('.from("exercise_progress")');
		expect(content).toContain('.from("user")');
	});

	it("should handle incomplete sessions", () => {
		const fs = require("node:fs");
		const content = fs.readFileSync(
			`${__dirname}/../session-summary.tsx`,
			"utf-8",
		);
		expect(content).toContain('session.status !== "completed"');
		expect(content).toContain("Summary not ready yet");
	});

	it("should render participant progress details", () => {
		const fs = require("node:fs");
		const content = fs.readFileSync(
			`${__dirname}/../session-summary.tsx`,
			"utf-8",
		);
		expect(content).toContain("Participant Progress");
		expect(content).toContain("completionPercent");
		expect(content).toContain("completedExercises");
	});
});
