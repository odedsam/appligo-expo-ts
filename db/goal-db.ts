import { desc, eq } from "drizzle-orm";
import { goals, Goals } from "./schema";
import { db } from "@/db/db";

// Fetch goals ordered by created_at DESC
export const fetchGoals = async (): Promise<Goals[]> => {
  const result = await db.select().from(goals).orderBy(desc(goals.created_at));
  return result as Goals[];
};

// Insert goal
export const insertGoal = async (goal: Omit<Goals, "id">): Promise<void> => {
  await db.insert(goals).values({
    title: goal.title,
    description: goal.description ?? null,
    created_at: goal.created_at ?? null,
  });
};

// Update goal
export const updateGoalInDb = async (id: number, data: Partial<Omit<Goals, "id">>): Promise<void> => {
  const updateData: Partial<typeof goals.$inferInsert> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.created_at !== undefined) updateData.created_at = data.created_at;

  if (Object.keys(updateData).length === 0) return;

  await db.update(goals).set(updateData).where(eq(goals.id, id));
};

// Delete goal
export const deleteGoalFromDb = async (id: number): Promise<void> => {
  await db.delete(goals).where(eq(goals.id, id));
};
