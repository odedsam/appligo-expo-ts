import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName] = useState('Alex'); // You can get this from your user state/storage

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Mock data - replace with real data from your state management
  const todayStats = {
    tasksCompleted: 3,
    totalTasks: 8,
    focusTime: 45, // minutes
    streakDays: 7
  };

  const upcomingTasks = [
    { id: 1, title: 'Review project proposal', time: '10:00 AM', priority: 'high' },
    { id: 2, title: 'Team standup meeting', time: '11:30 AM', priority: 'medium' },
    { id: 3, title: 'Update client presentation', time: '2:00 PM', priority: 'high' },
    { id: 4, title: 'Code review session', time: '4:00 PM', priority: 'low' },
  ];

  const quickActions = [
    { id: 'add-task', title: 'Add Task', icon: '➕', color: 'bg-blue-500' },
    { id: 'start-focus', title: 'Focus Mode', icon: '🎯', color: 'bg-purple-500' },
    { id: 'view-habits', title: 'Habits', icon: '🔄', color: 'bg-green-500' },
    { id: 'analytics', title: 'Analytics', icon: '📊', color: 'bg-orange-500' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-4 bg-white">
          <Text className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {userName}!
          </Text>
          <Text className="text-base text-gray-600 mt-1">
            {formatDate(currentTime)}
          </Text>
        </View>

        {/* Today's Progress */}
        <View className="px-6 py-6">
          <Text className="text-xl font-semibold text-gray-900 mb-4">
            Today's Progress
          </Text>

          <View className="bg-white rounded-xl p-6 shadow-sm">
            {/* Progress Bar */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-base font-medium text-gray-700">
                  Tasks Completed
                </Text>
                <Text className="text-sm text-gray-500">
                  {todayStats.tasksCompleted}/{todayStats.totalTasks}
                </Text>
              </View>
              <View className="w-full h-3 bg-gray-200 rounded-full">
                <View
                  className="h-3 bg-blue-500 rounded-full"
                  style={{ width: `${(todayStats.tasksCompleted / todayStats.totalTasks) * 100}%` }}
                />
              </View>
            </View>

            {/* Stats Grid */}
            <View className="flex-row">
              <View className="flex-1 items-center py-3 border-r border-gray-100">
                <Text className="text-2xl font-bold text-blue-600">
                  {todayStats.focusTime}m
                </Text>
                <Text className="text-sm text-gray-500 text-center">
                  Focus Time
                </Text>
              </View>
              <View className="flex-1 items-center py-3 border-r border-gray-100">
                <Text className="text-2xl font-bold text-green-600">
                  {todayStats.tasksCompleted}
                </Text>
                <Text className="text-sm text-gray-500 text-center">
                  Completed
                </Text>
              </View>
              <View className="flex-1 items-center py-3">
                <Text className="text-2xl font-bold text-purple-600">
                  {todayStats.streakDays}
                </Text>
                <Text className="text-sm text-gray-500 text-center">
                  Day Streak
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 pb-6">
          <Text className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                className="w-[48%] mb-4"
              >
                <View className={`${action.color} rounded-xl p-4 items-center`}>
                  <Text className="text-2xl mb-2">{action.icon}</Text>
                  <Text className="text-white font-medium text-center">
                    {action.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upcoming Tasks */}
        <View className="px-6 pb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold text-gray-900">
              Upcoming Tasks
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-600 font-medium">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-xl shadow-sm overflow-hidden">
            {upcomingTasks.slice(0, 4).map((task, index) => (
              <TouchableOpacity key={task.id}>
                <View className={`p-4 border-l-4 ${getPriorityColor(task.priority)} ${
                  index !== upcomingTasks.length - 1 ? 'border-b border-gray-100' : ''
                }`}>
                  <Text className="font-medium text-gray-900 mb-1">
                    {task.title}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {task.time}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Motivational Quote */}
        <View className="px-6 pb-8">
          <View className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6">
            <Text className="text-white text-lg font-medium text-center mb-2">
              "Success is the sum of small efforts repeated day in and day out."
            </Text>
            <Text className="text-blue-100 text-sm text-center">
              — Robert Collier
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg">
        <Text className="text-white text-2xl">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
