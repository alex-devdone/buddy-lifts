import {
	normalizeExerciseName,
	parseExercise,
	parseExerciseInput,
} from "../../utils/exercise-parser";

describe("Exercise Parser", () => {
	describe("normalizeExerciseName", () => {
		test("capitalizes first letter of each word", () => {
			expect(normalizeExerciseName("pushup")).toBe("Pushup");
			expect(normalizeExerciseName("bench press")).toBe("Bench Press");
			expect(normalizeExerciseName("bicep curls")).toBe("Bicep Curls");
		});

		test("trims whitespace", () => {
			expect(normalizeExerciseName("  pushup  ")).toBe("Pushup");
			expect(normalizeExerciseName("  bench   press  ")).toBe("Bench Press");
		});
	});

	describe("Standard pattern (NxM or MxN)", () => {
		test("parses '10x4 pushup' as 10 reps, 4 sets", () => {
			const result = parseExercise("10x4 pushup");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Pushup");
			expect(result?.targetReps).toBe(10);
			expect(result?.targetSets).toBe(4);
		});

		test("parses '4x10 pushup' as 10 reps, 4 sets (heuristic)", () => {
			const result = parseExercise("4x10 pushup");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Pushup");
			expect(result?.targetReps).toBe(10);
			expect(result?.targetSets).toBe(4);
		});

		test("parses '5x5 squat' correctly", () => {
			const result = parseExercise("5x5 squat");
			expect(result).not.toBeNull();
			// When equal, either assignment is fine
			expect(result?.targetReps).toBe(5);
			expect(result?.targetSets).toBe(5);
		});

		test("parses '10x4 pushup at 135lbs' with weight", () => {
			const result = parseExercise("10x4 pushup at 135lbs");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Pushup");
			expect(result?.targetReps).toBe(10);
			expect(result?.targetSets).toBe(4);
			expect(result?.weight).toBe(135);
		});

		test("parses '10x4 pushup, 60s rest' with rest time", () => {
			const result = parseExercise("10x4 pushup, 60s rest");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Pushup");
			expect(result?.targetReps).toBe(10);
			expect(result?.targetSets).toBe(4);
			expect(result?.restSeconds).toBe(60);
		});

		test("parses with asterisk separator '10*4 pushup'", () => {
			const result = parseExercise("10*4 pushup");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Pushup");
			expect(result?.targetReps).toBe(10);
			expect(result?.targetSets).toBe(4);
		});

		test("parses weight with kg '10x4 bench press at 50kg'", () => {
			const result = parseExercise("10x4 bench press at 50kg");
			expect(result).not.toBeNull();
			expect(result?.weight).toBe(50);
		});
	});

	describe("Sets list pattern (comma-separated reps)", () => {
		test("parses '10,10,8,6 pull ups' as 4 sets", () => {
			const result = parseExercise("10,10,8,6 pull ups");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Pull Ups");
			expect(result?.targetSets).toBe(4);
			expect(result?.targetReps).toBe(9); // Average of 10,10,8,6 = 8.5, rounded to 9
			expect(result?.completedReps).toEqual([10, 10, 8, 6]);
		});

		test("parses '12, 10, 8 bench press' with spaces", () => {
			const result = parseExercise("12, 10, 8 bench press");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Bench Press");
			expect(result?.targetSets).toBe(3);
			expect(result?.completedReps).toEqual([12, 10, 8]);
		});

		test("parses sets list with weight '135, 125, 115 deadlift at 200lbs'", () => {
			const result = parseExercise("135, 125, 115 deadlift at 200lbs");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Deadlift");
			expect(result?.targetSets).toBe(3);
			expect(result?.weight).toBe(200);
		});
	});

	describe("Words pattern ('sets of')", () => {
		test("parses '5 sets of 10 pushups'", () => {
			const result = parseExercise("5 sets of 10 pushups");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Pushups");
			expect(result?.targetSets).toBe(5);
			expect(result?.targetReps).toBe(10);
		});

		test("parses '3 set of 12 squat' (singular set)", () => {
			const result = parseExercise("3 set of 12 squat");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Squat");
			expect(result?.targetSets).toBe(3);
			expect(result?.targetReps).toBe(12);
		});

		test("parses '4 sets of 8 bench press at 135lbs'", () => {
			const result = parseExercise("4 sets of 8 bench press at 135lbs");
			expect(result).not.toBeNull();
			expect(result?.name).toBe("Bench Press");
			expect(result?.targetSets).toBe(4);
			expect(result?.targetReps).toBe(8);
			expect(result?.weight).toBe(135);
		});
	});

	describe("Multiple exercises", () => {
		test("parses '10x4 pushup, 10,10,8,6 pull ups' as two exercises", () => {
			const result = parseExerciseInput("10x4 pushup, 10,10,8,6 pull ups");
			expect(result).toHaveLength(2);
			expect(result[0]).toMatchObject({
				name: "Pushup",
				targetSets: 4,
				targetReps: 10,
			});
			expect(result[1]).toMatchObject({
				name: "Pull Ups",
				targetSets: 4,
			});
		});

		test("parses '10x4 pushup and 3x12 bench press' with 'and' separator", () => {
			const result = parseExerciseInput("10x4 pushup and 3x12 bench press");
			expect(result).toHaveLength(2);
			expect(result[0]?.name).toBe("Pushup");
			expect(result[1]?.name).toBe("Bench Press");
		});

		test("handles 'between' keyword by adding rest to previous exercise", () => {
			const result = parseExerciseInput(
				"10x4 pushup, 10,10,8,6 pull ups between",
			);
			expect(result).toHaveLength(2);
			expect(result[0]).toMatchObject({
				name: "Pushup",
				restSeconds: 60,
			});
			expect(result[1]?.name).toBe("Pull Ups");
		});

		test("parses three exercises", () => {
			const result = parseExerciseInput(
				"10x4 pushup, 3x12 bench press, 5x5 squat",
			);
			expect(result).toHaveLength(3);
			expect(result[0]?.name).toBe("Pushup");
			expect(result[1]?.name).toBe("Bench Press");
			expect(result[2]?.name).toBe("Squat");
		});
	});

	describe("Edge cases", () => {
		test("returns null for unparseable input", () => {
			expect(parseExercise("hello world")).toBeNull();
			expect(parseExercise("pushup")).toBeNull();
			expect(parseExercise("")).toBeNull();
		});

		test("returns empty array for unparseable multi-exercise input", () => {
			const result = parseExerciseInput("hello world and foo bar");
			expect(result).toHaveLength(0);
		});
	});
});
