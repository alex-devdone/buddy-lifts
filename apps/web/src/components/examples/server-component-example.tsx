import { createServerClient } from "@/lib/supabase";

/**
 * Server Component example: Reading data from Supabase
 * For mutations, use a Client Component with tRPC
 */
export async function ServerTodoExample() {
	const supabase = await createServerClient();

	// Read from Supabase in Server Component
	const { data: todos, error } = await supabase
		.from("todo")
		.select("*")
		.order("created_at", { ascending: false })
		.limit(10);

	if (error) {
		return <div>Error loading todos: {error.message}</div>;
	}

	return (
		<div className="space-y-4">
			<h2 className="font-bold text-2xl">Todos (Server Component)</h2>

			<div className="space-y-2">
				{todos?.map((todo) => (
					<div key={todo.id} className="rounded border p-3">
						<h3 className="font-semibold">{todo.title}</h3>
						{todo.description && (
							<p className="text-gray-600 text-sm">{todo.description}</p>
						)}
					</div>
				))}

				{todos?.length === 0 && (
					<p className="text-center text-gray-500">No todos yet.</p>
				)}
			</div>
		</div>
	);
}
