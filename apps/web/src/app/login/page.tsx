"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

function LoginPageContent() {
	const searchParams = useSearchParams();
	const redirectPath = searchParams.get("redirect") || "/dashboard";
	const [showSignIn, setShowSignIn] = useState(false);

	return showSignIn ? (
		<SignInForm
			onSwitchToSignUp={() => setShowSignIn(false)}
			redirectPath={redirectPath}
		/>
	) : (
		<SignUpForm
			onSwitchToSignIn={() => setShowSignIn(true)}
			redirectPath={redirectPath}
		/>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<LoginPageContent />
		</Suspense>
	);
}
