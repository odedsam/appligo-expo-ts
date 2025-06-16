import { DailyEntries, Goal, Task } from '@/db/schema';
import * as schema from '@/db/schema';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import React from 'react';
import { FlatList, SafeAreaView, ScrollView, Text, View } from 'react-native';

import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { useSQLiteContext } from 'expo-sqlite';

export default function Admin() {
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
    <View className="mb-4 rounded-lg bg-gray-800 p-4 shadow-md">
      <Text className="mb-2 text-xl font-bold text-white">{item.date}</Text>
      <Text className="font-semibold text-gray-400">Main Goal:</Text>
      <Text className="mb-1 text-white">{item.main_goal || 'No main goal'}</Text>
      <Text className="font-semibold text-gray-400">Energy:</Text>
      <Text className="mb-1 text-white">{item.energy || 'N/A'}</Text>
      <Text className="font-semibold text-gray-400">Focus:</Text>
      <Text className="mb-1 text-white">{item.focus || 'N/A'}</Text>
      <Text className="font-semibold text-gray-400">Notes:</Text>
      <Text className="mb-1 text-white">{item.notes || 'No notes'}</Text>
      <Text className="font-semibold text-gray-400">Mood:</Text>
      <Text className="text-white">{item.mood || 'Unknown'}</Text>
    </View>
  );

  const renderGoal = ({ item }: { item: Goal }) => (
    <View className="mb-4 rounded-lg bg-blue-800 p-4 shadow-md">
      <Text className="mb-1 text-lg font-bold text-white">{item.title}</Text>
      <Text className="mb-1 text-gray-300">{item.description || 'No description'}</Text>
      <Text className="text-sm text-gray-400">Created At: {item.created_at || '-'}</Text>
    </View>
  );

  const renderTask = ({ item }: { item: Task }) => (
    <View className="mb-3 flex-row items-center justify-between rounded-lg bg-green-800 p-3 shadow-md">
      <View>
        <Text className="font-semibold text-white">{item.title}</Text>
        <Text className="text-sm text-gray-300">
          Done: {item.is_done ? 'Yes' : 'No'} | Energy: {item.energy_level || 'N/A'} | Est: {item.time_estimate ?? '?'} mins
        </Text>
      </View>
      <Text className="text-xs text-gray-400">Goal ID: {item.goal_id ?? '-'}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900 p-4">
      <Text className="mb-4 text-2xl font-bold text-white"></Text>
      <ScrollView>
        <Text className="mb-4 text-2xl font-bold text-white">Daily Entries</Text>
        {entries.data.length === 0 ? (
          <Text className="mb-6 text-center text-white">No entries found.</Text>
        ) : (
          <FlatList data={entries.data} keyExtractor={(item) => item.id.toString()} renderItem={renderEntry} scrollEnabled={false} />
        )}

        <Text className="mb-4 mt-8 text-2xl font-bold text-white">Goals</Text>
        {goals.length === 0 ? (
          <Text className="mb-6 text-center text-white">No goals found.</Text>
        ) : (
          <FlatList data={goals} keyExtractor={(item) => item.id.toString()} renderItem={renderGoal} scrollEnabled={false} />
        )}

        <Text className="mb-4 mt-8 text-2xl font-bold text-white">Tasks</Text>
        {tasks.length === 0 ? (
          <Text className="mb-6 text-center text-white">No tasks found.</Text>
        ) : (
          <FlatList data={tasks} keyExtractor={(item) => item.id.toString()} renderItem={renderTask} scrollEnabled={false} />
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
