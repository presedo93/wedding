CREATE TABLE "guests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(12),
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
CREATE TABLE "songs" (
	"id" varchar(22) PRIMARY KEY NOT NULL,
	"user_id" varchar(12),
	"name" varchar NOT NULL,
	"picture_url" varchar,
	"spotify_url" varchar,
	"popularity" integer DEFAULT 0 NOT NULL,
	"duration" integer DEFAULT 0 NOT NULL,
	"artist" varchar,
	"album" varchar,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(12),
	"profile" boolean DEFAULT false NOT NULL,
	"guests" boolean DEFAULT false NOT NULL,
	"songs" boolean DEFAULT false NOT NULL,
	"messages" boolean DEFAULT false NOT NULL,
	"photos" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(12) PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"picture_url" varchar,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "songs" ADD CONSTRAINT "songs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;