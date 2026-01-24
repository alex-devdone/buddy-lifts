-- Create todo table
CREATE TABLE IF NOT EXISTS "todo" (
	"id" serial PRIMARY KEY,
	"text" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL
);
