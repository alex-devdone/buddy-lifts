import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ExerciseChecklistSkeletonProps {
	/** Number of skeleton items to display */
	count?: number;
}

/**
 * Loading skeleton for ExerciseChecklist component.
 * Mimics the structure with checkboxes, exercise names, and set/reps information.
 */
export function ExerciseChecklistSkeleton({
	count = 3,
}: ExerciseChecklistSkeletonProps) {
	return (
		<Card>
			<CardContent className="space-y-3 p-4">
				{Array.from({ length: count }).map((_, index) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton items are static
						key={index}
						className="flex items-start gap-3 rounded-md border p-3"
					>
						{/* Checkbox Skeleton */}
						<Skeleton className="h-4 w-4 shrink-0" />
						<div className="min-w-0 flex-1 space-y-2">
							{/* Exercise Name Skeleton */}
							<Skeleton className="h-4 w-3/4" />
							{/* Sets/Reps Info Skeleton */}
							<Skeleton className="h-3 w-1/2" />
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
