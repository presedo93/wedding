import * as schema from "./schema.server";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle({
  schema,
  connection: process.env.DATABASE_URL!,
  casing: "snake_case",
});

export type Guest = typeof schema.guestsTable.$inferSelect;
export type GuestInsert = typeof schema.guestsTable.$inferInsert;
export type Task = typeof schema.tasksTable.$inferSelect;
export type TaskInsert = typeof schema.tasksTable.$inferInsert;

export * from "./schema.server";
