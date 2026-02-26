import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const entries = sqliteTable("entries", {
  //this is entrydatas own par
  id: text("id").primaryKey(),
  // this is the panel props part
  title: text("title").notNull(),
  meta: text("meta"),
  content: text("content").notNull(),
  tags: text("tags"), // store as comma-separated or JSON string
});
