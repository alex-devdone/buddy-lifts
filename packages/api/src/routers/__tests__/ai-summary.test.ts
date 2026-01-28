/**
 * AI Summary Router Tests
 *
 * Tests the training summary generation logic including:
 * - Exercise percentage calculation
 * - Participant comparison
 * - Highlight generation
 * - Session insights
 */

/**
 * Calculate completion percentage for a single exercise
 */
function calculateExercisePercentage(
	completedReps: number[],
	targetSets: number,
	targetReps: number,
): number {
	const totalTargetReps = targetSets * targetReps;
	const totalCompletedReps = completedReps.reduce((sum, reps) => sum + reps, 0);
	return Math.min(
		Math.round((totalCompletedReps / totalTargetReps) * 100),
		100,
	);
}

/**
 * Generate performance highlights for a participant
 */
interface ExercisePerformance {
	exerciseName: string;
	targetSets: number;
	targetReps: number;
	targetTotalReps: number;
	completedReps: number[];
	completedTotalReps: number;
	completionPercentage: number;
}

interface ParticipantSummary {
	userId: string;
	userName: string;
	exercises: ExercisePerformance[];
	totalTargetReps: number;
	totalCompletedReps: number;
	overallCompletion: number;
}

function generateHighlights(participant: ParticipantSummary): string[] {
	const highlights: string[] = [];

	// Check for perfect exercises
	const perfectExercises = participant.exercises.filter(
		(ex) => ex.completionPercentage === 100,
	);

	if (perfectExercises.length > 0) {
		if (perfectExercises.length === participant.exercises.length) {
			highlights.push("Crushed it! Perfect completion on all exercises!");
		} else {
			highlights.push(
				`Nailed ${perfectExercises.length} exercise${perfectExercises.length > 1 ? "s" : ""} with 100% completion`,
			);
		}
	}

	// Check for strongest exercise
	const strongestExercise = [...participant.exercises].sort(
		(a, b) => b.completionPercentage - a.completionPercentage,
	)[0];

	if (strongestExercise && strongestExercise.completionPercentage >= 80) {
		highlights.push(
			`Strongest performance: ${strongestExercise.exerciseName} (${strongestExercise.completionPercentage}%)`,
		);
	}

	// Check for areas to improve
	const needsWorkExercises = participant.exercises.filter(
		(ex) => ex.completionPercentage < 70,
	);

	if (needsWorkExercises.length > 0) {
		const names = needsWorkExercises.map((ex) => ex.exerciseName).join(", ");
		highlights.push(`Room for growth: ${names}`);
	}

	return highlights;
}

/**
 * Generate comparative insights between participants
 */
interface ParticipantComparison {
	userId: string;
	userName: string;
	overallCompletion: number;
	totalCompletedReps: number;
	differenceFromWinner: number;
	isWinner: boolean;
}

function generateComparisons(
	participants: ParticipantSummary[],
): ParticipantComparison[] {
	if (participants.length === 0) return [];

	const sorted = [...participants].sort(
		(a, b) => b.overallCompletion - a.overallCompletion,
	);

	const winner = sorted[0];
	if (!winner) return [];

	return sorted.map((participant) => ({
		userId: participant.userId,
		userName: participant.userName,
		overallCompletion: participant.overallCompletion,
		totalCompletedReps: participant.totalCompletedReps,
		differenceFromWinner:
			winner.overallCompletion - participant.overallCompletion,
		// Mark as winner if tied for first place
		isWinner: participant.overallCompletion === winner.overallCompletion,
	}));
}

/**
 * Generate session-wide insights
 */
function generateSessionInsights(participants: ParticipantSummary[]): string[] {
	const insights: string[] = [];

	if (participants.length === 0) return insights;

	if (participants.length === 1) {
		const p = participants[0];
		if (!p) return insights;
		if (p.overallCompletion >= 90) {
			insights.push("Excellent solo session! You're on fire!");
		} else if (p.overallCompletion >= 70) {
			insights.push("Solid workout! Consistency is key.");
		} else {
			insights.push("Good effort! Every rep counts toward progress.");
		}
		return insights;
	}

	// Multi-participant insights
	const avgCompletion =
		participants.reduce((sum, p) => sum + p.overallCompletion, 0) /
		participants.length;

	if (avgCompletion >= 90) {
		insights.push("Incredible team effort! Everyone crushed this workout!");
	} else if (avgCompletion >= 70) {
		insights.push("Great teamwork! Consistent performance across the board.");
	}

	// Find the winner
	const winner = participants.reduce((prev, current) =>
		prev.overallCompletion > current.overallCompletion ? prev : current,
	);

	if (winner.overallCompletion >= 90) {
		insights.push(
			`🏆 ${winner.userName} takes the win with ${winner.overallCompletion}% completion!`,
		);
	}

	// Check for close competition
	const sorted = [...participants].sort(
		(a, b) => b.overallCompletion - a.overallCompletion,
	);

	if (sorted.length >= 2) {
		const first = sorted[0];
		const second = sorted[1];
		if (!first || !second) return insights;
		const gap = first.overallCompletion - second.overallCompletion;
		if (gap <= 5 && gap >= 0) {
			insights.push(
				`What a close match! Just ${gap}% between ${first.userName} and ${second.userName}!`,
			);
		}
	}

	// Total effort
	const totalReps = participants.reduce(
		(sum, p) => sum + p.totalCompletedReps,
		0,
	);
	insights.push(
		`Combined effort: ${totalReps} reps completed by ${participants.length} participant${participants.length > 1 ? "s" : ""}`,
	);

	return insights;
}

describe("AI Summary - calculateExercisePercentage", () => {
	test("calculates 100% for perfect completion", () => {
		const result = calculateExercisePercentage([10, 10, 10], 3, 10);
		expect(result).toBe(100);
	});

	test("calculates partial completion correctly", () => {
		const result = calculateExercisePercentage([10, 8, 10], 3, 10);
		expect(result).toBe(93); // 28/30 = 93.33% -> 93%
	});

	test("handles missing reps (zeros)", () => {
		const result = calculateExercisePercentage([10, 0, 5], 3, 10);
		expect(result).toBe(50); // 15/30 = 50%
	});

	test("caps at 100% for超额完成", () => {
		const result = calculateExercisePercentage([12, 12, 12], 3, 10);
		expect(result).toBe(100); // 36/30 = 120% -> capped at 100%
	});

	test("handles empty completed reps", () => {
		const result = calculateExercisePercentage([], 3, 10);
		expect(result).toBe(0);
	});
});

describe("AI Summary - generateHighlights", () => {
	test("generates 'crushed it' for all perfect exercises", () => {
		const participant: ParticipantSummary = {
			userId: "1",
			userName: "Alice",
			exercises: [
				{
					exerciseName: "Pushup",
					targetSets: 3,
					targetReps: 10,
					targetTotalReps: 30,
					completedReps: [10, 10, 10],
					completedTotalReps: 30,
					completionPercentage: 100,
				},
				{
					exerciseName: "Squat",
					targetSets: 3,
					targetReps: 10,
					targetTotalReps: 30,
					completedReps: [10, 10, 10],
					completedTotalReps: 30,
					completionPercentage: 100,
				},
			],
			totalTargetReps: 60,
			totalCompletedReps: 60,
			overallCompletion: 100,
		};

		const highlights = generateHighlights(participant);
		expect(highlights).toContain(
			"Crushed it! Perfect completion on all exercises!",
		);
	});

	test("generates 'nailed X exercises' for partial perfect completion", () => {
		const participant: ParticipantSummary = {
			userId: "1",
			userName: "Alice",
			exercises: [
				{
					exerciseName: "Pushup",
					targetSets: 3,
					targetReps: 10,
					targetTotalReps: 30,
					completedReps: [10, 10, 10],
					completedTotalReps: 30,
					completionPercentage: 100,
				},
				{
					exerciseName: "Squat",
					targetSets: 3,
					targetReps: 10,
					targetTotalReps: 30,
					completedReps: [8, 8, 8],
					completedTotalReps: 24,
					completionPercentage: 80,
				},
			],
			totalTargetReps: 60,
			totalCompletedReps: 54,
			overallCompletion: 90,
		};

		const highlights = generateHighlights(participant);
		expect(highlights).toContain("Nailed 1 exercise with 100% completion");
	});

	test("identifies strongest performance", () => {
		const participant: ParticipantSummary = {
			userId: "1",
			userName: "Alice",
			exercises: [
				{
					exerciseName: "Pushup",
					targetSets: 3,
					targetReps: 10,
					targetTotalReps: 30,
					completedReps: [8, 8, 8],
					completedTotalReps: 24,
					completionPercentage: 80,
				},
				{
					exerciseName: "Squat",
					targetSets: 3,
					targetReps: 10,
					targetTotalReps: 30,
					completedReps: [10, 10, 10],
					completedTotalReps: 30,
					completionPercentage: 100,
				},
			],
			totalTargetReps: 60,
			totalCompletedReps: 54,
			overallCompletion: 90,
		};

		const highlights = generateHighlights(participant);
		expect(highlights).toContain("Strongest performance: Squat (100%)");
	});

	test("identifies areas to improve", () => {
		const participant: ParticipantSummary = {
			userId: "1",
			userName: "Alice",
			exercises: [
				{
					exerciseName: "Pushup",
					targetSets: 3,
					targetReps: 10,
					targetTotalReps: 30,
					completedReps: [10, 10, 10],
					completedTotalReps: 30,
					completionPercentage: 100,
				},
				{
					exerciseName: "Squat",
					targetSets: 3,
					targetReps: 10,
					targetTotalReps: 30,
					completedReps: [5, 5, 5],
					completedTotalReps: 15,
					completionPercentage: 50,
				},
			],
			totalTargetReps: 60,
			totalCompletedReps: 45,
			overallCompletion: 75,
		};

		const highlights = generateHighlights(participant);
		expect(highlights).toContain("Room for growth: Squat");
	});

	test("combines multiple highlight types", () => {
		const participant: ParticipantSummary = {
			userId: "1",
			userName: "Alice",
			exercises: [
				{
					exerciseName: "Pushup",
					targetSets: 3,
					targetReps: 10,
					targetTotalReps: 30,
					completedReps: [10, 10, 10],
					completedTotalReps: 30,
					completionPercentage: 100,
				},
				{
					exerciseName: "Pull Up",
					targetSets: 3,
					targetReps: 8,
					targetTotalReps: 24,
					completedReps: [8, 8, 8],
					completedTotalReps: 24,
					completionPercentage: 100,
				},
				{
					exerciseName: "Squat",
					targetSets: 3,
					targetReps: 10,
					targetTotalReps: 30,
					completedReps: [5, 5, 5],
					completedTotalReps: 15,
					completionPercentage: 50,
				},
			],
			totalTargetReps: 84,
			totalCompletedReps: 69,
			overallCompletion: 82,
		};

		const highlights = generateHighlights(participant);
		expect(highlights.length).toBeGreaterThan(1);
		expect(highlights.some((h) => h.includes("Nailed 2 exercises"))).toBe(true);
		expect(highlights.some((h) => h.includes("Room for growth"))).toBe(true);
	});
});

describe("AI Summary - generateComparisons", () => {
	test("generates comparisons for single participant", () => {
		const participants: ParticipantSummary[] = [
			{
				userId: "1",
				userName: "Alice",
				exercises: [],
				totalTargetReps: 60,
				totalCompletedReps: 54,
				overallCompletion: 90,
			},
		];

		const comparisons = generateComparisons(participants);
		expect(comparisons).toHaveLength(1);
		expect(comparisons[0]).toMatchObject({
			userId: "1",
			userName: "Alice",
			overallCompletion: 90,
			totalCompletedReps: 54,
			differenceFromWinner: 0,
			isWinner: true,
		});
	});

	test("generates comparisons for multiple participants", () => {
		const participants: ParticipantSummary[] = [
			{
				userId: "1",
				userName: "Alice",
				exercises: [],
				totalTargetReps: 60,
				totalCompletedReps: 60,
				overallCompletion: 100,
			},
			{
				userId: "2",
				userName: "Bob",
				exercises: [],
				totalTargetReps: 60,
				totalCompletedReps: 54,
				overallCompletion: 90,
			},
			{
				userId: "3",
				userName: "Charlie",
				exercises: [],
				totalTargetReps: 60,
				totalCompletedReps: 48,
				overallCompletion: 80,
			},
		];

		const comparisons = generateComparisons(participants);
		expect(comparisons).toHaveLength(3);

		// Alice should be winner
		expect(comparisons[0]).toMatchObject({
			userId: "1",
			userName: "Alice",
			isWinner: true,
			differenceFromWinner: 0,
		});

		// Bob should be 10% behind
		const bob = comparisons.find((c) => c.userId === "2");
		expect(bob?.differenceFromWinner).toBe(10);

		// Charlie should be 20% behind
		const charlie = comparisons.find((c) => c.userId === "3");
		expect(charlie?.differenceFromWinner).toBe(20);
	});

	test("handles tie correctly", () => {
		const participants: ParticipantSummary[] = [
			{
				userId: "1",
				userName: "Alice",
				exercises: [],
				totalTargetReps: 60,
				totalCompletedReps: 54,
				overallCompletion: 90,
			},
			{
				userId: "2",
				userName: "Bob",
				exercises: [],
				totalTargetReps: 60,
				totalCompletedReps: 54,
				overallCompletion: 90,
			},
		];

		const comparisons = generateComparisons(participants);
		expect(comparisons).toHaveLength(2);

		// Both should be marked as winner (tie)
		const [first, second] = comparisons;
		if (!first || !second) {
			throw new Error("Expected comparisons to contain two entries.");
		}
		expect(first.isWinner).toBe(true);
		expect(second.isWinner).toBe(true);
		expect(first.differenceFromWinner).toBe(0);
		expect(second.differenceFromWinner).toBe(0);
	});
});

describe("AI Summary - generateSessionInsights", () => {
	test("generates solo session insights for excellent performance", () => {
		const participants: ParticipantSummary[] = [
			{
				userId: "1",
				userName: "Alice",
				exercises: [],
				totalTargetReps: 60,
				totalCompletedReps: 60,
				overallCompletion: 100,
			},
		];

		const insights = generateSessionInsights(participants);
		expect(insights).toContain("Excellent solo session! You're on fire!");
	});

	test("generates solo session insights for solid performance", () => {
		const participants: ParticipantSummary[] = [
			{
				userId: "1",
				userName: "Alice",
				exercises: [],
				totalTargetReps: 60,
				totalCompletedReps: 45,
				overallCompletion: 75,
			},
		];

		const insights = generateSessionInsights(participants);
		expect(insights).toContain("Solid workout! Consistency is key.");
	});

	test("generates solo session insights for lower completion", () => {
		const participants: ParticipantSummary[] = [
			{
				userId: "1",
				userName: "Alice",
				exercises: [],
				totalTargetReps: 60,
				totalCompletedReps: 30,
				overallCompletion: 50,
			},
		];

		const insights = generateSessionInsights(participants);
		expect(insights).toContain(
			"Good effort! Every rep counts toward progress.",
		);
	});

	test("generates multi-participant insights for high average", () => {
		const participants: ParticipantSummary[] = [
			{
				userId: "1",
				userName: "Alice",
				exercises: [],
				totalTargetReps: 60,
				totalCompletedReps: 60,
				overallCompletion: 100,
			},
			{
				userId: "2",
				userName: "Bob",
				exercises: [],
				totalTargetReps: 60,
				totalCompletedReps: 57,
				overallCompletion: 95,
			},
		];

		const insights = generateSessionInsights(participants);
		expect(insights.length).toBeGreaterThan(0);
		expect(insights.some((i) => i.includes("team effort"))).toBe(true);
	});

	test("identifies winner with trophy emoji", () => {
		const participants: ParticipantSummary[] = [
			{
				userId: "1",
				userName: "Alice",
				exercises: [],
				totalTargetReps: 60,
				totalCompletedReps: 60,
				overallCompletion: 100,
			},
			{
				userId: "2",
				userName: "Bob",
				exercises: [],
				totalTargetReps: 60,
				totalCompletedReps: 54,
				overallCompletion: 90,
			},
		];

		const insights = generateSessionInsights(participants);
		expect(insights.some((i) => i.includes("🏆"))).toBe(true);
		expect(
			insights.some((i) => i.includes("Alice") && i.includes("100%")),
		).toBe(true);
	});

	test("detects close competition", () => {
		const participants: ParticipantSummary[] = [
			{
				userId: "1",
				userName: "Alice",
				exercises: [],
				totalTargetReps: 60,
				totalCompletedReps: 60,
				overallCompletion: 100,
			},
			{
				userId: "2",
				userName: "Bob",
				exercises: [],
				totalTargetReps: 60,
				totalCompletedReps: 57,
				overallCompletion: 95,
			},
		];

		const insights = generateSessionInsights(participants);
		expect(
			insights.some((i) => i.includes("close match") && i.includes("5%")),
		).toBe(true);
	});

	test("includes total effort count", () => {
		const participants: ParticipantSummary[] = [
			{
				userId: "1",
				userName: "Alice",
				exercises: [],
				totalTargetReps: 60,
				totalCompletedReps: 60,
				overallCompletion: 100,
			},
			{
				userId: "2",
				userName: "Bob",
				exercises: [],
				totalTargetReps: 60,
				totalCompletedReps: 54,
				overallCompletion: 90,
			},
		];

		const insights = generateSessionInsights(participants);
		expect(insights.some((i) => i.includes("114 reps"))).toBe(true);
		expect(insights.some((i) => i.includes("2 participants"))).toBe(true);
	});
});

describe("AI Summary - Integration scenarios", () => {
	test("complete summary for competitive session", () => {
		const participants: ParticipantSummary[] = [
			{
				userId: "1",
				userName: "Alice",
				exercises: [
					{
						exerciseName: "Pushup",
						targetSets: 3,
						targetReps: 10,
						targetTotalReps: 30,
						completedReps: [10, 10, 10],
						completedTotalReps: 30,
						completionPercentage: 100,
					},
					{
						exerciseName: "Squat",
						targetSets: 3,
						targetReps: 10,
						targetTotalReps: 30,
						completedReps: [10, 9, 10],
						completedTotalReps: 29,
						completionPercentage: 97,
					},
				],
				totalTargetReps: 60,
				totalCompletedReps: 59,
				overallCompletion: 98,
			},
			{
				userId: "2",
				userName: "Bob",
				exercises: [
					{
						exerciseName: "Pushup",
						targetSets: 3,
						targetReps: 10,
						targetTotalReps: 30,
						completedReps: [9, 9, 9],
						completedTotalReps: 27,
						completionPercentage: 90,
					},
					{
						exerciseName: "Squat",
						targetSets: 3,
						targetReps: 10,
						targetTotalReps: 30,
						completedReps: [10, 10, 10],
						completedTotalReps: 30,
						completionPercentage: 100,
					},
				],
				totalTargetReps: 60,
				totalCompletedReps: 57,
				overallCompletion: 95,
			},
		];

		// Generate all components
		const comparisons = generateComparisons(participants);
		const insights = generateSessionInsights(participants);
		const highlights = participants.map((p) => ({
			user: p.userName,
			highlights: generateHighlights(p),
		}));

		// Verify structure
		expect(comparisons).toHaveLength(2);
		expect(insights.length).toBeGreaterThan(0);
		expect(highlights).toHaveLength(2);

		// Verify winner
		const [firstComparison, secondComparison] = comparisons;
		if (!firstComparison || !secondComparison) {
			throw new Error("Expected comparisons to contain two entries.");
		}
		expect(firstComparison.userName).toBe("Alice");
		expect(firstComparison.isWinner).toBe(true);

		// Verify gap
		expect(secondComparison.differenceFromWinner).toBe(3);

		// Verify close competition detected
		expect(insights.some((i) => i.includes("close match"))).toBe(true);
	});

	test("complete summary for mixed performance session", () => {
		const participants: ParticipantSummary[] = [
			{
				userId: "1",
				userName: "Alice",
				exercises: [
					{
						exerciseName: "Pushup",
						targetSets: 3,
						targetReps: 10,
						targetTotalReps: 30,
						completedReps: [10, 10, 10],
						completedTotalReps: 30,
						completionPercentage: 100,
					},
					{
						exerciseName: "Squat",
						targetSets: 3,
						targetReps: 10,
						targetTotalReps: 30,
						completedReps: [4, 4, 4],
						completedTotalReps: 12,
						completionPercentage: 40,
					},
				],
				totalTargetReps: 60,
				totalCompletedReps: 42,
				overallCompletion: 70,
			},
		];

		const [participant] = participants;
		if (!participant) {
			throw new Error("Expected participant data.");
		}
		const highlights = generateHighlights(participant);

		// Should have both positive and improvement highlights
		expect(highlights.some((h) => h.includes("Nailed 1 exercise"))).toBe(true);
		expect(highlights.some((h) => h.includes("Room for growth"))).toBe(true);
	});
});
