// import create from 'zustand'
// import {
//   fetchTasks,
//   insertTask,
//   updateTaskInDb,
//   deleteTaskFromDb,
// } from '@/lib/task-db'

// export interface Task {
//   id: number
//   goal_id?: number
//   title: string
//   is_done: boolean
//   energy_level?: string
//   time_estimate?: number
// }

// interface TasksState {
//   tasks: Task[]
//   loadTasks: () => Promise<void>
//   addTask: (task: Omit<Task, 'id'>) => Promise<void>
//   updateTask: (id: number, data: Partial<Omit<Task, 'id'>>) => Promise<void>
//   removeTask: (id: number) => Promise<void>
// }

// export const useTaskStore = create<TasksState>((set, get) => ({
//   tasks: [],

//   loadTasks: async () => {
//     const tasks = await fetchTasks()
//     set({ tasks })
//   },

//   addTask: async (task) => {
//     await insertTask(task)
//     await get().loadTasks()
//   },

//   updateTask: async (id, data) => {
//     await updateTaskInDb(id, data)
//     await get().loadTasks()
//   },

//   removeTask: async (id) => {
//     await deleteTaskFromDb(id)
//     await get().loadTasks()
//   },
// }))


// // page :

// /* import React, { useEffect, useState } from 'react'
// import { View, Text, TextInput, Button, FlatList, Switch } from 'react-native'
// import { useTaskStore } from '@/store/tasks'

// export default function TasksScreen() {
//   const { tasks, loadTasks, addTask, removeTask, updateTask } = useTaskStore()
//   const [newTaskTitle, setNewTaskTitle] = useState('')

//   useEffect(() => {
//     loadTasks()
//   }, [])

//   return (
//     <View>
//       <Text>Tasks:</Text>
//       <FlatList
//         data={tasks}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
//  */
