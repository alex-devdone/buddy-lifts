import { auth } from "@buddy-lifts/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { JoinPageClient } from "./join-page-client";

interface PageProps {
	params: Promise<{ code: string }>;
	searchParams: Promise<{ access?: string }>;
}

/**
 * Join Page - Server Component
 *
 * Handles invite link flow:
 * 1. Check authentication - redirect to /login with invite code if not authenticated
 * 2. Render client component to handle session join
 * 3. Redirect to active session page after successful join
 *
 * URL Pattern: /join/[code]
 * Example: /join/ABC12345
 *
 * The invite code is saved in localStorage on the login page
 * so users can be redirected back after authentication.
 */
export default async function JoinPage({ params, searchParams }: PageProps) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		// Not authenticated - redirect to login with invite code
		// The login page will save this code and redirect back after auth
		const { code } = await params;
		const { access } = await searchParams;
		const accessParam =
			access === "read" || access === "admin" ? `?access=${access}` : "";
		const redirectPath = `/join/${code}${accessParam}`;
		redirect(`/login?redirect=${encodeURIComponent(redirectPath)}`);
	}

	const { code: inviteCode } = await params;

	return (
		<div className="container flex min-h-screen items-center justify-center px-4 py-8 md:px-6">
			<JoinPageClient inviteCode={inviteCode} />
		</div>
	);
}
