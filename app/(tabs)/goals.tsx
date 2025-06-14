














import React, { useEffect } from 'react'
import { View, Text, Button, FlatList } from 'react-native'
import { useGoalStore } from '@/store/goals'
import { useNavigation } from '@react-navigation/native'

export default function GoalsScreen() {
  const { goals, loadGoals } = useGoalStore()
  const navigation = useNavigation()

  useEffect(() => {
    loadGoals()
  }, [])

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24 }}>Goals</Text>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.title}</Text>}
      />
      <Button title="Go to Tasks" onPress={() => navigation.navigate('Tasks')} />
      <Button title="Go to Daily Entries" onPress={() => navigation.navigate('DailyEntries')} />
    </View>
  )
}






























// import React, { useEffect, useState } from 'react'
// import { View, Text, Button, TextInput, FlatList } from 'react-native'
// import { useGoalStore } from '@/store/goals'

// export default function GoalsScreen() {
//   const { goals, loadGoals, addGoal, removeGoal } = useGoalStore()
//   const [newGoalTitle, setNewGoalTitle] = useState('')

//   useEffect(() => {
//     loadGoals()
//   }, [])

//   return (
//     <View>
//       <Text>Goals:</Text>
//       <FlatList
//         data={goals}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View>
//             <Text>{item.title}</Text>
//             <Button title="Delete" onPress={() => removeGoal(item.id)} />
//           </View>
//         )}
//       />
//       <TextInput
//         placeholder="New goal title"
//         value={newGoalTitle}
//         onChangeText={setNewGoalTitle}
//       />
//       <Button
//         title="Add Goal"
//         onPress={() => {
//           if (newGoalTitle.trim()) {
//             addGoal({ title: newGoalTitle.trim() })
//             setNewGoalTitle('')
//           }
//         }}
//       />
//     </View>
//   )
// }
