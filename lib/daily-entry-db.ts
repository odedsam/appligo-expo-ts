import { db } from './db'
import { DailyEntry } from '@/store/daily-entries'

export const fetchDailyEntries = (): Promise<DailyEntry[]> =>
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM daily_entries ORDER BY date DESC',
        [],
        (_, { rows }) => resolve(rows._array as DailyEntry[]),
        (_, error) => {
          reject(error)
          return false
        }
      )
    })
  })

export const insertDailyEntry = (entry: Omit<DailyEntry, 'id'>): Promise<void> =>
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO daily_entries (date, notes, energy_level, mood) VALUES (?, ?, ?, ?)`,
        [entry.date, entry.notes || null, entry.energy_level || null, entry.mood || null],
        () => resolve(),
        (_, error) => {
          reject(error)
          return false
        }
      )
    })
  })

export const updateDailyEntryInDb = (
  id: number,
  data: Partial<Omit<DailyEntry, 'id'>>
): Promise<void> =>
  new Promise((resolve, reject) => {
    const updates: string[] = []
    const values: any[] = []

    if (data.date !== undefined) {
      updates.push('date = ?')
      values.push(data.date)
    }
    if (data.notes !== undefined) {
      updates.push('notes = ?')
      values.push(data.notes)
    }
    if (data.energy_level !== undefined) {
      updates.push('energy_level = ?')
      values.push(data.energy_level)
    }
    if (data.mood !== undefined) {
      updates.push('mood = ?')
      values.push(data.mood)
    }

    if (updates.length === 0) resolve()

    values.push(id)

    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE daily_entries SET ${updates.join(', ')} WHERE id = ?`,
        values,
        () => resolve(),
        (_, error) => {
          reject(error)
          return false
        }
      )
    })
  })

export const deleteDailyEntryFromDb = (id: number): Promise<void> =>
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM daily_entries WHERE id = ?',
        [id],
        () => resolve(),
        (_, error) => {
          reject(error)
          return false
        }
      )
    })
  })
