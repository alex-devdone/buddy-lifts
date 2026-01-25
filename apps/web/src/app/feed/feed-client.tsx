"use client";

import { useState } from "react";
import type { FeedFilter } from "@/components/feed/training-feed";
import { TrainingFeed } from "@/components/feed/training-feed";

interface FeedClientProps {
	currentUserId: string;
}

export function FeedClient({ currentUserId }: FeedClientProps) {
	const [filter, _setFilter] = useState<FeedFilter>("all");

	return (
		<div className="mt-6">
			<TrainingFeed currentUserId={currentUserId} filter={filter} />
		</div>
	);
}
