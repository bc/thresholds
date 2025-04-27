import { pgTable, text, serial, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define classification data schema
export const classifications = pgTable("classifications", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  ground_truth_class: text("ground_truth_class").notNull(),
  predicted_class: text("predicted_class").notNull(),
  was_correct: boolean("was_correct").notNull(),
  confidence: doublePrecision("confidence").notNull(),
});

export const insertClassificationSchema = createInsertSchema(classifications).pick({
  query: true,
  ground_truth_class: true,
  predicted_class: true,
  was_correct: true,
  confidence: true,
});

export type InsertClassification = z.infer<typeof insertClassificationSchema>;
export type Classification = typeof classifications.$inferSelect;

// CSV row schema
export const csvRowSchema = z.object({
  query: z.string(),
  ground_truth_class: z.string(),
  predicted_class: z.string(),
  was_correct: z.union([
    z.boolean(),
    z.literal(0).transform(val => false),
    z.literal(1).transform(val => true),
    z.literal("0").transform(val => false),
    z.literal("1").transform(val => true),
    z.literal("false").transform(val => false),
    z.literal("true").transform(val => true),
    z.literal("False").transform(val => false),
    z.literal("True").transform(val => true)
  ]),
  confidence: z.number().or(z.string().transform((val) => {
    const parsed = parseFloat(val);
    if (isNaN(parsed)) throw new Error("Invalid confidence value");
    return parsed;
  }))
});

export type CSVRow = z.infer<typeof csvRowSchema>;
