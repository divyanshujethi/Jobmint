import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const skills = pgTable("skills", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  aliases: text("aliases").array().notNull().default([]),
  category: text("category").notNull().default("General"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const skillRoadmaps = pgTable("skill_roadmaps", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  contentMarkdown: text("content_markdown").notNull(),
  freeResources: text("free_resources").notNull(), // JSON string or markdown
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
