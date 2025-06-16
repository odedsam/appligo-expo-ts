// import React, { useEffect, useState } from 'react'
// import { View, Text, TextInput, Button, FlatList } from 'react-native'
// import { useDailyEntriesStore } from '@/store/daily-entries'

// export default function DailyEntriesScreen() {
//   const { dailyEntries, loadEntries, addEntry, removeEntry } = useDailyEntriesStore()
//   const [newNotes, setNewNotes] = useState('')
//   const today = new Date().toISOString().slice(0, 10)

//   useEffect(() => {
//     loadEntries()
//   }, [])

//   return (
//     <View style={{ flex: 1, padding: 16 }}>
//       <Text style={{ fontSize: 24 }}>Daily Entries</Text>
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
//         style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
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
