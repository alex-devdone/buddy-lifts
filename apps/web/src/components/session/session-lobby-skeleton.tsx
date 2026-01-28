import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for SessionLobby component.
 * Mimics the structure with invite code, access toggle, and participant list.
 */
export function SessionLobbySkeleton() {
	return (
		<div className="space-y-4">
			{/* Invite Code Card Skeleton */}
			<Card>
				<CardHeader>
					<CardTitle>
						<Skeleton className="h-5 w-32" />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{/* Invite Code Display Skeleton */}
						<Skeleton className="h-10 w-full" />
						{/* Access Type Toggle Skeleton */}
						<Skeleton className="h-6 w-full" />
					</div>
				</CardContent>
			</Card>

			{/* Participants Section Skeleton */}
			<div className="space-y-3">
				{/* Section Header Skeleton */}
				<Skeleton className="h-5 w-24" />
				{/* Participant Card Skeletons */}
				{Array.from({ length: 2 }).map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton items are static
					<Card key={index}>
						<CardContent className="flex items-center gap-3 p-4">
							{/* Avatar Skeleton */}
							<Skeleton className="h-10 w-10 shrink-0 rounded-full" />
							<div className="min-w-0 flex-1 space-y-2">
								{/* Name Skeleton */}
								<Skeleton className="h-4 w-32" />
								{/* Role Badge Skeleton */}
								<Skeleton className="h-3 w-16" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Action Button Skeleton */}
			<Skeleton className="h-11 w-full" />
		</div>
	);
}
