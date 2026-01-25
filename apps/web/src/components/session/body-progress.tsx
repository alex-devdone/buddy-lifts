"use client";

import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";

interface BodyProgressProps {
	sessionId: string;
	userId: string;
	trainingId: string;
	showLabel?: boolean;
	size?: "sm" | "md" | "lg";
}

interface ExerciseProgress {
	id: string;
	sessionId: string;
	userId: string;
	exerciseId: string;
	completedReps: string;
	completedAt: string | null;
}

interface Exercise {
	id: string;
	trainingId: string;
	name: string;
	targetSets: number;
	targetReps: number;
	weight: number | null;
	order: number;
	restSeconds: number | null;
}

type MuscleGroup =
	| "chest"
	| "back"
	| "shoulders"
	| "biceps"
	| "triceps"
	| "abs"
	| "quads"
	| "hamstrings"
	| "calves";

const EXERCISE_MUSCLE_MAP: Record<string, MuscleGroup[]> = {
	// Chest
	bench: ["chest"],
	press: ["chest", "triceps"],
	"dumbbell press": ["chest", "triceps"],
	"dumbbell fly": ["chest"],
	"incline press": ["chest", "shoulders"],
	"decline press": ["chest"],
	"push up": ["chest", "triceps", "shoulders"],
	pushup: ["chest", "triceps", "shoulders"],
	"pec deck": ["chest"],
	crossover: ["chest"],

	// Back
	"pull up": ["back", "biceps"],
	pullup: ["back", "biceps"],
	"lat pulldown": ["back", "biceps"],
	row: ["back", "biceps"],
	"seated row": ["back", "biceps"],
	"bent over row": ["back", "biceps"],
	deadlift: ["back", "hamstrings", "quads"],
	"t bar row": ["back", "biceps"],
	chinup: ["back", "biceps"],

	// Shoulders
	"shoulder press": ["shoulders", "triceps"],
	"military press": ["shoulders", "triceps"],
	"lateral raise": ["shoulders"],
	"front raise": ["shoulders"],
	"reverse fly": ["shoulders"],
	"upright row": ["shoulders"],
	"arnold press": ["shoulders"],

	// Biceps
	curl: ["biceps"],
	"bicep curl": ["biceps"],
	"hammer curl": ["biceps", "forearms"],
	"preacher curl": ["biceps"],
	"concentration curl": ["biceps"],
	"barbell curl": ["biceps"],

	// Triceps
	"tricep extension": ["triceps"],
	"tricep pushdown": ["triceps"],
	skullcrusher: ["triceps"],
	"overhead extension": ["triceps"],
	dip: ["triceps", "chest"],
	"close grip bench": ["triceps", "chest"],

	// Abs
	crunch: ["abs"],
	"sit up": ["abs"],
	plank: ["abs"],
	"leg raise": ["abs"],
	"russian twist": ["abs"],
	"ab roller": ["abs"],
	"hanging leg raise": ["abs"],
	cable: ["abs"],

	// Legs
	squat: ["quads", "hamstrings", "glutes"],
	"leg press": ["quads", "hamstrings"],
	"leg extension": ["quads"],
	"leg curl": ["hamstrings"],
	lunge: ["quads", "hamstrings", "glutes"],
	"calf raise": ["calves"],
	"hack squat": ["quads"],
	"bulgarian split squat": ["quads", "hamstrings", "glutes"],

	// Default fallback
	default: ["chest"],
};

/**
 * Detect muscle groups from exercise name
 */
function detectMuscleGroups(exerciseName: string): MuscleGroup[] {
	const normalizedName = exerciseName.toLowerCase();

	for (const [key, muscleGroups] of Object.entries(EXERCISE_MUSCLE_MAP)) {
		if (normalizedName.includes(key)) {
			return muscleGroups;
		}
	}

	return EXERCISE_MUSCLE_MAP.default;
}

/**
 * Calculate overall progress percentage (0-100)
 */
function calculateProgressPercentage(
	completedExercises: ExerciseProgress[],
	totalExercises: Exercise[],
): number {
	if (totalExercises.length === 0) return 0;
	return Math.round((completedExercises.length / totalExercises.length) * 100);
}

/**
 * Calculate muscle group completion percentage
 */
function calculateMuscleProgress(
	completedExercises: ExerciseProgress[],
	totalExercises: Exercise[],
	muscleGroup: MuscleGroup,
): number {
	// Get exercises targeting this muscle group
	const exercisesForMuscle = totalExercises.filter((exercise) => {
		const muscles = detectMuscleGroups(exercise.name);
		return muscles.includes(muscleGroup);
	});

	if (exercisesForMuscle.length === 0) return 0;

	// Count completed exercises for this muscle group
	const completedExerciseIds = new Set(
		completedExercises.map((e) => e.exerciseId),
	);
	const completedForMuscle = exercisesForMuscle.filter((exercise) =>
		completedExerciseIds.has(exercise.id),
	);

	return Math.round(
		(completedForMuscle.length / exercisesForMuscle.length) * 100,
	);
}

/**
 * Get size classes based on size prop
 */
function getSizeClasses(size: "sm" | "md" | "lg"): string {
	const baseSize = "h-full w-full";
	const containerSizes = {
		sm: "h-32 w-24",
		md: "h-48 w-32",
		lg: "h-64 w-48",
	};
	return `${baseSize} ${containerSizes[size]}`;
}

/**
 * BodyProgress Component
 *
 * Displays an SVG human body with muscle growth animation based on workout progress.
 * Progress is calculated from completed exercises vs total exercises.
 * Muscle groups animate from thin (0%) to muscular (100%) based on relevant exercise completion.
 *
 * Mobile-first design with responsive sizing options.
 */
export function BodyProgress({
	sessionId,
	userId,
	trainingId,
	showLabel = true,
	size = "md",
}: BodyProgressProps) {
	// Fetch all exercises for the training using Supabase (read)
	const { data: exercises = [], isLoading: exercisesLoading } =
		useSupabaseQuery<Exercise>({
			queryFn: (supabase) =>
				supabase
					.from("exercise")
					.select("*")
					.eq("trainingId", trainingId)
					.order("order", { ascending: true }),
			realtime: true,
			table: "exercise",
		});

	// Fetch exercise progress for this user using Supabase (read)
	const { data: allProgress = [], isLoading: progressLoading } =
		useSupabaseQuery<ExerciseProgress>({
			queryFn: (supabase) =>
				supabase
					.from("exercise_progress")
					.select("*")
					.eq("sessionId", sessionId)
					.eq("userId", userId),
			realtime: true,
			table: "exercise_progress",
		});

	// Filter only completed exercises
	const completedExercises = allProgress.filter((p) => p.completedAt);

	// Calculate overall progress
	const overallProgress = calculateProgressPercentage(
		completedExercises,
		exercises,
	);

	// Calculate muscle-specific progress
	const muscleProgress: Record<MuscleGroup, number> = {
		chest: calculateMuscleProgress(completedExercises, exercises, "chest"),
		back: calculateMuscleProgress(completedExercises, exercises, "back"),
		shoulders: calculateMuscleProgress(
			completedExercises,
			exercises,
			"shoulders",
		),
		biceps: calculateMuscleProgress(completedExercises, exercises, "biceps"),
		triceps: calculateMuscleProgress(completedExercises, exercises, "triceps"),
		abs: calculateMuscleProgress(completedExercises, exercises, "abs"),
		quads: calculateMuscleProgress(completedExercises, exercises, "quads"),
		hamstrings: calculateMuscleProgress(
			completedExercises,
			exercises,
			"hamstrings",
		),
		calves: calculateMuscleProgress(completedExercises, exercises, "calves"),
	};

	// Get color based on progress level
	const getProgressColor = (progress: number): string => {
		if (progress === 100) return "#22c55e"; // green-500
		if (progress >= 75) return "#84cc16"; // lime-500
		if (progress >= 50) return "#eab308"; // yellow-500
		if (progress >= 25) return "#f97316"; // orange-500
		return "#ef4444"; // red-500
	};

	// Calculate scale factor based on progress (1.0 = thin, 1.3 = muscular)
	const getScaleFactor = (progress: number): number => {
		return 1 + progress * 0.003; // 0% -> 1.0, 100% -> 1.3
	};

	if (exercisesLoading || progressLoading) {
		return (
			<div className="flex items-center justify-center py-4">
				<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<Card className="border-none bg-transparent shadow-none">
			<CardContent className="flex flex-col items-center gap-2 p-0">
				{/* SVG Body */}
				<div className={getSizeClasses(size)}>
					<svg
						viewBox="0 0 100 200"
						className="h-full w-full drop-shadow-md"
						xmlns="http://www.w3.org/2000/svg"
						role="img"
						aria-label={`Body progress visualization showing ${overallProgress}% complete`}
					>
						{/* Head */}
						<circle
							cx="50"
							cy="15"
							r="10"
							fill="#f5d0b0"
							stroke="#d4a574"
							strokeWidth="1"
						/>

						{/* Neck */}
						<rect
							x="45"
							y="24"
							width="10"
							height="8"
							fill="#f5d0b0"
							stroke="#d4a574"
							strokeWidth="0.5"
						/>

						{/* Torso */}
						{/* Chest */}
						<ellipse
							cx="50"
							cy="50"
							rx={20 * getScaleFactor(muscleProgress.chest)}
							ry={18 * getScaleFactor(muscleProgress.chest)}
							fill={getProgressColor(muscleProgress.chest)}
							fillOpacity={0.3 + muscleProgress.chest * 0.007}
							className="transition-all duration-700 ease-out"
						/>

						{/* Abs */}
						<rect
							x={50 - 12 * getScaleFactor(muscleProgress.abs)}
							y="60"
							width={24 * getScaleFactor(muscleProgress.abs)}
							height={25 * getScaleFactor(muscleProgress.abs)}
							rx="2"
							fill={getProgressColor(muscleProgress.abs)}
							fillOpacity={0.3 + muscleProgress.abs * 0.007}
							className="transition-all duration-700 ease-out"
						/>

						{/* Arms */}
						{/* Left bicep */}
						<ellipse
							cx={25 - muscleProgress.biceps * 0.03}
							cy="50"
							rx={5 * getScaleFactor(muscleProgress.biceps)}
							ry={8 * getScaleFactor(muscleProgress.biceps)}
							fill={getProgressColor(muscleProgress.biceps)}
							fillOpacity={0.3 + muscleProgress.biceps * 0.007}
							className="transition-all duration-700 ease-out"
						/>

						{/* Right bicep */}
						<ellipse
							cx={75 + muscleProgress.biceps * 0.03}
							cy="50"
							rx={5 * getScaleFactor(muscleProgress.biceps)}
							ry={8 * getScaleFactor(muscleProgress.biceps)}
							fill={getProgressColor(muscleProgress.biceps)}
							fillOpacity={0.3 + muscleProgress.biceps * 0.007}
							className="transition-all duration-700 ease-out"
						/>

						{/* Left tricep */}
						<ellipse
							cx={22 - muscleProgress.triceps * 0.03}
							cy="55"
							rx={4 * getScaleFactor(muscleProgress.triceps)}
							ry={7 * getScaleFactor(muscleProgress.triceps)}
							fill={getProgressColor(muscleProgress.triceps)}
							fillOpacity={0.3 + muscleProgress.triceps * 0.007}
							className="transition-all duration-700 ease-out"
						/>

						{/* Right tricep */}
						<ellipse
							cx={78 + muscleProgress.triceps * 0.03}
							cy="55"
							rx={4 * getScaleFactor(muscleProgress.triceps)}
							ry={7 * getScaleFactor(muscleProgress.triceps)}
							fill={getProgressColor(muscleProgress.triceps)}
							fillOpacity={0.3 + muscleProgress.triceps * 0.007}
							className="transition-all duration-700 ease-out"
						/>

						{/* Shoulders */}
						{/* Left shoulder */}
						<circle
							cx={32 - muscleProgress.shoulders * 0.03}
							cy="35"
							r={5 * getScaleFactor(muscleProgress.shoulders)}
							fill={getProgressColor(muscleProgress.shoulders)}
							fillOpacity={0.3 + muscleProgress.shoulders * 0.007}
							className="transition-all duration-700 ease-out"
						/>

						{/* Right shoulder */}
						<circle
							cx={68 + muscleProgress.shoulders * 0.03}
							cy="35"
							r={5 * getScaleFactor(muscleProgress.shoulders)}
							fill={getProgressColor(muscleProgress.shoulders)}
							fillOpacity={0.3 + muscleProgress.shoulders * 0.007}
							className="transition-all duration-700 ease-out"
						/>

						{/* Forearms */}
						<rect
							x={20 - muscleProgress.biceps * 0.02}
							y="58"
							width="4"
							height="20"
							rx="2"
							fill="#f5d0b0"
							stroke="#d4a574"
							strokeWidth="0.5"
						/>
						<rect
							x={76 + muscleProgress.biceps * 0.02}
							y="58"
							width="4"
							height="20"
							rx="2"
							fill="#f5d0b0"
							stroke="#d4a574"
							strokeWidth="0.5"
						/>

						{/* Hands */}
						<circle
							cx="22"
							cy="80"
							r="3"
							fill="#f5d0b0"
							stroke="#d4a574"
							strokeWidth="0.5"
						/>
						<circle
							cx="78"
							cy="80"
							r="3"
							fill="#f5d0b0"
							stroke="#d4a574"
							strokeWidth="0.5"
						/>

						{/* Legs */}
						{/* Left quad */}
						<rect
							x={35 - muscleProgress.quads * 0.04}
							y="85"
							width={10 * getScaleFactor(muscleProgress.quads)}
							height={35 * getScaleFactor(muscleProgress.quads)}
							rx="3"
							fill={getProgressColor(muscleProgress.quads)}
							fillOpacity={0.3 + muscleProgress.quads * 0.007}
							className="transition-all duration-700 ease-out"
						/>

						{/* Right quad */}
						<rect
							x={55 + muscleProgress.quads * 0.04}
							y="85"
							width={10 * getScaleFactor(muscleProgress.quads)}
							height={35 * getScaleFactor(muscleProgress.quads)}
							rx="3"
							fill={getProgressColor(muscleProgress.quads)}
							fillOpacity={0.3 + muscleProgress.quads * 0.007}
							className="transition-all duration-700 ease-out"
						/>

						{/* Left hamstring */}
						<rect
							x={36 - muscleProgress.hamstrings * 0.03}
							y="95"
							width={6 * getScaleFactor(muscleProgress.hamstrings)}
							height={20 * getScaleFactor(muscleProgress.hamstrings)}
							rx="2"
							fill={getProgressColor(muscleProgress.hamstrings)}
							fillOpacity={0.3 + muscleProgress.hamstrings * 0.007}
							className="transition-all duration-700 ease-out"
						/>

						{/* Right hamstring */}
						<rect
							x={58 + muscleProgress.hamstrings * 0.03}
							y="95"
							width={6 * getScaleFactor(muscleProgress.hamstrings)}
							height={20 * getScaleFactor(muscleProgress.hamstrings)}
							rx="2"
							fill={getProgressColor(muscleProgress.hamstrings)}
							fillOpacity={0.3 + muscleProgress.hamstrings * 0.007}
							className="transition-all duration-700 ease-out"
						/>

						{/* Calves */}
						{/* Left calf */}
						<ellipse
							cx="40"
							cy={140 + muscleProgress.calves * 0.02}
							rx={5 * getScaleFactor(muscleProgress.calves)}
							ry={12 * getScaleFactor(muscleProgress.calves)}
							fill={getProgressColor(muscleProgress.calves)}
							fillOpacity={0.3 + muscleProgress.calves * 0.007}
							className="transition-all duration-700 ease-out"
						/>

						{/* Right calf */}
						<ellipse
							cx="60"
							cy={140 + muscleProgress.calves * 0.02}
							rx={5 * getScaleFactor(muscleProgress.calves)}
							ry={12 * getScaleFactor(muscleProgress.calves)}
							fill={getProgressColor(muscleProgress.calves)}
							fillOpacity={0.3 + muscleProgress.calves * 0.007}
							className="transition-all duration-700 ease-out"
						/>

						{/* Feet */}
						<ellipse cx="40" cy="165" rx="6" ry="4" fill="#333" />
						<ellipse cx="60" cy="165" rx="6" ry="4" fill="#333" />
					</svg>
				</div>

				{/* Progress label */}
				{showLabel && (
					<div className="flex items-center gap-2">
						<span className="font-bold text-lg">{overallProgress}%</span>
						<span className="text-muted-foreground text-xs">
							({completedExercises.length}/{exercises.length})
						</span>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
