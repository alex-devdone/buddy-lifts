import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for FeedItem component.
 * Mimics the structure of a training feed item with avatar, title, metadata, and button.
 */
export function FeedItemSkeleton() {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between gap-2">
					<div className="flex min-w-0 flex-1 items-start gap-2">
						{/* Avatar Skeleton */}
						<Skeleton className="h-8 w-8 shrink-0 rounded-full" />
						<div className="min-w-0 flex-1 space-y-2">
							{/* Title Skeleton */}
							<Skeleton className="h-4 w-3/4" />
							{/* User Name Skeleton */}
							<Skeleton className="h-3 w-1/2" />
						</div>
					</div>
				</div>
				{/* Description Skeleton */}
				<Skeleton className="h-4 w-full" />
				<Skeleton className="mt-1 h-4 w-2/3" />
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{/* Metadata Skeleton */}
					<div className="flex flex-wrap items-center gap-3">
						<div className="flex items-center gap-1">
							<Skeleton className="h-3 w-3" />
							<Skeleton className="h-3 w-16" />
						</div>
						<div className="flex items-center gap-1">
							<Skeleton className="h-3 w-3" />
							<Skeleton className="h-3 w-20" />
						</div>
					</div>
					{/* Button Skeleton */}
					<Skeleton className="h-8 w-full" />
				</div>
			</CardContent>
		</Card>
	);
}
