import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
	path: "../../apps/web/.env",
});

export default defineConfig({
	schema: "./src/schema",
	out: "./src/migrations",
	dialect: "postgresql",
	dbCredentials: {
		// Use pooler connection for drizzle-kit (direct connection has IPv6 issues)
		// For introspection, pgbouncer mode with transaction pooling works for push
		url: process.env.DATABASE_URL || "",
	},
});
