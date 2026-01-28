import { auth } from "@buddy-lifts/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { TrainingDetail } from "./training-detail";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function TrainingDetailPage({ params }: PageProps) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	const { id } = await params;

	return (
		<div className="container max-w-4xl px-4 py-8 md:px-6">
			<TrainingDetail trainingId={id} currentUserId={session.user.id} />
		</div>
	);
}
