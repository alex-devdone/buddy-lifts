"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { trpc } from "@/utils/trpc";

/**
 * Example component demonstrating the hybrid pattern:
 * - Supabase for reading todos (with real-time updates)
 * - tRPC for creating, updating, and deleting todos
 */
export function TodoHybridExample() {
	const [newTitle, setNewTitle] = useState("");

	// Read todos from Supabase with real-time updates
	const { data: todos, isLoading } = useSupabaseQuery<{
		id: number;
		title: string;
		completed: boolean;
	}>({
		queryFn: (supabase) =>
			supabase
				.from("todo")
				.select("*")
				.order("created_at", { ascending: false }),
		realtime: true, // Enable real-time subscriptions
		table: "todo", // Table to subscribe to
	});

	// Write operations via tRPC
	const createTodo = useMutation(
		trpc.todo.create.mutationOptions({
			onSuccess: () => {
				setNewTitle("");
				// Real-time will auto-update, but you can manually refetch if needed
				// refetch();
			},
		}),
	);

	const updateTodo = useMutation(trpc.todo.update.mutationOptions());

	const deleteTodo = useMutation(trpc.todo.delete.mutationOptions());

	const toggleTodo = (id: number, completed: boolean) => {
		updateTodo.mutate({
			id,
			completed: !completed,
		});
	};

	const handleCreate = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newTitle.trim()) return;

		createTodo.mutate({
			text: newTitle,
		});
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="space-y-4">
			<h2 className="font-bold text-2xl">Todos (Hybrid Pattern)</h2>

			{/* Create Form - Uses tRPC */}
			<form onSubmit={handleCreate} className="flex gap-2">
				<input
					type="text"
					value={newTitle}
					onChange={(e) => setNewTitle(e.target.value)}
					placeholder="New todo..."
					className="flex-1 rounded border px-3 py-2"
				/>
				<button
					type="submit"
					disabled={createTodo.isPending}
					className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
				>
					{createTodo.isPending ? "Adding..." : "Add Todo"}
				</button>
			</form>

			{/* Todo List - Data from Supabase with real-time */}
			<div className="space-y-2">
				{todos?.map((todo) => (
					<div
						key={todo.id}
						className="flex items-center gap-2 rounded border p-3"
					>
						<input
							type="checkbox"
							checked={todo.completed || false}
							onChange={() => toggleTodo(todo.id, todo.completed)}
							className="h-4 w-4"
						/>
						<span
							className={
								todo.completed ? "flex-1 line-through opacity-50" : "flex-1"
							}
						>
							{todo.title}
						</span>
						<button
							type="button"
							onClick={() => deleteTodo.mutate({ id: todo.id })}
							disabled={deleteTodo.isPending}
							className="text-red-500 hover:text-red-700 disabled:opacity-50"
						>
							Delete
						</button>
					</div>
				))}

				{todos?.length === 0 && (
					<p className="text-center text-gray-500">
						No todos yet. Add one above!
					</p>
				)}
			</div>
		</div>
	);
}
