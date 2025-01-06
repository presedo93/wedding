import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const migrationClient = postgres(DATABASE_URL, { max: 1 });
const db = drizzle(migrationClient);

const run = async () => {
  console.log("Migrating database...");
  await migrate(db, { migrationsFolder: "./database/migrations/" });
  await migrationClient.end();
  console.log("Database migrated successfully!");
};

run();
