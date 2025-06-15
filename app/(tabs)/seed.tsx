// app/seed.tsx

import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { seedDummyData } from "@/db/seed";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as schema from "@/db/schema";

// exp://192.168.1.98:8081/seed


export default function Seed() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  useDrizzleStudio(db);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Ready to seed database");
  const [hasSeeded, setHasSeeded] = useState(false);

  const runSeed = async () => {
    setLoading(true);
    setMessage("Seeding database...");

    try {
      await seedDummyData();
      setMessage("✅ Dummy data inserted successfully!");
      setHasSeeded(true);
    } catch (error) {
      console.error("❌ Seeding failed:", error);
      setMessage("❌ Failed to seed data. Check console for details.");

      // Show alert with error details
      Alert.alert(
        "Seeding Failed",
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmSeed = () => {
    Alert.alert(
      "Seed Database",
      hasSeeded
        ? "Database has already been seeded. Do you want to add more data?"
        : "This will add dummy data to your database. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes, Seed it!", onPress: runSeed }
      ]
    );
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-950 px-6">
      <View className="items-center space-y-6">

        {/* Status Icon */}
        <View className="w-20 h-20 rounded-full bg-gray-800 items-center justify-center mb-4">
          {loading ? (
            <ActivityIndicator size="large" color="#10b981" />
          ) : hasSeeded ? (
            <Text className="text-green-400 text-2xl">✅</Text>
          ) : (
            <Text className="text-blue-400 text-2xl">🗄️</Text>
          )}
        </View>

        {/* Status Message */}
        <Text className={`text-xl font-semibold text-center mb-8 ${
          hasSeeded ? 'text-green-400' :
          loading ? 'text-blue-400' :
          'text-white'
        }`}>
          {message}
        </Text>

        {/* Seed Button */}
        <TouchableOpacity
          onPress={confirmSeed}
          disabled={loading}
          className={`px-8 py-4 rounded-lg ${
            loading
              ? 'bg-gray-600'
              : hasSeeded
                ? 'bg-green-600'
                : 'bg-blue-600'
          }`}
        >
          <Text className="text-white text-lg font-semibold">
            {loading
              ? 'Seeding...'
              : hasSeeded
                ? 'Seed More Data'
                : 'Seed Database'
            }
          </Text>
        </TouchableOpacity>

        {/* Additional Info */}
        <View className="mt-8 p-4 bg-gray-800 rounded-lg">
          <Text className="text-gray-300 text-sm text-center">
            This will add sample goals, tasks, and daily entries to your database
          </Text>
          {hasSeeded && (
            <Text className="text-green-400 text-xs text-center mt-2">
              ✅ Database seeded successfully
            </Text>
          )}
        </View>

        {/* Drizzle Studio Info */}
        <View className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
          <Text className="text-purple-300 text-xs text-center">
            💡 Drizzle Studio is running - check your browser to view the data
          </Text>
        </View>

      </View>
    </View>
  );
}
