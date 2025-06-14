import { db } from './db'
import { Goal } from '@/store/goals'

export const fetchGoals = (): Promise<Goal[]> =>
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM goals ORDER BY created_at DESC',
        [],
        (_, { rows }) => resolve(rows._array as Goal[]),
        (_, error) => {
          reject(error)
          return false
        }
      )
    })
  })

export const insertGoal = (goal: Omit<Goal, 'id' | 'created_at'>): Promise<void> =>
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO goals (title, description, created_at) VALUES (?, ?, ?)',
        [goal.title, goal.description || null, new Date().toISOString()],
        () => resolve(),
        (_, error) => {
          reject(error)
          return false
        }
      )
    })
  })

export const updateGoalInDb = (id: number, data: Partial<Omit<Goal, 'id' | 'created_at'>>): Promise<void> =>
  new Promise((resolve, reject) => {
    const updates = []
    const values: any[] = []

    if (data.title !== undefined) {
      updates.push('title = ?')
      values.push(data.title)
    }
    if (data.description !== undefined) {
      updates.push('description = ?')
      values.push(data.description)
    }

    if (updates.length === 0) resolve()

    values.push(id)

    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE goals SET ${updates.join(', ')} WHERE id = ?`,
        values,
        () => resolve(),
        (_, error) => {
          reject(error)
          return false
        }
      )
    })
  })

export const deleteGoalFromDb = (id: number): Promise<void> =>
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM goals WHERE id = ?',
        [id],
        () => resolve(),
        (_, error) => {
          reject(error)
          return false
        }
      )
    })
  })
