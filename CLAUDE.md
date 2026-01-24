# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Buddy Lifts is a TypeScript monorepo built with Better-T-Stack, featuring Next.js, tRPC, Drizzle ORM, Better-Auth, and Supabase. The project uses Turborepo for build orchestration and Bun as the package manager.

## Development Commands

```bash
# Install dependencies
bun install

# Development
bun run dev              # Start all apps in dev mode
bun run dev:web          # Start only web app (runs on http://localhost:4989)

# Database operations (run from root)
bun run db:push          # Push schema changes to database
bun run db:studio        # Open Drizzle Studio UI
bun run db:generate      # Generate migrations
bun run db:migrate       # Run migrations

# Code quality
bun run check            # Run Biome formatting and linting with auto-fix
bun run check-types      # Type check all packages

# Build
bun run build            # Build all applications

# Git hooks
bun run prepare          # Initialize Husky git hooks
```

## Architecture

### Monorepo Structure

This is a Turborepo monorepo with the following packages:

- **apps/web**: Next.js 16 fullstack application (App Router)
- **packages/api**: tRPC router definitions and business logic
- **packages/auth**: Better-Auth configuration using Drizzle adapter
- **packages/db**: Drizzle ORM schema and database client
- **packages/env**: Environment variable validation with @t3-oss/env-core
- **packages/config**: Shared configuration (TypeScript, Biome)

### Data Flow

1. **Client → tRPC → Server**:
   - Client uses `@tanstack/react-query` with tRPC proxy (apps/web/src/utils/trpc.ts)
   - tRPC client configured with `httpBatchLink` pointing to `/api/trpc`
   - Server routes defined in packages/api/src/routers/

2. **Authentication Flow**:
   - Better-Auth configured in packages/auth/src/index.ts
   - Uses Drizzle adapter with PostgreSQL
   - Context creation in packages/api/src/context.ts extracts session from request headers
   - Protected procedures in tRPC check for session existence

3. **Database Access**:
   - Drizzle client exported from packages/db/src/index.ts
   - Schema files in packages/db/src/schema/ (auth.ts, todo.ts, etc.)
   - Drizzle config reads .env from apps/web/.env

### Key Architectural Patterns

**tRPC Setup**:
- Base tRPC instance initialized in packages/api/src/index.ts
- Exports `publicProcedure` and `protectedProcedure`
- Router composition in packages/api/src/routers/index.ts with nested routers
- Type safety enforced via `AppRouter` export

**Environment Variables**:
- Server-side env defined in packages/env/src/server.ts
- Client-side env defined in packages/env/src/web.ts
- Validated with Zod schemas
- Required server vars: DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, CORS_ORIGIN
- Required client vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

**Authentication**:
- Better-Auth: Email/password authentication with nextCookies plugin
- Supabase Auth: Available via auth helpers in apps/web/src/lib/supabase/auth-helpers.ts
- Session available in tRPC context via `ctx.session`

**Supabase Integration**:
- Client-side access: `import { createBrowserClient } from "@/lib/supabase"`
- Server-side access: `import { createServerClient } from "@/lib/supabase"`
- Middleware automatically refreshes auth sessions (apps/web/middleware.ts)
- Database connected to Supabase PostgreSQL instance
- See SUPABASE_SETUP.md for detailed usage guide

## Configuration Files

- **biome.json**: Biome linter/formatter config with tab indentation, double quotes, and strict style rules
- **turbo.json**: Turborepo task pipeline (build, dev, db:*, check-types)
- **package.json**: Workspaces catalog for shared dependencies (zod, next, trpc, better-auth, drizzle-orm)
- **.env location**: apps/web/.env (required for database operations)

## Database Setup

The project uses Supabase PostgreSQL. The database is already configured and connected.

**Database Connection**:
- Connected to Supabase cloud instance
- DATABASE_URL configured in apps/web/.env
- Schema managed via Drizzle ORM

**Common Operations**:
- `bun run db:push` - Push schema changes to Supabase
- `bun run db:studio` - Open Drizzle Studio UI
- `bun run db:generate` - Generate migrations from schema
- `bun run db:migrate` - Apply migrations

Database commands always target the @buddy-lifts/db package via Turbo filters.

## Data Access Pattern: Hybrid Approach

**IMPORTANT**: This project uses a hybrid data pattern:
- **Read operations**: Use Supabase client directly (faster, real-time capable)
- **Write operations**: Use tRPC mutations (type-safe, server-side validation)

See `HYBRID_PATTERN.md` for detailed documentation and `QUICK_START.md` for examples.

**Quick Example**:
```typescript
// ✅ Read with Supabase
const { data } = useSupabaseQuery({
  queryFn: (s) => s.from("todo").select("*"),
  realtime: true,
  table: "todo"
});

// ✅ Write with tRPC
const create = trpc.todo.create.useMutation();
create.mutate({ text: "New todo" });
```

## Adding New Features

**New tRPC Mutation** (for writes only):
1. Create or update router in packages/api/src/routers/
2. Add to appRouter in packages/api/src/routers/index.ts
3. Use in client via `trpc.[routerName].[procedureName].useMutation()`
4. **Do NOT add queries** - use Supabase client for reads

**New Database Table**:
1. Define schema in packages/db/src/schema/
2. Export from packages/db/src/schema/index.ts
3. Run `bun run db:push` to update database
4. Read from table using Supabase client
5. Write to table using tRPC mutations

**Protected Operations**:
- Use `protectedProcedure` instead of `publicProcedure` in tRPC
- Access user data via `ctx.session.user`
- For Supabase, enable Row Level Security (RLS) on tables
