# Quick Start: Hybrid Data Pattern

## TL;DR

- **Read data**: Use Supabase client
- **Write data**: Use tRPC mutations
- **Real-time**: Supabase subscriptions (automatic)

## Quick Examples

### 1. Client Component (Read + Write)

```typescript
"use client";

import { createBrowserClient } from "@/lib/supabase";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { trpc } from "@/utils/trpc";

export function MyComponent() {
  // ✅ Read from Supabase (with real-time)
  const { data: todos } = useSupabaseQuery({
    queryFn: (supabase) => supabase.from("todo").select("*"),
    realtime: true,
    table: "todo",
  });

  // ✅ Write via tRPC
  const createTodo = trpc.todo.create.useMutation();
  const deleteTodo = trpc.todo.delete.useMutation();

  return (
    <div>
      <button onClick={() => createTodo.mutate({ text: "New todo" })}>
        Add
      </button>

      {todos?.map(todo => (
        <div key={todo.id}>
          {todo.text}
          <button onClick={() => deleteTodo.mutate({ id: todo.id })}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 2. Server Component (Read Only)

```typescript
import { createServerClient } from "@/lib/supabase";

export default async function Page() {
  const supabase = await createServerClient();

  // ✅ Read from Supabase in Server Component
  const { data: todos } = await supabase
    .from("todo")
    .select("*");

  return (
    <div>
      {todos?.map(todo => (
        <div key={todo.id}>{todo.text}</div>
      ))}
    </div>
  );
}
```

### 3. Server Action (Write Only)

```typescript
"use server";

import { db } from "@buddy-lifts/db";
import { todo } from "@buddy-lifts/db/schema/todo";

export async function createTodo(text: string) {
  // ✅ Write using Drizzle (or call tRPC internally)
  await db.insert(todo).values({ text });
}
```

## File Locations

- **Supabase Client**: `apps/web/src/lib/supabase/`
- **useSupabaseQuery Hook**: `apps/web/src/hooks/use-supabase-query.ts`
- **tRPC Router**: `packages/api/src/routers/todo.ts`
- **Full Examples**: `apps/web/src/components/examples/`

## Common Patterns

### Pattern 1: List with Real-time Updates

```typescript
const { data } = useSupabaseQuery({
  queryFn: (s) => s.from("todo").select("*").order("created_at"),
  realtime: true, // Auto-refresh on changes
  table: "todo",
});
```

### Pattern 2: Filtered Query

```typescript
const { data } = useSupabaseQuery({
  queryFn: (s) =>
    s.from("todo")
      .select("*")
      .eq("user_id", userId)
      .eq("completed", false),
  realtime: true,
  table: "todo",
});
```

### Pattern 3: With Pagination

```typescript
const { data } = useSupabaseQuery({
  queryFn: (s) =>
    s.from("todo")
      .select("*")
      .range(0, 9), // First 10 items
});
```

### Pattern 4: Join Tables

```typescript
const { data } = useSupabaseQuery({
  queryFn: (s) =>
    s.from("todo")
      .select(`
        *,
        user:user_id (name, email)
      `),
  realtime: true,
  table: "todo",
});
```

## Need More Control?

For advanced use cases, directly use the Supabase client:

```typescript
const supabase = createBrowserClient();

// Complex query
const { data, error } = await supabase
  .from("todo")
  .select("*")
  .or("completed.eq.true,priority.eq.high")
  .limit(10);

// Real-time subscription with custom logic
const channel = supabase
  .channel("custom-channel")
  .on("postgres_changes", { event: "*", schema: "public", table: "todo" },
    (payload) => {
      // Custom handling
      console.log("Change!", payload);
    }
  )
  .subscribe();
```

## Documentation

- **Full Guide**: `HYBRID_PATTERN.md`
- **Supabase Setup**: `SUPABASE_SETUP.md`
- **Architecture**: `CLAUDE.md`
