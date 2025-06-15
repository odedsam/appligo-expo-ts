import React from "react";
import { View, Text, FlatList, SafeAreaView, ScrollView } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { DailyEntries, Goals, Task } from "@/db/schema";
import * as schema from "@/db/schema";

export default function Home() {

  const db = useSQLiteContext();
  useDrizzleStudio(db);
  const drizzleDb = drizzle(db, { schema });

  const entriesQuery = drizzleDb.query.daily_entries.findMany({
    orderBy: (d, { desc }) => desc(d.date),
  });
  const entries = useLiveQuery(entriesQuery, [drizzleDb]) || [];

  const goalsQuery = drizzleDb.query.goals.findMany({
    orderBy: (g, { desc }) => desc(g.created_at),
  });
  const goals = useLiveQuery(goalsQuery, [drizzleDb])?.data || [];

  const tasksQuery = drizzleDb.query.tasks.findMany();
  const tasks = useLiveQuery(tasksQuery, [drizzleDb])?.data || [];

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
  );

  const renderGoal = ({ item }: { item: Goals }) => (
    <View className="bg-blue-800 rounded-lg p-4 mb-4 shadow-md">
      <Text className="text-white text-lg font-bold mb-1">{item.title}</Text>
      <Text className="text-gray-300 mb-1">{item.description || "No description"}</Text>
      <Text className="text-gray-400 text-sm">Created At: {item.created_at || "-"}</Text>
    </View>
  );

  const renderTask = ({ item }: { item: Task }) => (
    <View className="bg-green-800 rounded-lg p-3 mb-3 shadow-md flex-row justify-between items-center">
      <View>
        <Text className="text-white font-semibold">{item.title}</Text>
        <Text className="text-gray-300 text-sm">
          Done: {item.is_done ? "Yes" : "No"} | Energy: {item.energy_level || "N/A"} | Est: {item.time_estimate ?? "?"}{" "}
          mins
        </Text>
      </View>
      <Text className="text-gray-400 text-xs">Goal ID: {item.goal_id ?? "-"}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900 p-4">
           <Text className="text-white text-2xl font-bold mb-4"></Text>
      <ScrollView>
        <Text className="text-white text-2xl font-bold mb-4">Daily Entries</Text>
        {entries.data.length === 0 ? (
          <Text className="text-white text-center mb-6">No entries found.</Text>
        ) : (
          <FlatList
            data={entries.data}
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
  );
}

// import { Redirect } from 'expo-router';

// export default function Index() {
//   // Add logic here to check if user is first time or returning
//   const isFirstTime = true; // Replace with actual logic

//   if (isFirstTime) {
//     return <Redirect href="/welcome" />;
//   }

//   return <Redirect href="/(tabs)" />;
// }
