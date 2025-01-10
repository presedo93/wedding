import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

import fs from "fs";
import postgres from "postgres";

if (!process.env.DB_URL || !process.env.DB_PASS) {
  throw new Error("DB_URL and DB_PASS are required");
}

const client = postgres(process.env.DB_URL, {
  pass:
    process.env.NODE_ENV === "production"
      ? fs.readFileSync(process.env.DB_PASS, "utf8").trim()
      : process.env.DB_PASS,
  max: 1, // TODO: test if this is the reason we can't scale to three instances
});
const db = drizzle(client);

const run = async () => {
  console.log("Migrating database...");
  await migrate(db, { migrationsFolder: "./database/migrations/" });
  await client.end();
  console.log("Database migrated successfully!");
};

run();
