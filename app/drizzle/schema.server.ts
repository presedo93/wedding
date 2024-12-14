import * as t from "drizzle-orm/pg-core";

const timestamps = {
  updatedAt: t.timestamp({ withTimezone: true }),
  createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  deletedAt: t.timestamp({ withTimezone: true }),
};

export const users = t.pgTable("users", {
  id: t.varchar({ length: 12 }).primaryKey(),
  name: t.varchar().notNull(),
  phone: t.varchar().notNull(),
  email: t.varchar().notNull(),
  pictureUrl: t.varchar(),
  ...timestamps,
});

export const guests = t.pgTable("guests", {
  id: t.serial().primaryKey(),
  userId: t
    .varchar({ length: 12 })
    .references(() => users.id, { onDelete: "cascade" }),
  name: t.varchar().notNull(),
  phone: t.varchar(),
  allergies: t.varchar().array().notNull().default([]),
  isVegetarian: t.boolean().notNull(),
  needsTransport: t.boolean().notNull(),
  ...timestamps,
});
