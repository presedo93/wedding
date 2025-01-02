CREATE TABLE "guests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(12) NOT NULL,
	"name" varchar NOT NULL,
	"phone" varchar,
	"allergies" varchar[] DEFAULT '{}' NOT NULL,
	"is_vegetarian" boolean NOT NULL,
	"needs_transport" boolean NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" varchar(12) PRIMARY KEY NOT NULL,
	"profile" boolean DEFAULT false NOT NULL,
	"guests" boolean DEFAULT false NOT NULL,
	"songs" boolean DEFAULT false NOT NULL,
	"messages" boolean DEFAULT false NOT NULL,
	"photos" boolean DEFAULT false NOT NULL
);
