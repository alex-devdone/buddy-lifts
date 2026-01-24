import { env } from "@buddy-lifts/env/web";
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
	return createBrowserClient(
		env.NEXT_PUBLIC_SUPABASE_URL,
		env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	);
}
