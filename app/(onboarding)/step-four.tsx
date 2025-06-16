import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function StepFour() {
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableDataSync, setEnableDataSync] = useState(true);
  const [enableAnalytics, setEnableAnalytics] = useState(false);

  const handleComplete = () => { router.replace('/(tabs)');};
  const handleBack = () => { router.back(); };



  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 py-8">
        {/* Success Icon */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
            <Text className="text-4xl">🎉</Text>
          </View>

          {/* Header */}
          <Text className="text-3xl font-bold text-gray-900 mb-4 text-center">
            You're all set!
          </Text>
          <Text className="text-base text-gray-600 text-center mb-8">
            Welcome to AppliGo! Let's configure a few final settings to enhance your productivity experience.
          </Text>
        </View>

        {/* Settings */}
        <View className="bg-white rounded-xl p-6 mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-6">
            Final Settings
          </Text>

          {/* Push Notifications */}
          <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <View className="flex-1 mr-4">
              <Text className="text-base font-medium text-gray-900">
                Push Notifications
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Get reminders and updates about your tasks and goals
              </Text>
            </View>
            <Switch
              value={enableNotifications}
              onValueChange={setEnableNotifications}
              trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
              thumbColor={enableNotifications ? '#ffffff' : '#f3f4f6'}
            />
          </View>

          {/* Data Sync */}
          <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <View className="flex-1 mr-4">
              <Text className="text-base font-medium text-gray-900">
                Cloud Sync
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Sync your data across all devices automatically
              </Text>
            </View>
            <Switch
              value={enableDataSync}
              onValueChange={setEnableDataSync}
              trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
              thumbColor={enableDataSync ? '#ffffff' : '#f3f4f6'}
            />
          </View>

          {/* Analytics */}
          <View className="flex-row items-center justify-between py-4">
            <View className="flex-1 mr-4">
              <Text className="text-base font-medium text-gray-900">
                Usage Analytics
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Help us improve AppliGo by sharing anonymous usage data
              </Text>
            </View>
            <Switch
              value={enableAnalytics}
              onValueChange={setEnableAnalytics}
              trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
              thumbColor={enableAnalytics ? '#ffffff' : '#f3f4f6'}
            />
          </View>
        </View>

        {/* Quick Tips */}
        <View className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <Text className="text-lg font-semibold text-blue-900 mb-4">
            💡 Quick Tips to Get Started
          </Text>
          <View className="space-y-3">
            <Text className="text-sm text-blue-800">
              • Create your first task by tapping the + button
            </Text>
            <Text className="text-sm text-blue-800">
              • Set up your daily routine in the Habits section
            </Text>
            <Text className="text-sm text-blue-800">
              • Explore Focus Mode for distraction-free work sessions
            </Text>
            <Text className="text-sm text-blue-800">
              • Check your productivity insights in the Analytics tab
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View className="space-y-3">
          <TouchableOpacity
            onPress={handleComplete}
            className="w-full bg-blue-600 py-4 rounded-lg"
          >
            <Text className="text-white text-base font-semibold text-center">
              Start Using AppliGo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBack}
            className="w-full bg-gray-200 py-4 rounded-lg"
          >
            <Text className="text-gray-700 text-base font-semibold text-center">
              Back
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text className="text-xs text-gray-400 text-center mt-8">
          You can change these settings anytime in the app preferences
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
