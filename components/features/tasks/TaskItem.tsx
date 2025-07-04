import React, { useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

import { Feather } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

import Card from '../../ui/Card';

interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  dueDate?: Date;
  estimatedTime?: number; // in minutes
  tags?: string[];
  subtasks?: SubTask[];
  createdAt: Date;
  completedAt?: Date;
}

interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onPress?: () => void;
  showDetails?: boolean;
}

export function TaskItem({ task, onToggleComplete, onEdit, onDelete, onPress, showDetails = true }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedValue = useState(new Animated.Value(0))[0];

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      low: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-200',
      },
      medium: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-600 dark:text-yellow-400',
        border: 'border-yellow-200',
      },
      high: {
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        text: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-200',
      },
      urgent: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-600 dark:text-red-400',
        border: 'border-red-200',
      },
    };
    return colors[priority];
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const isOverdue = task.dueDate && task.dueDate < new Date() && !task.isCompleted;
  const priorityStyle = getPriorityColor(task.priority);
  const completedSubtasks = task.subtasks?.filter((st) => st.isCompleted).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(animatedValue, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Card
      variant={task.isCompleted ? 'outline' : 'elevated'}
      className={`mb-3 ${task.isCompleted ? 'opacity-70' : ''} ${isOverdue ? 'border-l-4 border-red-500' : ''}`}
      onPress={onPress}>
      <View>
        {/* Main Task Row */}
        <View className="flex-row items-start">
          {/* Checkbox */}
          <TouchableOpacity onPress={() => onToggleComplete(task.id)} className="mr-3 mt-1">
            <View
              className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                task.isCompleted ? 'border-green-500 bg-green-500' : 'border-gray-300 dark:border-gray-600'
              }`}>
              {task.isCompleted && <Feather name="check" size={14} color="white" />}
            </View>
          </TouchableOpacity>

          {/* Task Content */}
          <View className="flex-1">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text
                  className={`text-base font-semibold ${
                    task.isCompleted ? 'text-gray-500 line-through dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                  {task.title}
                </Text>

                {task.description && showDetails && (
                  <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">{task.description}</Text>
                )}
              </View>

              {/* Priority Badge */}
              <View className={`rounded-full px-2 py-1 ${priorityStyle.bg} ${priorityStyle.border}`}>
                <Text className={`text-xs font-medium ${priorityStyle.text}`}>{task.priority.toUpperCase()}</Text>
              </View>
            </View>

            {/* Task Meta Info */}
            {showDetails && (
              <View className="mt-2 flex-row flex-wrap items-center">
                {task.dueDate && (
                  <View className={`mb-1 mr-4 flex-row items-center ${isOverdue ? 'text-red-500' : ''}`}>
                    <Feather name="calendar" size={12} color={isOverdue ? '#ef4444' : '#6b7280'} />
                    <Text className={`ml-1 text-xs ${isOverdue ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                      {task.dueDate.toLocaleDateString()}
                    </Text>
                  </View>
                )}

                {task.estimatedTime && (
                  <View className="mb-1 mr-4 flex-row items-center">
                    <Feather name="clock" size={12} color="#6b7280" />
                    <Text className="ml-1 text-xs text-gray-500 dark:text-gray-400">{formatTime(task.estimatedTime)}</Text>
                  </View>
                )}

                {task.category && (
                  <View className="mb-1 mr-4 flex-row items-center">
                    <Feather name="tag" size={12} color="#6b7280" />
                    <Text className="ml-1 text-xs text-gray-500 dark:text-gray-400">{task.category}</Text>
                  </View>
                )}

                {totalSubtasks > 0 && (
                  <TouchableOpacity onPress={toggleExpanded} className="mb-1 mr-4 flex-row items-center">
                    <Feather name="list" size={12} color="#6b7280" />
                    <Text className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                      {completedSubtasks}/{totalSubtasks}
                    </Text>
                    <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={12} color="#6b7280" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && showDetails && (
              <View className="mt-2 flex-row flex-wrap">
                {task.tags.map((tag, index) => (
                  <View key={index} className="mb-1 mr-2 rounded-full bg-blue-100 px-2 py-1 dark:bg-blue-900/30">
                    <Text className="text-xs text-blue-600 dark:text-blue-400">#{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Subtasks */}
            {isExpanded && task.subtasks && task.subtasks.length > 0 && (
              <Animated.View
                style={{
                  opacity: animatedValue,
                  maxHeight: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 200],
                  }),
                }}
                className="mt-3 border-l-2 border-gray-200 pl-4 dark:border-gray-700">
                {task.subtasks.map((subtask) => (
                  <View key={subtask.id} className="mb-2 flex-row items-center">
                    <TouchableOpacity className="mr-2">
                      <View
                        className={`h-4 w-4 items-center justify-center rounded border ${
                          subtask.isCompleted ? 'border-green-500 bg-green-500' : 'border-gray-300 dark:border-gray-600'
                        }`}>
                        {subtask.isCompleted && <Feather name="check" size={10} color="white" />}
                      </View>
                    </TouchableOpacity>
                    <Text
                      className={`text-sm ${
                        subtask.isCompleted ? 'text-gray-500 line-through dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                      {subtask.title}
                    </Text>
                  </View>
                ))}
              </Animated.View>
            )}
          </View>

          {/* Action Menu */}
          {(onEdit || onDelete) && (
            <TouchableOpacity onPress={onEdit} className="ml-2 p-1">
              <Feather name="more-vertical" size={16} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Card>
  );
}
