import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: keyof typeof Ionicons.glyphMap;
  gradientColors: string;
  onPress?: () => void;
}

interface ProductivityData {
  totalApplications: number;
  weeklyApplications: number;
  responseRate: number;
  interviewRate: number;
  averageResponseTime: number;
  activeApplications: number;
  rejections: number;
  pending: number;
  weeklyChange: {
    applications: number;
    responses: number;
    interviews: number;
    responseTime: number;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  gradientColors,
  onPress
}) => (
  <Pressable
    onPress={onPress}
    className="flex-1 mx-1 mb-4"
  >
    <View className={`p-4 rounded-xl shadow-lg ${gradientColors}`}>
      <View className="flex-row justify-between items-start mb-3">
        <View className="bg-white/20 p-2 rounded-lg">
          <Ionicons name={icon} size={20} color="white" />
        </View>
        {change !== undefined && (
          <View className={`px-2 py-1 rounded-full flex-row items-center ${
            change >= 0 ? 'bg-green-500/80' : 'bg-red-500/80'
          }`}>
            <Ionicons
              name={change >= 0 ? 'trending-up' : 'trending-down'}
              size={10}
              color="white"
            />
            <Text className="text-white text-xs font-semibold ml-1">
              {Math.abs(change)}%
            </Text>
          </View>
        )}
      </View>
      <Text className="text-white text-2xl font-bold mb-1">
        {value}
      </Text>
      <Text className="text-white/80 text-sm font-medium">
        {title}
      </Text>
    </View>
  </Pressable>
);

interface ProductivityMetricsProps {
  data?: ProductivityData;
  onMetricPress?: (metricKey: string) => void;
}

const ProductivityMetrics: React.FC<ProductivityMetricsProps> = ({
  data = {
    totalApplications: 127,
    weeklyApplications: 18,
    responseRate: 24.8,
    interviewRate: 9.4,
    averageResponseTime: 4.2,
    activeApplications: 42,
    rejections: 28,
    pending: 57,
    weeklyChange: {
      applications: 22.4,
      responses: -3.2,
      interviews: 18.7,
      responseTime: -12.1,
    }
  },
  onMetricPress
}) => {
  const formatResponseTime = (days: number): string => {
    if (days < 1) return `${Math.round(days * 24)}h`;
    if (days === 1) return '1 day';
    return `${days.toFixed(1)} days`;
  };

  const formatPercentage = (value: number): string => `${value.toFixed(1)}%`;

  const metrics = [
    {
      key: 'totalApplications',
      title: 'Total Applications',
      value: data.totalApplications,
      change: data.weeklyChange.applications,
      icon: 'document-text' as const,
      gradientColors: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      key: 'weeklyApplications',
      title: 'This Week',
      value: data.weeklyApplications,
      change: data.weeklyChange.applications,
      icon: 'calendar' as const,
      gradientColors: 'bg-gradient-to-br from-purple-500 to-purple-600',
    },
    {
      key: 'responseRate',
      title: 'Response Rate',
      value: formatPercentage(data.responseRate),
      change: data.weeklyChange.responses,
      icon: 'mail-open' as const,
      gradientColors: 'bg-gradient-to-br from-green-500 to-green-600',
    },
    {
      key: 'interviewRate',
      title: 'Interview Rate',
      value: formatPercentage(data.interviewRate),
      change: data.weeklyChange.interviews,
      icon: 'people' as const,
      gradientColors: 'bg-gradient-to-br from-orange-500 to-orange-600',
    },
    {
      key: 'averageResponseTime',
      title: 'Avg Response Time',
      value: formatResponseTime(data.averageResponseTime),
      change: data.weeklyChange.responseTime,
      icon: 'time' as const,
      gradientColors: 'bg-gradient-to-br from-teal-500 to-teal-600',
    },
    {
      key: 'activeApplications',
      title: 'Active Applications',
      value: data.activeApplications,
      icon: 'flash' as const,
      gradientColors: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    },
  ];

  const statusMetrics = [
    {
      key: 'pending',
      title: 'Pending',
      value: data.pending,
      icon: 'hourglass' as const,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200',
    },
    {
      key: 'rejections',
      title: 'Rejections',
      value: data.rejections,
      icon: 'close-circle' as const,
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 pt-6 pb-4">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Productivity Metrics
        </Text>
        <Text className="text-gray-600">
          Track your job application progress and performance
        </Text>
      </View>

      {/* Main Metrics Grid */}
      <View className="px-4">
        <View className="flex-row flex-wrap -mx-1">
          {metrics.map((metric, index) => (
            <View
              key={metric.key}
              className={index % 2 === 0 ? "w-1/2" : "w-1/2"}
            >
              <MetricCard
                title={metric.title}
                value={metric.value}
                change={metric.change}
                icon={metric.icon}
                gradientColors={metric.gradientColors}
                onPress={() => onMetricPress?.(metric.key)}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Status Overview */}
      <View className="px-4 mt-4">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Application Status Overview
        </Text>
        <View className="flex-row space-x-3">
          {statusMetrics.map((status) => (
            <Pressable
              key={status.key}
              className={`flex-1 p-4 rounded-xl border-2 ${status.bgColor}`}
              onPress={() => onMetricPress?.(status.key)}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Ionicons
                  name={status.icon}
                  size={20}
                  className={status.color}
                />
                <Text className={`text-2xl font-bold ${status.color}`}>
                  {status.value}
                </Text>
              </View>
              <Text className="text-gray-700 font-medium text-sm">
                {status.title}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Quick Stats Summary */}
      <View className="px-4 mt-6 mb-8">
        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Weekly Summary
          </Text>
          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Applications sent</Text>
              <View className="flex-row items-center">
                <Text className="font-semibold text-gray-900 mr-2">
                  {data.weeklyApplications}
                </Text>
                <View className={`px-2 py-1 rounded-full ${
                  data.weeklyChange.applications >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    data.weeklyChange.applications >= 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {data.weeklyChange.applications > 0 ? '+' : ''}
                    {data.weeklyChange.applications}%
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Success rate</Text>
              <Text className="font-semibold text-gray-900">
                {((data.activeApplications / data.totalApplications) * 100).toFixed(1)}%
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Conversion rate</Text>
              <Text className="font-semibold text-gray-900">
                {formatPercentage(data.interviewRate)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductivityMetrics;
