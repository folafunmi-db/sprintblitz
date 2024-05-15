import { randomUUID } from "crypto";
import { relations, sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

const uuidLength = 5;

export const rooms = sqliteTable("rooms", {
  id: text("id", { length: uuidLength })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const roomsRelations = relations(rooms, ({ many }) => ({
  posts: many(posts),
}));

export const posts = sqliteTable("posts", {
  id: text("id", { length: uuidLength })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  roomId: text("room_id", { length: uuidLength }).$defaultFn(() =>
    randomUUID()
  ),
  body: text("body").notNull(),
  authorName: text("author_name"),
  stage: integer("stage").notNull().default(1),
  votes: integer("votes").notNull().default(0),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const postRelations = relations(posts, ({ one, many }) => ({
  room: one(rooms, {
    fields: [posts.roomId],
    references: [rooms.id],
  }),
  comments: many(comments),
}));

export const comments = sqliteTable("comments", {
  id: text("id", { length: uuidLength })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  body: text("body"),
  postId: text("post_id", { length: uuidLength }).$defaultFn(() =>
    randomUUID()
  ),
  votes: integer("votes").notNull().default(0),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));
