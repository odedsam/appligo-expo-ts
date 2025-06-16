import Card from '@/components/ui/Card';
import type { Goal } from '@/types';

import React from 'react';
import type { ColorValue } from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native';

import { Feather } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

export interface GoalCard extends Goal {
  progress: number;
  target: number;
  category: 'health' | 'work' | 'personal' | 'learning' | 'finance';
  priority: 'low' | 'medium' | 'high';
  deadline?: Date;
  isCompleted: boolean;
}

interface GoalCardProps {
  goal: GoalCard;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleComplete?: () => void;
}

export function GoalCard({ goal, onPress, onEdit, onDelete, onToggleComplete }: GoalCardProps) {
  const progressPercentage = Math.round((goal.progress / goal.target) * 100);

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

  const getCategoryColor = (category: GoalCard['category']): readonly [ColorValue, ColorValue] => {
    const colors: Record<GoalCard['category'], readonly [ColorValue, ColorValue]> = {
      health: ['#ff6b6b', '#ee5a52'],
      work: ['#4ecdc4', '#44a08d'],
      personal: ['#a8e6cf', '#7fcdcd'],
      learning: ['#ffd93d', '#ff9a3c'],
      finance: ['#6c5ce7', '#a29bfe'],
    };
    return colors[category];
  };

  const getPriorityColor = (priority: GoalCard['priority']) => {
    const colors = {
      low: 'text-green-500',
      medium: 'text-yellow-500',
      high: 'text-red-500',
    };
    return colors[priority];
  };

  const daysLeft = goal.deadline ? Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <Card variant="elevated" onPress={onPress} className="mb-4" shadow>
      <View className="relative overflow-hidden">
        {/* Category Gradient Bar */}
        <LinearGradient
          colors={getCategoryColor(goal.category)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="absolute left-0 top-0 h-1 w-full"
        />

        {/* Header */}
        <View className="mb-3 mt-2 flex-row items-start justify-between">
          <View className="flex-1">
            <View className="mb-2 flex-row items-center">
              <View className="mr-3 rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                <Feather name={getCategoryIcon(goal.category)} size={16} color="#667eea" />
              </View>
              <Text className="flex-1 text-lg font-bold text-gray-900 dark:text-gray-100">{goal.title}</Text>
              <View className="flex-row items-center">
                <Text className={`text-xs font-medium uppercase ${getPriorityColor(goal.priority)}`}>{goal.priority}</Text>
                <TouchableOpacity onPress={onEdit} className="ml-2 p-1">
                  <Feather name="more-horizontal" size={16} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>

            {goal.description && <Text className="mb-3 text-sm text-gray-600 dark:text-gray-400">{goal.description}</Text>}
          </View>
        </View>

        {/* Progress Section */}
        <View className="mb-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</Text>
            <Text className="text-sm font-bold text-blue-600">
              {goal.progress}/{goal.target} ({progressPercentage}%)
            </Text>
          </View>

          {/* Progress Bar */}
          <View className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
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
              <View className="mr-4 flex-row items-center">
                <Feather name="clock" size={14} color="#6b7280" />
                <Text className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                  {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today' : 'Overdue'}
                </Text>
              </View>
            )}
            <View className="flex-row items-center">
              <Feather name="calendar" size={14} color="#6b7280" />
              <Text className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                {goal.created_at ? new Date(goal.created_at).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={onToggleComplete}
            className={`rounded-full p-2 ${goal.isCompleted ? 'bg-green-100' : 'bg-gray-100 dark:bg-gray-800'}`}>
            <Feather name={goal.isCompleted ? 'check-circle' : 'circle'} size={16} color={goal.isCompleted ? '#10b981' : '#6b7280'} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}
