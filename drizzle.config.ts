import fs from "fs";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

let url = process.env.DATABASE_URL;

if (process.env.NODE_ENV === "production") {
  const path = process.env.DB_PASS_FILE || "/run/secrets/db-pass";

  try {
    const secret = fs.readFileSync(path, "utf8").trim();
    url = url.replace("s3cr3t", secret);
  } catch (error) {
    throw new Error("Missing DB_PASS_FILE secret");
  }
}

export default defineConfig({
  out: "./database/migrations",
  schema: "./database/schema.ts",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url,
  },
});
