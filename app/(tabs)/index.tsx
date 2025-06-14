import React, { useEffect, useState } from "react"
import { View, Text, FlatList, SafeAreaView, ScrollView } from "react-native"
import { useSQLiteContext } from "expo-sqlite"
import { drizzle } from "drizzle-orm/expo-sqlite"
import { useDrizzleStudio } from "expo-drizzle-studio-plugin"
import { DailyEntries, Goals, Task } from "@/db/schema"
import * as schema from "@/db/schema"

export default function Home() {
  const [entries, setEntries] = useState<DailyEntries[]>([])
  const [goals, setGoals] = useState<Goals[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  const db = useSQLiteContext()
  useDrizzleStudio(db) // database debugger
  const drizzleDb = drizzle(db, { schema })

  useEffect(() => {
    async function loadData() {
      const dailyEntries = await drizzleDb.query.daily_entries.findMany({
        orderBy: (d, { desc }) => desc(d.date),
      })
      setEntries(dailyEntries)

      const goalsData = await drizzleDb.query.goals.findMany({
        orderBy: (g, { desc }) => desc(g.created_at),
      })
      setGoals(goalsData)

      const tasksData = await drizzleDb.query.tasks.findMany()
      setTasks(tasksData)
    }
    loadData()
  }, [drizzleDb])

  // Renderers
  const renderEntry = ({ item }: { item: DailyEntries }) => (
    <View className="bg-gray-800 rounded-lg p-4 mb-4 shadow-md">
      <Text className="text-white text-xl font-bold mb-2">{item.date}</Text>
      <Text className="text-gray-400 font-semibold">Main Goal:</Text>
      <Text className="text-white mb-1">{item.main_goal || "No main goal"}</Text>
      <Text className="text-gray-400 font-semibold">Energy:</Text>
      <Text className="text-white mb-1">{item.energy || "N/A"}</Text>
      <Text className="text-gray-400 font-semibold">Focus:</Text>
      <Text className="text-white mb-1">{item.focus || "N/A"}</Text>
      <Text className="text-gray-400 font-semibold">Notes:</Text>
      <Text className="text-white mb-1">{item.notes || "No notes"}</Text>
      <Text className="text-gray-400 font-semibold">Mood:</Text>
      <Text className="text-white">{item.mood || "Unknown"}</Text>
    </View>
  )

  const renderGoal = ({ item }: { item: Goals }) => (
    <View className="bg-blue-800 rounded-lg p-4 mb-4 shadow-md">
      <Text className="text-white text-lg font-bold mb-1">{item.title}</Text>
      <Text className="text-gray-300 mb-1">{item.description || "No description"}</Text>
      <Text className="text-gray-400 text-sm">Created At: {item.created_at || "-"}</Text>
    </View>
  )

  const renderTask = ({ item }: { item: Task }) => (
    <View className="bg-green-800 rounded-lg p-3 mb-3 shadow-md flex-row justify-between items-center">
      <View>
        <Text className="text-white font-semibold">{item.title}</Text>
        <Text className="text-gray-300 text-sm">
          Done: {item.is_done ? "Yes" : "No"} | Energy: {item.energy_level || "N/A"} | Est: {item.time_estimate ?? "?"} mins
        </Text>
      </View>
      <Text className="text-gray-400 text-xs">Goal ID: {item.goal_id ?? "-"}</Text>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-gray-900 p-4">
      <ScrollView>
        <Text className="text-white text-2xl font-bold mb-4">Daily Entries</Text>
        {entries.length === 0 ? (
          <Text className="text-white text-center mb-6">No entries found.</Text>
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEntry}
            scrollEnabled={false}
          />
        )}

        <Text className="text-white text-2xl font-bold mt-8 mb-4">Goals</Text>
        {goals.length === 0 ? (
          <Text className="text-white text-center mb-6">No goals found.</Text>
        ) : (
          <FlatList
            data={goals}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderGoal}
            scrollEnabled={false}
          />
        )}

        <Text className="text-white text-2xl font-bold mt-8 mb-4">Tasks</Text>
        {tasks.length === 0 ? (
          <Text className="text-white text-center mb-6">No tasks found.</Text>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTask}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
