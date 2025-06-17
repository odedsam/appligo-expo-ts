import Animated, {
  FadeIn,
  SlideInDown,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface FlowCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  progress: number;
  status: 'active' | 'completed' | 'pending';
}

export default function Flow() {
  const [currentFlow, setCurrentFlow] = useState('focus');
  const pulseAnimation = useSharedValue(1);
  const breathingAnimation = useSharedValue(1);

  const flowCards: FlowCard[] = [
    {
      id: 'focus',
      title: 'Focus Flow',
      description: 'Boost your concentration and productivity',
      icon: 'screw',
      color: '#667eea',
      progress: 75,
      status: 'active',
    },
    {
      id: 'creativity',
      title: 'Creative Flow',
      description: 'Unleash your creative potential',
      icon: 'brush',
      color: '#f093fb',
      progress: 45,
      status: 'active',
    },
    {
      id: 'meditation',
      title: 'Meditation Flow',
      description: 'Find peace and inner calm',
      icon: 'leaf',
      color: '#4facfe',
      progress: 100,
      status: 'completed',
    },
    {
      id: 'energy',
      title: 'Energy Flow',
      description: 'Recharge your batteries',
      icon: 'flash',
      color: '#43e97b',
      progress: 20,
      status: 'pending',
    },
  ];

  const quickActions = [
    { icon: 'play', title: 'Start Flow', action: 'start' },
    { icon: 'pause', title: 'Pause', action: 'pause' },
    { icon: 'refresh', title: 'Reset', action: 'reset' },
    { icon: 'settings', title: 'Settings', action: 'settings' },
  ];

  useEffect(() => {
    // Pulse animation for active flow
    pulseAnimation.value = withRepeat(withSequence(withSpring(1.05, { damping: 8 }), withSpring(1, { damping: 8 })), -1, true);

    // Breathing animation
    breathingAnimation.value = withRepeat(withSequence(withSpring(1.1, { damping: 4 }), withSpring(1, { damping: 4 })), -1, true);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  const breathingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathingAnimation.value }],
  }));

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return '#43e97b';
    if (progress >= 50) return '#667eea';
    return '#f093fb';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { text: 'Active', color: '#43e97b', bg: 'bg-green-100' },
      completed: { text: 'Completed', color: '#667eea', bg: 'bg-blue-100' },
      pending: { text: 'Pending', color: '#f093fb', bg: 'bg-pink-100' },
    };
    return statusConfig[status as keyof typeof statusConfig];
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={['#667eea', '#764ba2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-6 pb-8 pt-16">
        <View>
          <Text className="mb-2 text-3xl font-bold text-white">Flow</Text>
          <Text className="text-base text-white/80">Discover the Flow That Aligns With You</Text>
        </View>

        <Animated.View entering={SlideInDown.delay(400)} className="mt-6 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Animated.View style={breathingStyle}>
                <View className="h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <Ionicons name="water" size={24} color="white" />
                </View>
              </Animated.View>
              <View className="ml-3">
                <Text className="text-lg font-semibold text-white">Current Flow</Text>
                <Text className="text-white/70">Focus Flow • 15 Mins</Text>
              </View>
            </View>
            <View className="rounded-full bg-green-400 px-3 py-1">
              <Text className="text-xs font-semibold text-white">Active</Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView className="-mt-4 flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <Animated.View entering={SlideInRight.delay(600)} className="mx-6 mb-6">
          <View className="rounded-2xl bg-white p-4 shadow-lg">
            <Text className="mb-4 text-xl font-bold text-gray-800">Quick Actions</Text>
            <View className="flex-row justify-between">
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={action.action}
                  className="mx-1 flex-1 items-center rounded-xl bg-gray-50 p-3"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}>
                  <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Ionicons name={action.icon as any} size={20} color="#667eea" />
                  </View>
                  <Text className="text-center text-xs font-medium text-gray-600">{action.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>

        <View className="mx-6">
          <Text className="mb-4 text-2xl font-bold text-gray-800">Your Flows</Text>
          {flowCards.map((card, index) => {
            const statusBadge = getStatusBadge(card.status);
            const isActive = card.status === 'active';

            return (
              <Animated.View key={card.id} entering={SlideInDown.delay(800 + index * 100)} style={isActive ? pulseStyle : undefined}>
                <TouchableOpacity
                  className="mb-4 overflow-hidden rounded-2xl bg-white"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 6,
                  }}>
                  <LinearGradient colors={[card.color, `${card.color}80`]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="h-2" />

                  <View className="p-5">
                    <View className="mb-3 flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <View
                          className="mr-3 h-12 w-12 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${card.color}20` }}>
                          <Ionicons name={card.icon as any} size={24} color={card.color} />
                        </View>
                        <View>
                          <Text className="text-lg font-bold text-gray-800">{card.title}</Text>
                          <Text className="text-sm text-gray-600">{card.description}</Text>
                        </View>
                      </View>

                      <View className={`rounded-full px-3 py-1 ${statusBadge.bg}`}>
                        <Text className="text-xs font-semibold" style={{ color: statusBadge.color }}>
                          {statusBadge.text}
                        </Text>
                      </View>
                    </View>

                    {/* Progress Bar */}
                    <View className="mb-3">
                      <View className="mb-2 flex-row items-center justify-between">
                        <Text className="text-sm text-gray-600">התקדמות</Text>
                        <Text className="text-sm font-semibold text-gray-800">{card.progress}%</Text>
                      </View>
                      <View className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <View
                          className="h-full rounded-full"
                          style={{
                            width: `${card.progress}%`,
                            backgroundColor: getProgressColor(card.progress),
                          }}
                        />
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row justify-between border-t border-gray-100 pt-3">
                      <TouchableOpacity className="flex-row items-center">
                        <Ionicons name="play" size={16} color={card.color} />
                        <Text className="ml-2 text-sm font-medium" style={{ color: card.color }}>
                          המשך
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity className="flex-row items-center">
                        <Ionicons name="analytics" size={16} color="#6B7280" />
                        <Text className="ml-2 text-sm text-gray-600">סטטיסטיקות</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Add New Flow Button */}
        <Animated.View entering={FadeIn.delay(1200)} className="mx-6 mt-4">
          <TouchableOpacity className="items-center rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-r p-6">
            <View className="mb-3 h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Ionicons name="add" size={32} color="#9CA3AF" />
            </View>
            <Text className="text-lg font-medium text-gray-600">Add New Flow</Text>
            <Text className="mt-1 text-sm text-gray-400">Create Your Custom Flow</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
