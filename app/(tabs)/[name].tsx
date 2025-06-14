import React, { useEffect, useState } from 'react'
import { View, Text, Button } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useStore } from '@/store/useStore'

export default function ItemDetails() {
  const { name } = useLocalSearchParams<{ name: string }>()
  const router = useRouter()
  const [item, setItem] = useState<{ id: string; title: string; completed: boolean } | null>(null)

  const goals = useStore((state:any) => state.goals)
  const tasks = useStore((state:any) => state.tasks)
  const toggleGoal = useStore((state:any) => state.toggleGoal)
  const toggleTask = useStore((state:any) => state.toggleTask)

  useEffect(() => {
    // חפש קודם ביעדים אחר שם תואם
    let found = goals.find((g:any) => g.title.toLowerCase() === name?.toLowerCase())
    if (found) {
      setItem(found)
      return
    }
    // חפש במשימות
    found = tasks.find((t:any) => t.title.toLowerCase() === name?.toLowerCase())
    if (found) setItem(found)
  }, [name, goals, tasks])

  if (!item) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Item not found: {name}</Text>
        <Button title="Go back" onPress={() => router.back()} />
      </View>
    )
  }

  const onToggle = () => {
    if (goals.some((g:any) => g.id === item.id)) toggleGoal(item.id)
    else toggleTask(item.id)
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>{item.title}</Text>
      <Text>Status: {item.completed ? 'Completed' : 'Pending'}</Text>
      <Button title={item.completed ? 'Mark as Pending' : 'Mark as Completed'} onPress={onToggle} />
    </View>
  )
}
