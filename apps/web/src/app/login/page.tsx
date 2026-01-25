"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export default function LoginPage() {
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
