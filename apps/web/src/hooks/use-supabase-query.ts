import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

interface UseSupabaseQueryOptions<T> {
	/**
	 * Query builder function
	 */
	queryFn: (
		supabase: ReturnType<typeof createBrowserClient>,
	) => PostgrestFilterBuilder<unknown, unknown, T[]>;
	/**
	 * Enable real-time subscriptions
	 */
	realtime?: boolean;
	/**
	 * Table name for real-time subscriptions
	 */
	table?: string;
	/**
	 * Initial data
	 */
	initialData?: T[];
}

export function useSupabaseQuery<T = unknown>(
	options: UseSupabaseQueryOptions<T>,
) {
	const { queryFn, realtime = false, table, initialData = [] } = options;
	const [data, setData] = useState<T[]>(initialData);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	// Create a stable client reference
	const supabase = useMemo(() => createBrowserClient(), []);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			const { data: result, error: queryError } = await queryFn(supabase);

			if (queryError) throw queryError;

			setData(result || []);
			setError(null);
		} catch (err) {
			setError(err as Error);
		} finally {
			setIsLoading(false);
		}
	}, [supabase, queryFn]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Setup real-time subscription separately
	useEffect(() => {
		if (!realtime || !table) return;

		const channel = supabase
			.channel(`${table}-changes-${Date.now()}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: table,
				},
				(payload) => {
					console.log("Realtime event received:", payload);
					fetchData();
				},
			)
			.subscribe((status) => {
				console.log("Realtime subscription status:", status);
			});

		return () => {
			supabase.removeChannel(channel);
		};
	}, [realtime, table, supabase, fetchData]);

	return {
		data,
		isLoading,
		error,
		refetch: fetchData,
	};
}
