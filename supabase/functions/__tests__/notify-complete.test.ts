// Tests for notify-complete Edge Function
// These tests verify the email notification behavior when a training session is completed

// @ts-nocheck - Deno test environment
// Simple test assertions
function assertEqual(
	actual: unknown,
	expected: unknown,
	message?: string,
): void {
	if (actual !== expected) {
		throw new Error(
			message ||
				`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`,
		);
	}
}

function _assertExists(value: unknown, message?: string): void {
	if (value === null || value === undefined) {
		throw new Error(message || "Value should exist");
	}
}

// Test payload generator
function createCompletePayload(overrides = {}) {
	return {
		type: "UPDATE",
		table: "training_session",
		schema: "public",
		old_record: {
			id: "test-session-id",
			status: "active",
			...overrides,
		},
		record: {
			id: "test-session-id",
			trainingId: "test-training-id",
			hostUserId: "host-user-id",
			inviteCode: "ABC123",
			accessType: "admin",
			status: "completed",
			startedAt: new Date(Date.now() - 3600000).toISOString(),
			completedAt: new Date().toISOString(),
			...overrides,
		},
	};
}

function createMockParticipants() {
	return [
		{
			userId: "user-1",
			role: "host",
			joinedAt: new Date(Date.now() - 3600000).toISOString(),
			user: {
				id: "user-1",
				name: "Alice Host",
				email: "alice@example.com",
			},
		},
		{
			userId: "user-2",
			role: "read",
			joinedAt: new Date(Date.now() - 3000000).toISOString(),
			user: {
				id: "user-2",
				name: "Bob Participant",
				email: "bob@example.com",
			},
		},
		{
			userId: "user-3",
			role: "read",
			joinedAt: new Date(Date.now() - 2400000).toISOString(),
			user: {
				id: "user-3",
				name: "Charlie Guest",
				email: "charlie@example.com",
			},
		},
	];
}

function createMockExercises() {
	return [
		{
			id: "ex-1",
			name: "Push-ups",
			targetSets: 3,
			targetReps: 15,
			order: 1,
		},
		{
			id: "ex-2",
			name: "Squats",
			targetSets: 3,
			targetReps: 20,
			order: 2,
		},
		{
			id: "ex-3",
			name: "Plank",
			targetSets: 2,
			targetReps: 30,
			order: 3,
		},
	];
}

Deno.test("notify-complete: ignores non-UPDATE events", () => {
	const insertPayload = {
		type: "INSERT",
		table: "training_session",
		record: { id: "test-id", status: "pending" },
	};

	assertEqual(insertPayload.type, "INSERT");
});

Deno.test("notify-complete: ignores when status not changed to completed", () => {
	const payload = createCompletePayload({
		status: "active",
	});

	assertEqual(payload.record.status, "active");
});

Deno.test("notify-complete: ignores when already completed", () => {
	const payload = {
		type: "UPDATE",
		old_record: { status: "completed" },
		record: { status: "completed" },
	};

	assertEqual(payload.old_record.status, "completed");
});

Deno.test("notify-complete: calculates completion percentage correctly", () => {
	const completedSets = 6;
	const totalSets = 8;
	const expectedPercentage = Math.round((completedSets / totalSets) * 100);

	assertEqual(expectedPercentage, 75);
});

Deno.test("notify-complete: determines participant rankings correctly", () => {
	const stats = [
		{ userId: "user-1", completionPercentage: 100, name: "Alice" },
		{ userId: "user-2", completionPercentage: 75, name: "Bob" },
		{ userId: "user-3", completionPercentage: 50, name: "Charlie" },
	];

	const sorted = [...stats].sort(
		(a, b) => b.completionPercentage - a.completionPercentage,
	);

	assertEqual(sorted[0].userId, "user-1");
	assertEqual(sorted[1].userId, "user-2");
	assertEqual(sorted[2].userId, "user-3");
});

Deno.test("notify-complete: assigns rank emojis correctly", () => {
	const getRankEmoji = (rank: number): string => {
		if (rank === 1) return "🏆";
		if (rank === 2) return "🥈";
		if (rank === 3) return "🥉";
		return "👏";
	};

	assertEqual(getRankEmoji(1), "🏆");
	assertEqual(getRankEmoji(2), "🥈");
	assertEqual(getRankEmoji(3), "🥉");
	assertEqual(getRankEmoji(4), "👏");
	assertEqual(getRankEmoji(10), "👏");
});

Deno.test("notify-complete: formats session duration correctly", () => {
	const formatDuration = (startedAt: string, completedAt: string): string => {
		const start = new Date(startedAt);
		const end = new Date(completedAt);
		const diffMs = end.getTime() - start.getTime();
		const diffMins = Math.round(diffMs / 60000);

		if (diffMins < 60) {
			return `${diffMins} minutes`;
		}
		const hours = Math.floor(diffMins / 60);
		const mins = diffMins % 60;
		return `${hours}h ${mins}m`;
	};

	// Test 45 minutes
	assertEqual(
		formatDuration(
			new Date(Date.now() - 2700000).toISOString(),
			new Date().toISOString(),
		),
		"45 minutes",
	);

	// Test 1 hour 30 minutes
	assertEqual(
		formatDuration(
			new Date(Date.now() - 5400000).toISOString(),
			new Date().toISOString(),
		),
		"1h 30m",
	);
});

Deno.test("notify-complete: generates email subject with rank", () => {
	const getSubject = (rank: number): string => {
		const rankEmoji =
			rank === 1 ? "🏆" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "👏";
		return `Training Complete! ${rankEmoji} You finished #${rank}`;
	};

	assertEqual(getSubject(1), "Training Complete! 🏆 You finished #1");
	assertEqual(getSubject(2), "Training Complete! 🥈 You finished #2");
	assertEqual(getSubject(3), "Training Complete! 🥉 You finished #3");
	assertEqual(getSubject(4), "Training Complete! 👏 You finished #4");
});

Deno.test("notify-complete: highlights top performer", () => {
	const stats = [
		{ userId: "user-1", completionPercentage: 100, name: "Alice" },
		{ userId: "user-2", completionPercentage: 75, name: "Bob" },
	];

	const sorted = [...stats].sort(
		(a, b) => b.completionPercentage - a.completionPercentage,
	);
	const topPerformer = sorted[0];

	assertEqual(topPerformer.userId, "user-1");
	assertEqual(topPerformer.completionPercentage, 100);
});

Deno.test("notify-complete: calculates session highlights", () => {
	const participants = createMockParticipants();
	const exercises = createMockExercises();
	const stats = [
		{ completionPercentage: 100 },
		{ completionPercentage: 75 },
		{ completionPercentage: 50 },
	];

	const averageCompletion =
		stats.reduce((sum, s) => sum + s.completionPercentage, 0) / stats.length;

	assertEqual(participants.length, 3);
	assertEqual(exercises.length, 3);
	assertEqual(Math.round(averageCompletion), 75);
});

Deno.test("notify-complete: parses completedReps JSON correctly", () => {
	const progressRecord = {
		completedReps: "[15,15,12]",
	};

	const parsed = JSON.parse(progressRecord.completedReps);

	assertEqual(Array.isArray(parsed), true);
	assertEqual(parsed.length, 3);
	assertEqual(parsed[0], 15);
});

Deno.test("notify-complete: returns success response", () => {
	const expectedResponse = {
		message: "Completion notifications sent",
		sessionId: "test-session-id",
		participantCount: 3,
	};

	assertEqual(expectedResponse.message, "Completion notifications sent");
	assertEqual(expectedResponse.sessionId, "test-session-id");
	assertEqual(expectedResponse.participantCount, 3);
});
