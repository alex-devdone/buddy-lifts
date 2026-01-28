import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

type SupabaseClient = ReturnType<typeof createBrowserClient>;
type RealtimeStatus =
	| "CONNECTING"
	| "SUBSCRIBED"
	| "TIMED_OUT"
	| "CHANNEL_ERROR"
	| "CLOSED"
	| "DISABLED";

interface UseSupabaseQueryOptions<T> {
	/**
	 * Query builder function
	 */
	queryFn: (
		supabase: SupabaseClient,
	) => PromiseLike<{ data: T[] | null; error: Error | null }>;
	/**
	 * Enable fetching and subscriptions
	 */
	enabled?: boolean;
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
	const {
		queryFn,
		realtime = false,
		table,
		initialData = [],
		enabled = true,
	} = options;
	const [data, setData] = useState<T[]>(initialData);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const [realtimeStatus, setRealtimeStatus] = useState<RealtimeStatus>(
		enabled && realtime && table ? "CONNECTING" : "DISABLED",
	);

	// Create a stable client reference
	const supabase = useMemo(() => createBrowserClient(), []);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			if (!enabled) {
				setData(initialData);
				setError(null);
				return;
			}
			const { data: result, error: queryError } = await queryFn(supabase);

			if (queryError) throw queryError;

			setData(result || []);
			setError(null);
		} catch (err) {
			setError(err as Error);
		} finally {
			setIsLoading(false);
		}
	}, [supabase, queryFn, enabled, initialData]);

	useEffect(() => {
		if (!enabled) {
			setIsLoading(false);
			return;
		}
		fetchData();
	}, [fetchData, enabled]);

	useEffect(() => {
		setRealtimeStatus(enabled && realtime && table ? "CONNECTING" : "DISABLED");
	}, [enabled, realtime, table]);

	// Setup real-time subscription separately
	useEffect(() => {
		if (!enabled || !realtime || !table) return;

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
				setRealtimeStatus(status);
			});

		return () => {
			supabase.removeChannel(channel);
		};
	}, [enabled, realtime, table, supabase, fetchData]);

	return {
		data,
		isLoading,
		error,
		realtimeStatus,
		isRealtimeConnected: realtimeStatus === "SUBSCRIBED",
		refetch: fetchData,
	};
}
