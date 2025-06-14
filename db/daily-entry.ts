import { eq, desc } from 'drizzle-orm'
import { daily_entries, DailyEntries } from './schema'
import { db } from '@/db/db'

// Fetch entries ordered by date DESC
export const fetchDailyEntries = async (): Promise<DailyEntries[]> => {
  const result = await db.select().from(daily_entries).orderBy(desc(daily_entries.date))
  return result as DailyEntries[]
}

// Insert entry
export const insertDailyEntries = async (
  entry: Omit<DailyEntries, 'id'>
): Promise<void> => {
  await db.insert(daily_entries).values({
    date: entry.date,
    energy: entry.energy ?? null,
    focus: entry.focus ?? null,
    main_goal: entry.main_goal ?? null,
  })
}

// Update entry
export const updateDailyEntriesInDb = async (
  id: number,
  data: Partial<Omit<DailyEntries, 'id'>>
): Promise<void> => {
  const updateData: Partial<typeof daily_entries.$inferInsert> = {}

  if (data.date !== undefined) updateData.date = data.date
  if (data.energy !== undefined) updateData.energy = data.energy
  if (data.focus !== undefined) updateData.focus = data.focus
  if (data.main_goal !== undefined) updateData.main_goal = data.main_goal

  if (Object.keys(updateData).length === 0) return

  await db.update(daily_entries).set(updateData).where(eq(daily_entries.id, id))
}

// Delete entry
export const deleteDailyEntriesFromDb = async (id: number): Promise<void> => {
  await db.delete(daily_entries).where(eq(daily_entries.id, id))
}
