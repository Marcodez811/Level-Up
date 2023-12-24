import { relations } from "drizzle-orm";
import {
  index,
  integer,
  text,
  pgTable,
  serial,
  uuid,
  varchar,
  unique,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    username: varchar("username", { length: 100 }).notNull().unique(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    hashedPassword: varchar("hashed_password", { length: 100 }),
    level: integer("level").default(1),
    experience: integer('experience').default(0),
    rank: integer("rank"),
    title: varchar("title"),
    provider: varchar("provider", {
      length: 100,
      enum: ["github", "google", "credentials"],
    })
      .notNull()
      .default("credentials"),
    image: varchar("image", { length: 100 }),
  },
  (table) => ({
    emailIndex: index("email_index").on(table.email),
    nameIndex: index("name_index").on(table.username),
    idIndex: index("id").on(table.id),
  }),

);

// export const usersRelations = relations(usersTable, ({ many }) => ({
//   usersToTasksTable: many(usersToTasksTable),
// }));

export const tasksTable = pgTable(
  "tasks",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    name: varchar("name", { length: 100 }).notNull(),
    content: text("content").notNull(),
    time: timestamp("time", {
      mode: "string",
      withTimezone: true,
    }),
    owner: varchar("owner").notNull().references(() => usersTable.username, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    completed: boolean("completed").default(false),
    difficulty: integer("difficulty"),
  },
  (table) => ({
    displayIdIndex: index("task_id_index").on(table.displayId),
  }),
);

// export const tasksRelations = relations(tasksTable, ({ many }) => ({
//   usersToTasksTable: many(usersToTasksTable),
// }));

// export const usersToTasksTable = pgTable(
//   "users_to_documents",
//   {
//     id: serial("id").primaryKey(),
//     userId: uuid("user_id")
//       .notNull()
//       .references(() => usersTable.displayId, {
//         onDelete: "cascade",
//         onUpdate: "cascade",
//       }),
//     documentId: uuid("document_id")
//       .notNull()
//       .references(() => tasksTable.displayId, {
//         onDelete: "cascade",
//         onUpdate: "cascade",
//       }),
//   },
//   (table) => ({
//     userAndDocumentIndex: index("user_and_document_index").on(
//       table.userId,
//       table.documentId,
//     ),
//     // This is a unique constraint on the combination of userId and documentId.
//     // This ensures that there is no duplicate entry in the table.
//     uniqCombination: unique().on(table.documentId, table.userId),
//   }),
// );

// export const usersToDocumentsRelations = relations(
//   usersToTasksTable,
//   ({ one }) => ({
//     document: one(tasksTable, {
//       fields: [usersToTasksTable.documentId],
//       references: [tasksTable.displayId],
//     }),
//     user: one(usersTable, {
//       fields: [usersToTasksTable.userId],
//       references: [usersTable.displayId],
//     }),
//   }),
// );

export const messagesTabel = pgTable(
  "message",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("message_id").defaultRandom().notNull().unique(),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => usersTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    receiverId: uuid("receiver_id")
      .notNull()
      .references(() => usersTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    content: text("content").notNull(),
    sendAt: timestamp("sendAt", {
      mode: "string",
      withTimezone: true,
    }).defaultNow(),
    read: boolean("read").default(false),

  },

);
