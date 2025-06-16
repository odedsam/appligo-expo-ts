import Card from '@/components/ui/Card';

import { Text, View } from 'react-native';

import { Feather } from '@expo/vector-icons';

import type { GoalCard } from './GoalCard';

interface GoalProgressProps {
  goals: GoalCard[];
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export function GoalProgress({ goals, timeframe = 'weekly' }: GoalProgressProps) {
  const completedGoals = goals.filter((goal) => goal.isCompleted).length;
  const totalGoals = goals.length;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const categoryStats = goals.reduce(
    (acc, goal) => {
      if (!acc[goal.category]) {
        acc[goal.category] = { total: 0, completed: 0 };
      }
      acc[goal.category].total++;
      if (goal.isCompleted) {
        acc[goal.category].completed++;
      }
      return acc;
    },
    {} as Record<GoalCard['category'], { total: number; completed: number }>,
  );

  return (
    <Card variant="glass" className="mb-6">
      <View className="mb-6 items-center">
        <Text className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Goal Progress</Text>
        <Text className="text-sm capitalize text-gray-600 dark:text-gray-400">{timeframe} Overview</Text>
      </View>

      {/* Overall Progress Circle */}
      <View className="mb-6 items-center">
        <View className="relative h-32 w-32 items-center justify-center">
          <View className="absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-700" />
          <View
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
            style={{
              transform: [{ rotate: `${(completionRate / 100) * 360}deg` }],
            }}
          />
          <View className="absolute inset-2 items-center justify-center rounded-full bg-white dark:bg-gray-800">
            <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completionRate}%</Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">Complete</Text>
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View className="mb-4 flex-row justify-between">
        <View className="items-center">
          <Text className="text-2xl font-bold text-green-500">{completedGoals}</Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">Completed</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-blue-500">{totalGoals - completedGoals}</Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">In Progress</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-purple-500">{totalGoals}</Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">Total</Text>
        </View>
      </View>

      {/* Category Breakdown */}
      <View>
        <Text className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">By Category</Text>
        {Object.entries(categoryStats).map(([category, stats]) => {
          const categoryProgress = Math.round((stats.completed / stats.total) * 100);
          return (
            <View key={category} className="mb-3 flex-row items-center justify-between">
              <View className="flex-1 flex-row items-center">
                <View className="mr-3 rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                  <Feather name={getCategoryIcon(category as GoalCard['category'])} size={14} color="#667eea" />
                </View>
                <Text className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">{category}</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="mr-2 text-sm text-gray-500 dark:text-gray-400">
                  {stats.completed}/{stats.total}
                </Text>
                <View className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                  <View className="h-2 rounded-full bg-blue-500" style={{ width: `${categoryProgress}%` }} />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

// Helper function (should be at component level)
const getCategoryIcon = (category: GoalCard['category']) => {
  const icons = {
    health: 'heart',
    work: 'briefcase',
    personal: 'user',
    learning: 'book',
    finance: 'dollar-sign',
  } as const;
  return icons[category];
};
