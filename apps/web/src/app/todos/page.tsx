"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { trpc } from "@/utils/trpc";

export default function TodosPage() {
	const [newTodoText, setNewTodoText] = useState("");

	// ✅ Read from Supabase (with real-time updates)
	const { data: todos, isLoading } = useSupabaseQuery<{
		id: number;
		text: string;
		completed: boolean;
	}>({
		queryFn: (supabase) =>
			supabase.from("todo").select("*").order("id", { ascending: false }),
		realtime: true, // Auto-refresh when data changes!
		table: "todo",
		initialData: [],
	});

	// ✅ Write via tRPC mutations
	const createMutation = useMutation(
		trpc.todo.create.mutationOptions({
			onSuccess: () => {
				setNewTodoText("");
				// Real-time will auto-update, but you can manually refetch if needed
				// refetch();
			},
		}),
	);

	const toggleMutation = useMutation(
		trpc.todo.toggle.mutationOptions({
			onSuccess: () => {
				// Real-time will auto-update
			},
		}),
	);

	const deleteMutation = useMutation(
		trpc.todo.delete.mutationOptions({
			onSuccess: () => {
				// Real-time will auto-update
			},
		}),
	);

	const handleAddTodo = (e: React.FormEvent) => {
		e.preventDefault();
		if (newTodoText.trim()) {
			createMutation.mutate({ text: newTodoText });
		}
	};

	const handleToggleTodo = (id: number, completed: boolean) => {
		toggleMutation.mutate({ id, completed: !completed });
	};

	const handleDeleteTodo = (id: number) => {
		deleteMutation.mutate({ id });
	};

	return (
		<div className="mx-auto w-full max-w-md py-10">
			<Card>
				<CardHeader>
					<CardTitle>Todo List</CardTitle>
					<CardDescription>
						Manage your tasks efficiently (using Supabase + tRPC hybrid)
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleAddTodo}
						className="mb-6 flex items-center space-x-2"
					>
						<Input
							value={newTodoText}
							onChange={(e) => setNewTodoText(e.target.value)}
							placeholder="Add a new task..."
							disabled={createMutation.isPending}
						/>
						<Button
							type="submit"
							disabled={createMutation.isPending || !newTodoText.trim()}
						>
							{createMutation.isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								"Add"
							)}
						</Button>
					</form>

					{isLoading ? (
						<div className="flex justify-center py-4">
							<Loader2 className="h-6 w-6 animate-spin" />
						</div>
					) : todos?.length === 0 ? (
						<p className="py-4 text-center">No todos yet. Add one above!</p>
					) : (
						<ul className="space-y-2">
							{todos?.map((todo) => (
								<li
									key={todo.id}
									className="flex items-center justify-between rounded-md border p-2"
								>
									<div className="flex items-center space-x-2">
										<Checkbox
											checked={todo.completed || false}
											onCheckedChange={() =>
												handleToggleTodo(todo.id, todo.completed)
											}
											id={`todo-${todo.id}`}
										/>
										<label
											htmlFor={`todo-${todo.id}`}
											className={`${todo.completed ? "text-muted-foreground line-through" : ""}`}
										>
											{todo.text}
										</label>
									</div>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleDeleteTodo(todo.id)}
										aria-label="Delete todo"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</li>
							))}
						</ul>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
