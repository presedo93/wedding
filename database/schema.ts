import * as t from "drizzle-orm/pg-core";

const timestamps = {
  updatedAt: t.timestamp({ withTimezone: true }),
  createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  deletedAt: t.timestamp({ withTimezone: true }),
};

export type User = typeof usersTable.$inferSelect;
export type UserInsert = typeof usersTable.$inferInsert;

export const usersTable = t.pgTable("users", {
  id: t.varchar({ length: 12 }).primaryKey(),
  name: t.varchar().notNull(),
  email: t.varchar().notNull(),
  pictureUrl: t.varchar(),
  ...timestamps,
});

export type Guest = typeof guestsTable.$inferSelect;
export type GuestInsert = typeof guestsTable.$inferInsert;

export const guestsTable = t.pgTable("guests", {
  id: t.serial().primaryKey(),
  userId: t.varchar({ length: 12 }).references(() => usersTable.id),
  name: t.varchar().notNull(),
  phone: t.varchar(),
  allergies: t.varchar().array().notNull().default([]),
  isVegetarian: t.boolean().notNull(),
  needsTransport: t.boolean().notNull(),
  ...timestamps,
});

export type Task = typeof tasksTable.$inferSelect;
export type TaskInsert = typeof tasksTable.$inferInsert;

export const tasksTable = t.pgTable("tasks", {
  id: t.serial().primaryKey(),
  userId: t.varchar({ length: 12 }).references(() => usersTable.id),
  profile: t.boolean().notNull().default(false),
  guests: t.boolean().notNull().default(false),
  songs: t.boolean().notNull().default(false),
  messages: t.boolean().notNull().default(false),
  photos: t.boolean().notNull().default(false),
  ...timestamps,
});

export type Song = typeof songsTable.$inferSelect;
export type SongInsert = typeof songsTable.$inferInsert;

export const songsTable = t.pgTable("songs", {
  id: t.varchar({ length: 22 }).primaryKey(),
  userId: t.varchar({ length: 12 }).references(() => usersTable.id),
  name: t.varchar().notNull(),
  pictureUrl: t.varchar(),
  spotifyUrl: t.varchar(),
  artistUrl: t.varchar(),
  popularity: t.integer().notNull().default(0),
  duration: t.integer().notNull().default(0),
  artist: t.varchar(),
  album: t.varchar(),
  ...timestamps,
});
