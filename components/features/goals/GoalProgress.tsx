import { View, Text } from 'react-native';

interface GoalProgressProps {
  goals: Goal[];
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export function GoalProgress({ goals, timeframe = 'weekly' }: GoalProgressProps) {
  const completedGoals = goals.filter(goal => goal.isCompleted).length;
  const totalGoals = goals.length;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const categoryStats = goals.reduce((acc, goal) => {
    if (!acc[goal.category]) {
      acc[goal.category] = { total: 0, completed: 0 };
    }
    acc[goal.category].total++;
    if (goal.isCompleted) {
      acc[goal.category].completed++;
    }
    return acc;
  }, {} as Record<Goal['category'], { total: number; completed: number }>);

  return (
    <Card variant="glass" className="mb-6">
      <View className="items-center mb-6">
        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Goal Progress
        </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-400 capitalize">
          {timeframe} Overview
        </Text>
      </View>

      {/* Overall Progress Circle */}
      <View className="items-center mb-6">
        <View className="relative w-32 h-32 items-center justify-center">
          <View className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <View
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            style={{
              transform: [{ rotate: `${(completionRate / 100) * 360}deg` }]
            }}
          />
          <View className="absolute inset-2 bg-white dark:bg-gray-800 rounded-full items-center justify-center">
            <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {completionRate}%
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              Complete
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View className="flex-row justify-between mb-4">
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
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          By Category
        </Text>
        {Object.entries(categoryStats).map(([category, stats]) => {
          const categoryProgress = Math.round((stats.completed / stats.total) * 100);
          return (
            <View key={category} className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center flex-1">
                <View className="bg-gray-100 dark:bg-gray-800 rounded-full p-2 mr-3">
                  <Feather name={getCategoryIcon(category as Goal['category'])} size={14} color="#667eea" />
                </View>
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {category}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                  {stats.completed}/{stats.total}
                </Text>
                <View className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <View
                    className="bg-blue-500 rounded-full h-2"
                    style={{ width: `${categoryProgress}%` }}
                  />
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
const getCategoryIcon = (category: Goal['category']) => {
  const icons = {
    health: 'heart',
    work: 'briefcase',
    personal: 'user',
    learning: 'book',
    finance: 'dollar-sign',
  } as const;
  return icons[category];
};
