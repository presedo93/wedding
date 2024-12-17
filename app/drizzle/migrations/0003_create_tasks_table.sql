CREATE TABLE IF NOT EXISTS "tasks" (
	"id" varchar(12) PRIMARY KEY NOT NULL,
	"profile" boolean DEFAULT false NOT NULL,
	"guests" boolean DEFAULT false NOT NULL,
	"songs" boolean DEFAULT false NOT NULL,
	"messages" boolean DEFAULT false NOT NULL,
	"photos" boolean DEFAULT false NOT NULL
);
