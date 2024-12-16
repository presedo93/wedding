ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "guests" DROP CONSTRAINT "guests_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "guests" ALTER COLUMN "user_id" SET NOT NULL;