import * as t from "drizzle-orm/pg-core";

const timestamps = {
  updatedAt: t.timestamp({ withTimezone: true }),
  createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  deletedAt: t.timestamp({ withTimezone: true }),
};

export const guestsTable = t.pgTable("guests", {
  id: t.serial().primaryKey(),
  userId: t.varchar({ length: 12 }).notNull(),
  name: t.varchar().notNull(),
  phone: t.varchar(),
  allergies: t.varchar().array().notNull().default([]),
  isVegetarian: t.boolean().notNull(),
  needsTransport: t.boolean().notNull(),
  ...timestamps,
});

export const tasksTable = t.pgTable("tasks", {
  id: t.varchar({ length: 12 }).primaryKey(),
  profile: t.boolean().notNull().default(false),
  guests: t.boolean().notNull().default(false),
  songs: t.boolean().notNull().default(false),
  messages: t.boolean().notNull().default(false),
  photos: t.boolean().notNull().default(false),
});
