import * as SQLite from 'expo-sqlite'
import type { SQLTransaction, SQLError } from 'expo-sqlite'

// Open or create the database
export const db = SQLite.openDatabase('goals.db')

export const initDatabase = () => {
  db.transaction(
    (tx: SQLTransaction) => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS goals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          created_at TEXT
        );
      `)

      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          goal_id INTEGER,
          title TEXT NOT NULL,
          is_done INTEGER DEFAULT 0,
          energy_level TEXT,
          time_estimate INTEGER,
          FOREIGN KEY(goal_id) REFERENCES goals(id)
        );
      `)

      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS daily_entries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL,
          energy TEXT,
          focus TEXT,
          main_goal TEXT
        );
      `)
    },
    (err?: SQLError) => {
      if (err) {
        console.error('❌ DB init error', err)
      }
    },
    () => {
      console.log('✅ DB initialized')
    }
  )
}




// export const initDatabase = () => {
//   db.transaction(
//     (tx) => {
//       tx.executeSql(`
//         CREATE TABLE IF NOT EXISTS goals (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           title TEXT NOT NULL,
//           description TEXT,
//           created_at TEXT
//         );
//       `)

//       tx.executeSql(`
//         CREATE TABLE IF NOT EXISTS tasks (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           goal_id INTEGER,
//           title TEXT NOT NULL,
//           is_done INTEGER DEFAULT 0,
//           energy_level TEXT,
//           time_estimate INTEGER,
//           FOREIGN KEY(goal_id) REFERENCES goals(id)
//         );
//       `)

//       tx.executeSql(`
//         CREATE TABLE IF NOT EXISTS daily_entries (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           date TEXT NOT NULL,
//           energy TEXT,
//           focus TEXT,
//           main_goal TEXT
//         );
//       `)
//     },
//     (err) => console.error('❌ DB init error', err),
//     () => console.log('✅ DB initialized')
//   )
// }
