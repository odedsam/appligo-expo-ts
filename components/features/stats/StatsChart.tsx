import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart, AreaChart ,XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell} from 'recharts';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const chartWidth = width - 32; // Account for padding

interface ChartData {
  date: string;
  applications: number;
  responses: number;
  interviews: number;
  rejections: number;
}

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface MonthlyData {
  month: string;
  applications: number;
  responseRate: number;
  interviewRate: number;
}

interface StatsChartProps {
  data?: {
    weekly: ChartData[];
    status: StatusData[];
    monthly: MonthlyData[];
  };
}

type ChartType = 'weekly' | 'status' | 'monthly' | 'trends';

const StatsChart: React.FC<StatsChartProps> = ({
  data = {
    weekly: [
      { date: 'Mon', applications: 3, responses: 1, interviews: 0, rejections: 0 },
      { date: 'Tue', applications: 5, responses: 2, interviews: 1, rejections: 1 },
      { date: 'Wed', applications: 2, responses: 0, interviews: 0, rejections: 0 },
      { date: 'Thu', applications: 4, responses: 3, interviews: 1, rejections: 2 },
      { date: 'Fri', applications: 6, responses: 2, interviews: 2, rejections: 1 },
      { date: 'Sat', applications: 1, responses: 1, interviews: 0, rejections: 0 },
      { date: 'Sun', applications: 2, responses: 0, interviews: 0, rejections: 1 },
    ],
    status: [
      { name: 'Pending', value: 45, color: '#FFA726' },
      { name: 'Interviewed', value: 12, color: '#66BB6A' },
      { name: 'Rejected', value: 28, color: '#EF5350' },
      { name: 'Offer', value: 3, color: '#42A5F5' },
    ],
    monthly: [
      { month: 'Jan', applications: 25, responseRate: 20, interviewRate: 8 },
      { month: 'Feb', applications: 32, responseRate: 25, interviewRate: 12 },
      { month: 'Mar', applications: 28, responseRate: 18, interviewRate: 7 },
      { month: 'Apr', applications: 35, responseRate: 28, interviewRate: 15 },
      { month: 'May', applications: 42, responseRate: 30, interviewRate: 18 },
      { month: 'Jun', applications: 38, responseRate: 26, interviewRate: 14 },
    ]
  }
}) => {
  const [activeChart, setActiveChart] = useState<ChartType>('weekly');

  const chartTabs = [
    { key: 'weekly' as const, title: 'Weekly', icon: 'calendar' as const },
    { key: 'status' as const, title: 'Status', icon: 'pie-chart' as const },
    { key: 'monthly' as const, title: 'Monthly', icon: 'bar-chart' as const },
    { key: 'trends' as const, title: 'Trends', icon: 'trending-up' as const },
  ];

  const trendsData = useMemo(() => {
    return data.monthly.map(item => ({
      ...item,
      efficiency: Math.round((item.interviewRate / item.applications) * 100),
    }));
  }, [data.monthly]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <View className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <Text className="font-semibold text-gray-900 mb-2">{label}</Text>
          {payload.map((entry: any, index: number) => (
            <View key={index} className="flex-row items-center mb-1">
              <View
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              />
              <Text className="text-gray-700 text-sm">
                {entry.name}: {entry.value}
              </Text>
            </View>
          ))}
        </View>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'weekly':
        return (
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Weekly Activity
            </Text>
            <ResponsiveContainer width={chartWidth - 32} height={250}>
              <BarChart data={data.weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="applications"
                  fill="#3B82F6"
                  name="Applications"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="responses"
                  fill="#10B981"
                  name="Responses"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="interviews"
                  fill="#F59E0B"
                  name="Interviews"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </View>
        );

      case 'status':
        return (
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Application Status Distribution
            </Text>
            <View className="items-center">
              <ResponsiveContainer width={chartWidth - 32} height={250}>
                <PieChart>
                  <Pie
                    data={data.status}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.status.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </View>
            <View className="flex-row flex-wrap justify-center mt-4">
              {data.status.map((item, index) => (
                <View key={index} className="flex-row items-center mx-3 mb-2">
                  <View
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <Text className="text-gray-700 text-sm">
                    {item.name}: {item.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 'monthly':
        return (
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Performance
            </Text>
            <ResponsiveContainer width={chartWidth - 32} height={250}>
              <LineChart data={data.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name="Applications"
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="responseRate"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Response Rate (%)"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="interviewRate"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  name="Interview Rate (%)"
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </View>
        );

      case 'trends':
        return (
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Efficiency Trends
            </Text>
            <ResponsiveContainer width={chartWidth - 32} height={250}>
              <AreaChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                  name="Efficiency Score"
                />
                <Area
                  type="monotone"
                  dataKey="responseRate"
                  stroke="#06B6D4"
                  fill="#06B6D4"
                  fillOpacity={0.2}
                  name="Response Rate (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 pt-6 pb-4">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Analytics Dashboard
        </Text>
        <Text className="text-gray-600">
          Visualize your job search performance and trends
        </Text>
      </View>

      {/* Chart Type Selector */}
      <View className="px-4 mb-6">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row space-x-3"
        >
          {chartTabs.map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveChart(tab.key)}
              className={`flex-row items-center px-4 py-3 rounded-xl border-2 ${
                activeChart === tab.key
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-white border-gray-200'
              }`}
            >
              <Ionicons
                name={tab.icon}
                size={18}
                color={activeChart === tab.key ? '#3B82F6' : '#6B7280'}
              />
              <Text
                className={`ml-2 font-medium ${
                  activeChart === tab.key
                    ? 'text-blue-600'
                    : 'text-gray-700'
                }`}
              >
                {tab.title}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Chart Container */}
      <View className="px-4 mb-6">
        {renderChart()}
      </View>

      {/* Insights Section */}
      <View className="px-4 mb-8">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Key Insights
        </Text>
        <View className="space-y-3">
          <View className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <View className="flex-row items-start">
              <Ionicons name="bulb" size={20} color="#3B82F6" />
              <View className="ml-3 flex-1">
                <Text className="font-medium text-blue-900 mb-1">
                  Peak Performance Day
                </Text>
                <Text className="text-blue-800 text-sm">
                  Friday shows highest activity with 6 applications and 2 interviews scheduled
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-green-50 border border-green-200 rounded-lg p-4">
            <View className="flex-row items-start">
              <Ionicons name="trending-up" size={20} color="#10B981" />
              <View className="ml-3 flex-1">
                <Text className="font-medium text-green-900 mb-1">
                  Improving Trend
                </Text>
                <Text className="text-green-800 text-sm">
                  Your response rate has increased by 5% over the last month
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <View className="flex-row items-start">
              <Ionicons name="warning" size={20} color="#F59E0B" />
              <View className="ml-3 flex-1">
                <Text className="font-medium text-yellow-900 mb-1">
                  Focus Area
                </Text>
                <Text className="text-yellow-800 text-sm">
                  Consider following up on 45 pending applications to improve conversion
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default StatsChart;
