import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function Welcome() {

 const handleGetStarted = () => { router.replace('/(onboarding)/step-one');};


  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#667eea', '#764ba2', '#f093fb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
      <View className="flex-1 items-center justify-center px-8">
        <View className="h-32 w-32 items-center justify-center rounded-3xl bg-white/20 shadow-2xl backdrop-blur-sm">
          <View className="h-24 w-24 items-center justify-center rounded-2xl bg-white">
            <Ionicons name="rocket" size={48} color="#667eea" />
          </View>
        </View>
        <Text className="mb-4 mt-4 text-center text-5xl font-bold text-white">AppliGo</Text>
        <Text className="mb-12 text-center text-xl leading-7 text-white/90">Enhance your productivity,{'\n'}achieve your goals</Text>

        <View className="mb-16">
          <View className="mb-4 flex-row items-center">
            <View className="mr-4 rounded-full bg-white/20 p-2">
              <Feather name="calendar" size={20} color="white" />
            </View>
            <Text className="text-lg text-white/90">Smart Planning & Goals</Text>
          </View>

          <View className="mb-4 flex-row items-center">
            <View className="mr-4 rounded-full bg-white/20 p-2">
              <Feather name="check-square" size={20} color="white" />
            </View>
            <Text className="text-lg text-white/90">Task Management</Text>
          </View>

          <View className="mb-4 flex-row items-center">
            <View className="mr-4 rounded-full bg-white/20 p-2">
              <Feather name="bar-chart-2" size={20} color="white" />
            </View>
            <Text className="text-lg text-white/90">Productivity Analytics</Text>
          </View>

          <View className="flex-row items-center">
            <View className="mr-4 rounded-full bg-white/20 p-2">
              <Feather name="zap" size={20} color="white" />
            </View>
            <Text className="text-lg text-white/90">Flow Mode & AI Assistant</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleGetStarted}
          className="rounded-full bg-white px-12 py-4 shadow-lg active:scale-95"
          style={{ elevation: 5 }}>
          <View className="flex-row items-center">
            <Text className="mr-2 text-lg font-semibold text-purple-600">Get Started</Text>
            <Feather name="arrow-right" size={20} color="#7c3aed" />
          </View>
        </TouchableOpacity>

        <Text className="mt-8 text-center text-sm text-white/70">Join thousands of users boosting their productivity</Text>
      </View>
    </View>
  );
}
