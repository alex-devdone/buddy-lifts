import type { User } from "@supabase/supabase-js";
import { createClient } from "./client";

export const supabaseAuth = {
	/**
	 * Sign up with email and password
	 */
	async signUp(email: string, password: string) {
		const supabase = createClient();
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});
		return { data, error };
	},

	/**
	 * Sign in with email and password
	 */
	async signIn(email: string, password: string) {
		const supabase = createClient();
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		return { data, error };
	},

	/**
	 * Sign out
	 */
	async signOut() {
		const supabase = createClient();
		const { error } = await supabase.auth.signOut();
		return { error };
	},

	/**
	 * Get current user
	 */
	async getUser(): Promise<User | null> {
		const supabase = createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		return user;
	},

	/**
	 * Get current session
	 */
	async getSession() {
		const supabase = createClient();
		const {
			data: { session },
		} = await supabase.auth.getSession();
		return session;
	},

	/**
	 * Sign in with OAuth provider
	 */
	async signInWithOAuth(provider: "google" | "github" | "discord") {
		const supabase = createClient();
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
		return { data, error };
	},

	/**
	 * Reset password
	 */
	async resetPassword(email: string) {
		const supabase = createClient();
		const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/auth/reset-password`,
		});
		return { data, error };
	},

	/**
	 * Update password
	 */
	async updatePassword(newPassword: string) {
		const supabase = createClient();
		const { data, error } = await supabase.auth.updateUser({
			password: newPassword,
		});
		return { data, error };
	},
};
