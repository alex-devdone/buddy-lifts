import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for friend request card and friend list item.
 * Mimics the structure with avatar, name, email, and action buttons.
 */
export function FriendCardSkeleton() {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-3">
					{/* Avatar Skeleton */}
					<Skeleton className="h-10 w-10 shrink-0 rounded-full" />
					<div className="min-w-0 flex-1 space-y-2">
						{/* Name Skeleton */}
						<CardTitle>
							<Skeleton className="h-4 w-32" />
						</CardTitle>
						{/* Email Skeleton */}
						<Skeleton className="h-3 w-48" />
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between">
					{/* Status/Time Skeleton */}
					<Skeleton className="h-3 w-24" />
					{/* Action Buttons Skeleton */}
					<div className="flex items-center gap-2">
						<Skeleton className="h-8 w-16" />
						<Skeleton className="h-8 w-16" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
