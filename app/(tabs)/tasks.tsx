// import React, { useEffect, useState } from 'react'
// import { View, Text, TextInput, Button, FlatList, Switch } from 'react-native'
// import { useTaskStore } from '@/store/tasks'

// export default function TasksScreen() {
//   const { tasks, loadTasks, addTask, removeTask, updateTask } = useTaskStore()
//   const [newTaskTitle, setNewTaskTitle] = useState('')

//   useEffect(() => {
//     loadTasks()
//   }, [])

//   return (
//     <View style={{ flex: 1, padding: 16 }}>
//       <Text style={{ fontSize: 24 }}>Tasks</Text>
//       <FlatList
//         data={tasks}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
//             <Switch
//               value={item.is_done}
//               onValueChange={(val) => updateTask(item.id, { is_done: val })}
//             />
//             <Text style={{ flex: 1, marginLeft: 8 }}>{item.title}</Text>
//             <Button title="Delete" onPress={() => removeTask(item.id)} />
//           </View>
//         )}
//       />
//       <TextInput
//         placeholder="New Task Title"
//         value={newTaskTitle}
//         onChangeText={setNewTaskTitle}
//         style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
//       />
//       <Button
//         title="Add Task"
//         onPress={() => {
//           if (newTaskTitle.trim()) {
//             addTask({ title: newTaskTitle.trim(), is_done: false })
//             setNewTaskTitle('')
//           }
//         }}
//       />
//     </View>
//   )
// }
