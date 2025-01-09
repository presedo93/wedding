import fs from "fs";
import { defineConfig } from "drizzle-kit";

if (!process.env.DB_URL || !process.env.DB_PASS) {
  throw new Error("DB_URL and DB_PASS are required");
}

export default defineConfig({
  out: "./database/migrations",
  schema: "./database/schema.ts",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DB_URL,
    password:
      process.env.NODE_ENV === "production"
        ? fs.readFileSync(process.env.DB_PASS!, "utf8").trim()
        : process.env.DB_PASS,
  },
});
