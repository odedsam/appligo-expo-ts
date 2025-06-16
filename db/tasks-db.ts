import { desc, eq } from 'drizzle-orm';

import { db } from './db';
import { Task, tasks } from './schema';

// Get all tasks ordered by id desc
export const fetchTasks = async (): Promise<Task[]> => {
  const result = await db.select().from(tasks).orderBy(desc(tasks.id));
  return result as Task[];
};

// Insert a new task
export const insertTask = async (task: Omit<Task, 'id'>): Promise<void> => {
  await db.insert(tasks).values({
    goal_id: task.goal_id ?? null,
    title: task.title,
    is_done: task.is_done ? 1 : 0,
    energy_level: task.energy_level ?? null,
    time_estimate: task.time_estimate ?? null,
  });
};

// Update a task
export const updateTaskInDb = async (id: number, data: Partial<Omit<Task, 'id'>>): Promise<void> => {
  const updateData: Partial<typeof tasks.$inferInsert> = {};

  if (data.goal_id !== undefined) updateData.goal_id = data.goal_id;
  if (data.title !== undefined) updateData.title = data.title;
  if (data.is_done !== undefined) updateData.is_done = data.is_done ? 1 : 0;
  if (data.energy_level !== undefined) updateData.energy_level = data.energy_level;
  if (data.time_estimate !== undefined) updateData.time_estimate = data.time_estimate;

  if (Object.keys(updateData).length === 0) return;

  await db.update(tasks).set(updateData).where(eq(tasks.id, id));
};

// Delete task
export const deleteTaskFromDb = async (id: number): Promise<void> => {
  await db.delete(tasks).where(eq(tasks.id, id));
};
