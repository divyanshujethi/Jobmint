import { pgTable, text, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";

export const codingProblems = pgTable(
  "coding_problems",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    difficulty: text("difficulty").notNull(), // "Easy" | "Medium" | "Hard"
    category: text("category").notNull(),
    acceptance: text("acceptance").default("50.0%"),
    description: text("description").notNull(),
    realWorldContext: text("real_world_context").notNull().default(""),
    examples: jsonb("examples").notNull().default([]),
    constraints: jsonb("constraints").notNull().default([]),
    hints: jsonb("hints").notNull().default([]),
    starterCodeJs: text("starter_code_js").notNull().default(""),
    starterCodeTs: text("starter_code_ts").notNull().default(""),
    starterCodePy: text("starter_code_py").notNull().default(""),
    starterCodeCpp: text("starter_code_cpp").notNull().default(""),
    starterCodeJava: text("starter_code_java").notNull().default(""),
    testCases: jsonb("test_cases").notNull().default([]),
    editorial: text("editorial").default(""),
    badgeName: text("badge_name").default(""),
    companies: jsonb("companies").default([]),
    source: text("source").default("LEETCODE_CRAWLER"),
    isDailyPotd: boolean("is_daily_potd").default(false),
    potdDate: text("potd_date"), // e.g. "2026-10-06"
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_coding_problems_slug").on(table.slug),
    index("idx_coding_problems_difficulty").on(table.difficulty),
    index("idx_coding_problems_category").on(table.category),
    index("idx_coding_problems_potd_date").on(table.potdDate),
  ]
);

export type CodingProblem = typeof codingProblems.$inferSelect;
export type NewCodingProblem = typeof codingProblems.$inferInsert;
