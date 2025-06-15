interface TaskStatsProps {
  tasks: Task[];
  timeframe?: 'daily' | 'weekly' | 'monthly';
}

export function TaskStats({ tasks, timeframe = 'daily' }: TaskStatsProps) {
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const overdueTasks = tasks.filter(task =>
    task.dueDate && task.dueDate < new Date() && !task.isCompleted
  ).length;

  const priorityStats = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<Task['priority'], number>);

  return (
    <Card variant="glass" className="mb-4">
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Task Overview
      </Text>

      {/* Stats Grid */}
      <View className="flex-row justify-between mb-6">
        <View className="items-center">
          <LinearGradient
            colors={['#10b981', '#059669']}
            className="w-12 h-12 rounded-full items-center justify-center mb-2"
          >
            <Text className="text-white font-bold">{completedTasks}</Text>
          </LinearGradient>
          <Text className="text-xs text-gray-500 dark:text-gray-400">Completed</Text>
        </View>

        <View className="items-center">
          <LinearGradient
            colors={['#3b82f6', '#1d4ed8']}
            className="w-12 h-12 rounded-full items-center justify-center mb-2"
          >
            <Text className="text-white font-bold">{totalTasks - completedTasks}</Text>
          </LinearGradient>
          <Text className="text-xs text-gray-500 dark:text-gray-400">Pending</Text>
        </View>

        <View className="items-center">
          <LinearGradient
            colors={['#ef4444', '#dc2626']}
            className="w-12 h-12 rounded-full items-center justify-center mb-2"
          >
            <Text className="text-white font-bold">{overdueTasks}</Text>
          </LinearGradient>
          <Text className="text-xs text-gray-500 dark:text-gray-400">Overdue</Text>
        </View>

        <View className="items-center">
          <LinearGradient
            colors={['#8b5cf6', '#7c3aed']}
            className="w-12 h-12 rounded-full items-center justify-center mb-2"
          >
            <Text className="text-white font-bold">{completionRate}%</Text>
          </LinearGradient>
          <Text className="text-xs text-gray-500 dark:text-gray-400">Rate</Text>
        </View>
      </View>

      {/* Priority Breakdown */}
      <View>
        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          By Priority
        </Text>
        {Object.entries(priorityStats).map(([priority, count]) => {
          const priorityColor = getPriorityColor(priority as Task['priority']);
          return (
            <View key={priority} className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <View className={`w-3 h-3 rounded-full mr-2 ${priorityColor.bg}`} />
                <Text className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {priority}
                </Text>
              </View>
              <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {count}
              </Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}
