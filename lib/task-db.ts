import { db } from './db'
import { Task } from '@/store/tasks'

export const fetchTasks = (): Promise<Task[]> =>
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM tasks ORDER BY id DESC',
        [],
        (_, { rows }) => resolve(rows._array as Task[]),
        (_, error) => {
          reject(error)
          return false
        }
      )
    })
  })

export const insertTask = (task: Omit<Task, 'id'>): Promise<void> =>
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO tasks (goal_id, title, is_done, energy_level, time_estimate) VALUES (?, ?, ?, ?, ?)`,
        [
          task.goal_id ?? null,
          task.title,
          task.is_done ? 1 : 0,
          task.energy_level ?? null,
          task.time_estimate ?? null,
        ],
        () => resolve(),
        (_, error) => {
          reject(error)
          return false
        }
      )
    })
  })

export const updateTaskInDb = (
  id: number,
  data: Partial<Omit<Task, 'id'>>
): Promise<void> =>
  new Promise((resolve, reject) => {
    const updates: string[] = []
    const values: any[] = []

    if (data.goal_id !== undefined) {
      updates.push('goal_id = ?')
      values.push(data.goal_id)
    }
    if (data.title !== undefined) {
      updates.push('title = ?')
      values.push(data.title)
    }
    if (data.is_done !== undefined) {
      updates.push('is_done = ?')
      values.push(data.is_done ? 1 : 0)
    }
    if (data.energy_level !== undefined) {
      updates.push('energy_level = ?')
      values.push(data.energy_level)
    }
    if (data.time_estimate !== undefined) {
      updates.push('time_estimate = ?')
      values.push(data.time_estimate)
    }

    if (updates.length === 0) resolve()

    values.push(id)

    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
        values,
        () => resolve(),
        (_, error) => {
          reject(error)
          return false
        }
      )
    })
  })

export const deleteTaskFromDb = (id: number): Promise<void> =>
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM tasks WHERE id = ?',
        [id],
        () => resolve(),
        (_, error) => {
          reject(error)
          return false
        }
      )
    })
  })
