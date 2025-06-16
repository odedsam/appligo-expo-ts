import Card from '@/components/ui/Card';
import type { Task } from '@/types';

import { Text, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

export interface TaskStatsProps {
  tasks: Task[];
  timeframe?: 'daily' | 'weekly' | 'monthly';
}

function getPriorityColor(priority: Task['priority']) {
  switch (priority) {
    case 'high':
      return { bg: 'bg-red-500' };
    case 'medium':
      return { bg: 'bg-yellow-500' };
    case 'low':
      return { bg: 'bg-green-500' };
    default:
      return { bg: 'bg-gray-400' };
  }
}

export function TaskStats({ tasks, timeframe = 'daily' }: TaskStatsProps) {
  const completedTasks = tasks.filter((task) => task.is_done === 1).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const overdueTasks = tasks.filter((task) => task.due_date && new Date(task.due_date) < new Date() && task.is_done !== 1).length;

  const priorityStats = tasks.reduce(
    (acc, task) => {
      if ('priority' in task && task.priority !== undefined && task.priority !== null) {
        acc[task.priority as string] = (acc[task.priority as string] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <Card variant="glass" className="mb-4">
      <Text className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">Task Overview</Text>

      {/* Stats Grid */}
      <View className="mb-6 flex-row justify-between">
        <View className="items-center">
          <LinearGradient colors={['#10b981', '#059669']} className="mb-2 h-12 w-12 items-center justify-center rounded-full">
            <Text className="font-bold text-white">{completedTasks}</Text>
          </LinearGradient>
          <Text className="text-xs text-gray-500 dark:text-gray-400">Completed</Text>
        </View>

        <View className="items-center">
          <LinearGradient colors={['#3b82f6', '#1d4ed8']} className="mb-2 h-12 w-12 items-center justify-center rounded-full">
            <Text className="font-bold text-white">{totalTasks - completedTasks}</Text>
          </LinearGradient>
          <Text className="text-xs text-gray-500 dark:text-gray-400">Pending</Text>
        </View>

        <View className="items-center">
          <LinearGradient colors={['#ef4444', '#dc2626']} className="mb-2 h-12 w-12 items-center justify-center rounded-full">
            <Text className="font-bold text-white">{overdueTasks}</Text>
          </LinearGradient>
          <Text className="text-xs text-gray-500 dark:text-gray-400">Overdue</Text>
        </View>

        <View className="items-center">
          <LinearGradient colors={['#8b5cf6', '#7c3aed']} className="mb-2 h-12 w-12 items-center justify-center rounded-full">
            <Text className="font-bold text-white">{completionRate}%</Text>
          </LinearGradient>
          <Text className="text-xs text-gray-500 dark:text-gray-400">Rate</Text>
        </View>
      </View>

      {/* Priority Breakdown */}
      <View>
        <Text className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">By Priority</Text>
        {Object.entries(priorityStats).map(([priority, count]) => {
          const priorityColor = getPriorityColor(priority as Task['priority']);
          return (
            <View key={priority} className="mb-2 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className={`mr-2 h-3 w-3 rounded-full ${priorityColor.bg}`} />
                <Text className="text-sm capitalize text-gray-700 dark:text-gray-300">{priority}</Text>
              </View>
              <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">{count}</Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}
