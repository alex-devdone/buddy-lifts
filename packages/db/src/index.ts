import { env } from "@buddy-lifts/env/server";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

export const db = drizzle(env.DATABASE_URL, { schema });

// Re-export drizzle operators to ensure consistent types across packages
export {
	and,
	eq,
	gt,
	gte,
	inArray,
	lt,
	lte,
	ne,
	not,
	or,
	sql,
} from "drizzle-orm";
