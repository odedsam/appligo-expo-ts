import create from 'zustand'
import {
  fetchDailyEntries,
  insertDailyEntry,
  updateDailyEntryInDb,
  deleteDailyEntryFromDb,
} from '@/lib/daily-entry-db'

export interface DailyEntry {
  id: number
  date: string // ISO date string, unique per day
  notes?: string
  energy_level?: string
  mood?: string
}

interface DailyEntriesState {
  dailyEntries: DailyEntry[]
  loadEntries: () => Promise<void>
  addEntry: (entry: Omit<DailyEntry, 'id'>) => Promise<void>
  updateEntry: (id: number, data: Partial<Omit<DailyEntry, 'id'>>) => Promise<void>
  removeEntry: (id: number) => Promise<void>
}

export const useDailyEntriesStore = create<DailyEntriesState>((set, get) => ({
  dailyEntries: [],

  loadEntries: async () => {
    const dailyEntries = await fetchDailyEntries()
    set({ dailyEntries })
  },

  addEntry: async (entry) => {
    await insertDailyEntry(entry)
    await get().loadEntries()
  },

  updateEntry: async (id, data) => {
    await updateDailyEntryInDb(id, data)
    await get().loadEntries()
  },

  removeEntry: async (id) => {
    await deleteDailyEntryFromDb(id)
    await get().loadEntries()
  },
}))

// import React, { useEffect, useState } from 'react'
// import { View, Text, TextInput, Button, FlatList } from 'react-native'
// import { useDailyEntriesStore } from '@/store/daily-entries'

// export default function DailyEntriesScreen() {
//   const { dailyEntries, loadEntries, addEntry, removeEntry } = useDailyEntriesStore()
//   const [newNotes, setNewNotes] = useState('')
//   const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

//   useEffect(() => {
//     loadEntries()
//   }, [])

//   return (
//     <View>
//       <Text>Daily Entries:</Text>
//       <FlatList
//         data={dailyEntries}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={{ marginVertical: 8 }}>
//             <Text>{item.date}</Text>
//             <Text>{item.notes}</Text>
//             <Button title="Delete" onPress={() => removeEntry(item.id)} />
//           </View>
//         )}
//       />
//       <TextInput
//         placeholder="Notes for today"
//         value={newNotes}
//         onChangeText={setNewNotes}
//       />
//       <Button
//         title="Add Today's Entry"
//         onPress={() => {
//           if (newNotes.trim()) {
//             addEntry({ date: today, notes: newNotes.trim() })
//             setNewNotes('')
//           }
//         }}
//       />
//     </View>
//   )
// }
