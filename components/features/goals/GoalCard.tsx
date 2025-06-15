import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Card from '../../ui/Card';

interface Goal {
  id: string;
  title: string;
  description?: string;
  progress: number;
  target: number;
  category: 'health' | 'work' | 'personal' | 'learning' | 'finance';
  priority: 'low' | 'medium' | 'high';
  deadline?: Date;
  isCompleted: boolean;
  createdAt: Date;
}

interface GoalCardProps {
  goal: Goal;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleComplete?: () => void;
}

export function GoalCard({ goal, onPress, onEdit, onDelete, onToggleComplete }: GoalCardProps) {
  const progressPercentage = Math.round((goal.progress / goal.target) * 100);

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

  const getCategoryColor = (category: Goal['category']) => {
    const colors = {
      health: ['#ff6b6b', '#ee5a52'],
      work: ['#4ecdc4', '#44a08d'],
      personal: ['#a8e6cf', '#7fcdcd'],
      learning: ['#ffd93d', '#ff9a3c'],
      finance: ['#6c5ce7', '#a29bfe'],
    };
    return colors[category];
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    const colors = {
      low: 'text-green-500',
      medium: 'text-yellow-500',
      high: 'text-red-500',
    };
    return colors[priority];
  };

  const daysLeft = goal.deadline
    ? Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Card
      variant="elevated"
      onPress={onPress}
      className="mb-4"
      shadow
    >
      <View className="relative overflow-hidden">
        {/* Category Gradient Bar */}
        <LinearGradient
          colors={getCategoryColor(goal.category)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="h-1 w-full absolute top-0 left-0"
        />

        {/* Header */}
        <View className="flex-row items-start justify-between mt-2 mb-3">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <View className="bg-gray-100 dark:bg-gray-800 rounded-full p-2 mr-3">
                <Feather name={getCategoryIcon(goal.category)} size={16} color="#667eea" />
              </View>
              <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 flex-1">
                {goal.title}
              </Text>
              <View className="flex-row items-center">
                <Text className={`text-xs font-medium uppercase ${getPriorityColor(goal.priority)}`}>
                  {goal.priority}
                </Text>
                <TouchableOpacity onPress={onEdit} className="ml-2 p-1">
                  <Feather name="more-horizontal" size={16} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>

            {goal.description && (
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {goal.description}
              </Text>
            )}
          </View>
        </View>

        {/* Progress Section */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </Text>
            <Text className="text-sm font-bold text-blue-600">
              {goal.progress}/{goal.target} ({progressPercentage}%)
            </Text>
          </View>

          {/* Progress Bar */}
          <View className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="h-full rounded-full"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </View>
        </View>

        {/* Footer */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            {daysLeft !== null && (
              <View className="flex-row items-center mr-4">
                <Feather name="clock" size={14} color="#6b7280" />
                <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today' : 'Overdue'}
                </Text>
              </View>
            )}
            <View className="flex-row items-center">
              <Feather name="calendar" size={14} color="#6b7280" />
              <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                {goal.createdAt.toLocaleDateString()}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={onToggleComplete}
            className={`p-2 rounded-full ${goal.isCompleted ? 'bg-green-100' : 'bg-gray-100 dark:bg-gray-800'}`}
          >
            <Feather
              name={goal.isCompleted ? "check-circle" : "circle"}
              size={16}
              color={goal.isCompleted ? "#10b981" : "#6b7280"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}
