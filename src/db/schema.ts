import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: uuid("user_id").defaultRandom().notNull().primaryKey(),
    username: varchar("username", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    provider: varchar("provider", {
      length: 100,
      enum: ["github", "google", "credentials"],
    })
      .notNull()
      .default("credentials"),
    image: varchar("image", { length: 100 }),
    level: integer('level').default(1).notNull(),
    experience: integer('experience').default(0).notNull(),
    hashedPassword: varchar("hashed_password", { length: 100 }),
    lastUpdate: timestamp("last-update", {
      mode: "string",
      withTimezone: true
    }).defaultNow().notNull(),
  },
  (table) => ({
    emailIndex: index("email_index").on(table.email),
    nameIndex: index("name_index").on(table.username),
    idIndex: index("id").on(table.id),
  }),
);

export const tasksTable = pgTable(
  "tasks",
  {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    createdAt: timestamp("time", {
      mode: "string",
      withTimezone: true,
    }).defaultNow(),
    userId: uuid("user_id").defaultRandom().notNull().references(() => usersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    completed: boolean("completed").default(false),
    pause: boolean("pause").default(false),
    duration: integer("duration").default(0),
  },
  (table) => ({
    idIndex: index("task_id_index").on(table.id),
  }),
);
