// app/seed.tsx
import * as schema from '@/db/schema';
import { seedDummyData } from '@/db/seed';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';

import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { useSQLiteContext } from 'expo-sqlite';

// exp://192.168.1.98:8081/seed

export default function Seed() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  useDrizzleStudio(db);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Ready to seed database');
  const [hasSeeded, setHasSeeded] = useState(false);

  const runSeed = async () => {
    setLoading(true);
    setMessage('Seeding database...');

    try {
      await seedDummyData();
      setMessage(' Dummy data inserted successfully!');
      setHasSeeded(true);
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      setMessage('❌ Failed to seed data. Check console for details.');

      // Show alert with error details
      Alert.alert('Seeding Failed', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  const confirmSeed = () => {
    Alert.alert(
      'Seed Database',
      hasSeeded
        ? 'Database has already been seeded. Do you want to add more data?'
        : 'This will add dummy data to your database. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Seed it!', onPress: runSeed },
      ],
    );
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-950 px-6">
      <View className="items-center space-y-6">
        {/* Status Icon */}
        <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-800">
          {loading ? (
            <ActivityIndicator size="large" color="#10b981" />
          ) : hasSeeded ? (
            <Text className="text-2xl text-green-400"></Text>
          ) : (
            <Text className="text-2xl text-blue-400">🗄️</Text>
          )}
        </View>

        <Text
          className={`mb-8 text-center text-xl font-semibold ${hasSeeded ? 'text-green-400' : loading ? 'text-blue-400' : 'text-white'}`}>
          {message}
        </Text>

        {/* Seed Button */}
        <TouchableOpacity
          onPress={confirmSeed}
          disabled={loading}
          className={`rounded-lg px-8 py-4 ${loading ? 'bg-gray-600' : hasSeeded ? 'bg-green-600' : 'bg-blue-600'}`}>
          <Text className="text-lg font-semibold text-white">
            {loading ? 'Seeding...' : hasSeeded ? 'Seed More Data' : 'Seed Database'}
          </Text>
        </TouchableOpacity>

        {/* Additional Info */}
        <View className="mt-8 rounded-lg bg-gray-800 p-4">
          <Text className="text-center text-sm text-gray-300">This will add sample goals, tasks, and daily entries to your database</Text>
          {hasSeeded && <Text className="mt-2 text-center text-xs text-green-400">Database seeded successfully</Text>}
        </View>

        {/* Drizzle Studio Info */}
        <View className="mt-4 rounded-lg border border-purple-500/30 bg-purple-900/30 p-3">
          <Text className="text-center text-xs text-purple-300">💡 Drizzle Studio is running - check your browser to view the data</Text>
        </View>
      </View>
    </View>
  );
}
