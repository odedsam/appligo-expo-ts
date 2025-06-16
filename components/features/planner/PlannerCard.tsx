// PlannerCard.tsx
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Feather } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

import Card from '../../ui/Card';

// Assuming this path is correct for your project

interface PlannerEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  category: 'work' | 'personal' | 'health' | 'learning' | 'meeting' | 'break';
  priority: 'low' | 'medium' | 'high';
  isCompleted?: boolean;
  location?: string;
  attendees?: string[];
  color?: string; // Custom color for the event
}

interface PlannerCardProps {
  event: PlannerEvent;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  variant?: 'compact' | 'detailed';
  showDate?: boolean;
}

export function PlannerCard({ event, onPress, onEdit, onDelete, variant = 'detailed', showDate = false }: PlannerCardProps) {
  const getCategoryIcon = (category: PlannerEvent['category']) => {
    const icons = {
      work: 'briefcase',
      personal: 'user',
      health: 'heart',
      learning: 'book',
      meeting: 'users',
      break: 'coffee',
    } as const;
    return icons[category];
  };

  const getCategoryColor = (category: PlannerEvent['category']): [string, string] => {
    const colors: Record<PlannerEvent['category'], [string, string]> = {
      work: ['#3b82f6', '#1d4ed8'], // Blue
      personal: ['#10b981', '#059669'], // Green
      health: ['#ef4444', '#dc2626'], // Red
      learning: ['#f59e0b', '#d97706'], // Amber/Orange
      meeting: ['#8b5cf6', '#7c3aed'], // Purple
      break: ['#6b7280', '#4b5563'], // Gray
    };
    return event.color ? [event.color, event.color] : colors[category]; // Use custom color if provided
  };

  const getPriorityColor = (priority: PlannerEvent['priority']) => {
    const colors = {
      low: 'text-gray-500',
      medium: 'text-yellow-600',
      high: 'text-red-600',
    };
    return colors[priority];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getDuration = () => {
    const diff = event.endTime.getTime() - event.startTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`;
    }
    return `${minutes}m`;
  };

  const isOngoing = () => {
    const now = new Date();
    return now >= event.startTime && now <= event.endTime;
  };

  const isPast = () => {
    return new Date() > event.endTime;
  };

  const isFuture = () => {
    return new Date() < event.startTime;
  };

  const textColorClass = isPast() ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100';
  const subTextColorClass = isPast() ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300';
  const iconColor = isPast() ? '#9ca3af' : '#667eea'; // Tailwind gray-400 for past, blue-500 for active/future

  if (variant === 'compact') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View
          className={`mb-2 flex-row items-center rounded-xl p-3 ${
            isOngoing() ? 'bg-blue-50 dark:bg-blue-900/20' : isPast() ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'
          }`}>
          {/* Time Indicator */}
          <View className="mr-3 items-center">
            <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">{formatTime(event.startTime)}</Text>
            <View className="my-1 h-2 w-2 rounded-full bg-blue-500" />
            <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">{formatTime(event.endTime)}</Text>
          </View>

          {/* Content */}
          <View className="flex-1">
            <Text className={`font-semibold ${textColorClass}`}>{event.title}</Text>
            {event.location && (
              <View className="mt-1 flex-row items-center">
                <Feather name="map-pin" size={12} color={subTextColorClass.includes('dark:text-gray-500') ? '#9ca3af' : '#6b7280'} />
                <Text className={`ml-1 text-xs ${subTextColorClass}`}>{event.location}</Text>
              </View>
            )}
            {showDate && <Text className={`mt-1 text-xs ${subTextColorClass}`}>{formatDate(event.startTime)}</Text>}
          </View>

          {/* Category Icon */}
          <View className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
            <Feather name={getCategoryIcon(event.category)} size={16} color={iconColor} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <Card
      variant="elevated"
      onPress={onPress}
      className={`mb-4 ${isOngoing() ? 'border-2 border-blue-500 dark:border-blue-400' : ''} ${isPast() ? 'opacity-70' : ''}`}>
      <View className="relative overflow-hidden">
        {/* Category Color Bar */}
        <LinearGradient
          colors={getCategoryColor(event.category)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="absolute left-0 top-0 h-1 w-full"
        />

        {/* Status Indicator */}
        {isOngoing() && (
          <View className="absolute right-2 top-2 rounded-full bg-green-500 px-2 py-1">
            <Text className="text-xs font-medium text-white">Live</Text>
          </View>
        )}
        {isPast() && event.isCompleted && (
          <View className="absolute right-2 top-2 rounded-full bg-purple-500 px-2 py-1">
            <Text className="text-xs font-medium text-white">Completed</Text>
          </View>
        )}
        {isFuture() && (
          <View className="absolute right-2 top-2 rounded-full bg-blue-500 px-2 py-1">
            <Text className="text-xs font-medium text-white">Upcoming</Text>
          </View>
        )}
        {isPast() && !event.isCompleted && (
          <View className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1">
            <Text className="text-xs font-medium text-white">Missed</Text>
          </View>
        )}

        {/* Header */}
        <View className="mb-3 mt-3 flex-row items-start justify-between px-4">
          <View className="flex-1 pr-4">
            <View className="mb-2 flex-row items-center">
              <LinearGradient colors={getCategoryColor(event.category)} className="mr-3 rounded-full p-2">
                <Feather name={getCategoryIcon(event.category)} size={16} color="white" />
              </LinearGradient>
              <View className="flex-1">
                <Text className={`text-lg font-bold ${textColorClass}`}>{event.title}</Text>
                <Text className={`text-sm ${subTextColorClass}`}>
                  {formatTime(event.startTime)} - {formatTime(event.endTime)} ({getDuration()})
                </Text>
                {showDate && <Text className={`text-sm ${subTextColorClass}`}>{formatDate(event.startTime)}</Text>}
              </View>
            </View>

            {event.description && <Text className={`text-sm ${subTextColorClass} mb-2`}>{event.description}</Text>}

            {event.location && (
              <View className="mb-1 flex-row items-center">
                <Feather name="map-pin" size={14} color={subTextColorClass.includes('dark:text-gray-500') ? '#9ca3af' : '#6b7280'} />
                <Text className={`ml-2 text-sm ${subTextColorClass}`}>{event.location}</Text>
              </View>
            )}

            <View className="mb-1 flex-row items-center">
              <Feather name="tag" size={14} color={subTextColorClass.includes('dark:text-gray-500') ? '#9ca3af' : '#6b7280'} />
              <Text className={`ml-2 text-sm ${subTextColorClass}`}>
                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Feather name="bar-chart-2" size={14} color={subTextColorClass.includes('dark:text-gray-500') ? '#9ca3af' : '#6b7280'} />
              <Text className={`ml-2 text-sm font-semibold ${getPriorityColor(event.priority)}`}>
                {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)} Priority
              </Text>
            </View>

            {event.attendees && event.attendees.length > 0 && (
              <View className="mt-2 flex-row items-center">
                <Feather name="users" size={14} color={subTextColorClass.includes('dark:text-gray-500') ? '#9ca3af' : '#6b7280'} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="ml-2">
                  {event.attendees.map((attendee, index) => (
                    <Text key={index} className={`mr-2 text-sm ${subTextColorClass}`}>
                      {attendee}
                      {index < event.attendees!.length - 1 ? ',' : ''}
                    </Text>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        {(onEdit || onDelete || (event.isCompleted === false && !isPast())) && ( // Only show mark complete for incomplete and non-past events
          <View className="flex-row justify-end border-t border-gray-100 p-3 dark:border-gray-700">
            {event.isCompleted === false && !isPast() && (
              <TouchableOpacity
                onPress={() => {
                  /* Implement mark as complete logic */
                }}
                className="ml-2 flex-row items-center rounded-full bg-purple-500 px-3 py-1.5">
                <Feather name="check-circle" size={16} color="white" />
                <Text className="ml-1 text-sm text-white">Complete</Text>
              </TouchableOpacity>
            )}
            {onEdit && (
              <TouchableOpacity onPress={onEdit} className="ml-2 flex-row items-center rounded-full bg-blue-500 px-3 py-1.5">
                <Feather name="edit" size={16} color="white" />
                <Text className="ml-1 text-sm text-white">Edit</Text>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity onPress={onDelete} className="ml-2 flex-row items-center rounded-full bg-red-500 px-3 py-1.5">
                <Feather name="trash-2" size={16} color="white" />
                <Text className="ml-1 text-sm text-white">Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </Card>
  );
}
