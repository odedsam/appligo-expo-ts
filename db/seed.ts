import { db } from '@/db/db'
import { goals, tasks, daily_entries } from './schema'

export async function seedDummyData() {
  // הכנס Goals
  const insertedGoals = await db.insert(goals).values([
    {
      title: "Complete AppliGO MVP",
      description: "Finish the minimal viable product by May 1st, 2025",
      created_at: "2025-04-10T10:00:00Z",
    },
    {
      title: "Learn Drizzle ORM",
      description: "Master Drizzle ORM and SQLite integration",
      created_at: "2025-04-05T15:30:00Z",
    },
  ])

  // הנח שה-IDs הם 1 ו-2 (בהנחה שהטבלה ריקה או שאתה יודע את ה-id)
  const goal1Id = 1
  const goal2Id = 2

  // הכנס Tasks עם goal_id תקין
  await db.insert(tasks).values([
    {
      goal_id: goal1Id,
      title: "Setup database schema",
      is_done: 1,
      energy_level: "high",
      time_estimate: 120,
    },
    {
      goal_id: goal1Id,
      title: "Build UI components",
      is_done: 0,
      energy_level: "medium",
      time_estimate: 180,
    },
    {
      goal_id: goal2Id,
      title: "Read Drizzle docs",
      is_done: 0,
      energy_level: "low",
      time_estimate: 60,
    },
  ])

  // הכנס Daily Entries עם ערכים ריאליסטיים
  await db.insert(daily_entries).values([
    {
      date: "2025-06-14",
      energy: "high",
      focus: "high",
      main_goal: "Complete AppliGO MVP",
      notes: "Made great progress on UI and backend integration.",
      energy_level: "high",
      mood: "motivated",
    },
    {
      date: "2025-06-13",
      energy: "medium",
      focus: "medium",
      main_goal: "Learn Drizzle ORM",
      notes: "Read docs and tested migrations.",
      energy_level: "medium",
      mood: "focused",
    },
  ])

  console.log("Dummy data inserted successfully.")
}
