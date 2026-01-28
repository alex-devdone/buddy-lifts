import { auth } from "@buddy-lifts/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { TrainingForm } from "@/components/training/training-form";

export default async function NewTrainingPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div className="container max-w-4xl px-4 py-8 md:px-6">
			<TrainingForm
				onSuccess={(training) => {
					redirect(`/trainings/${training.id}`);
				}}
			/>
		</div>
	);
}
