import { sqliteTable, text, integer, foreignKey } from "drizzle-orm/sqlite-core";

export const goals = sqliteTable("goals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  created_at: text("created_at"),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  goal_id: integer("goal_id").references(() => goals.id),
  title: text("title").notNull(),
  is_done: integer("is_done").default(0),
  energy_level: text("energy_level"),
  time_estimate: integer("time_estimate"),
});
export const daily_entries = sqliteTable("daily_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  energy: text("energy"),
  focus: text("focus"),
  main_goal: text("main_goal"),
  notes: text("notes"),
  energy_level: text("energy_level"),
  mood: text("mood"),
});


export type DailyEntries = typeof daily_entries.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Goals = typeof goals.$inferSelect;
