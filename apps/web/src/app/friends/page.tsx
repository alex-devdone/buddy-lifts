import { auth } from "@buddy-lifts/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { FriendsPageClient } from "./friends-page-client";

export default async function FriendsPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div className="container max-w-4xl px-4 py-8 md:px-6">
			<h1 className="font-bold text-2xl tracking-tight md:text-3xl">Friends</h1>
			<p className="text-muted-foreground text-sm md:text-base">
				Manage your friends and requests
			</p>
			<FriendsPageClient currentUserId={session.user.id} />
		</div>
	);
}
