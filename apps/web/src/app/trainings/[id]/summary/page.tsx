import { auth } from "@buddy-lifts/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { SessionSummary } from "./session-summary";

interface PageProps {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ sessionId?: string }>;
}

export default async function SessionSummaryPage({
	params,
	searchParams,
}: PageProps) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	const { id: trainingId } = await params;
	const { sessionId } = await searchParams;

	if (!sessionId) {
		redirect(`/trainings/${trainingId}`);
	}

	return (
		<div className="container max-w-6xl px-4 py-6 md:px-6 md:py-8">
			<SessionSummary
				trainingId={trainingId}
				sessionId={sessionId}
				currentUserId={session.user.id}
			/>
		</div>
	);
}
