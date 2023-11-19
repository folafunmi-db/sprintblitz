import { relations, sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const rooms = sqliteTable("rooms", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const roomsRelations = relations(rooms, ({ many }) => ({
  posts: many(posts),
}));

export const posts = sqliteTable("posts", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  roomId: integer("room_id").notNull(),
  body: text("body").notNull(),
  userName: text("user_name").notNull(),
  stage: integer("stage").notNull().default(0),
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
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  body: text("body"),
  postId: integer("post_id"),
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
