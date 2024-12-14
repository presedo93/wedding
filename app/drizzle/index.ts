import * as schema from "./schema.server";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle({
  schema,
  connection: process.env.DATABASE_URL!,
  casing: "snake_case",
});

export type User = typeof schema.users.$inferSelect;
export type Guest = typeof schema.guests.$inferSelect;

export type UserInsert = typeof schema.users.$inferInsert;
export type GuestInsert = typeof schema.guests.$inferInsert;

export * from "./schema.server";
