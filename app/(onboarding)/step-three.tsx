import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function StepThree() {
  const [workStyle, setWorkStyle] = useState('');
  const [focusTime, setFocusTime] = useState('');
  const [notifications, setNotifications] = useState('');

  const workStyles = [
    { id: 'deep-work', label: 'Deep Work Sessions', description: 'Long, focused work blocks' },
    { id: 'time-blocking', label: 'Time Blocking', description: 'Schedule specific time slots' },
    { id: 'pomodoro', label: 'Pomodoro Technique', description: '25-minute focused intervals' },
    { id: 'flexible', label: 'Flexible Approach', description: 'Adapt as needed' },
  ];

  const focusTimes = [
    { id: '15min', label: '15 minutes', description: 'Quick tasks' },
    { id: '30min', label: '30 minutes', description: 'Short sessions' },
    { id: '1hour', label: '1 hour', description: 'Standard sessions' },
    { id: '2hour', label: '2+ hours', description: 'Deep focus' },
  ];

  const notificationOptions = [
    { id: 'frequent', label: 'Frequent', description: 'Multiple reminders throughout the day' },
    { id: 'moderate', label: 'Moderate', description: 'Important updates and daily summaries' },
    { id: 'minimal', label: 'Minimal', description: 'Only critical notifications' },
    { id: 'none', label: 'None', description: 'No notifications' },
  ];

  const handleContinue = () => { router.push('./step-four');};
  const handleBack = () => { router.back(); };



  const isFormValid = workStyle && focusTime && notifications;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 py-8">
        {/* Header */}
        <Text className="text-3xl font-bold text-gray-900 mb-4 text-center">
          How do you prefer to work?
        </Text>
        <Text className="text-base text-gray-600 mb-8 text-center">
          Help us customize AppliGo to match your work style
        </Text>

        {/* Work Style */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Preferred Work Style
          </Text>
          {workStyles.map((style) => (
            <TouchableOpacity
              key={style.id}
              onPress={() => setWorkStyle(style.id)}
              className={`w-full p-4 mb-3 border rounded-xl ${
                workStyle === style.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className={`text-base font-medium ${
                    workStyle === style.id ? 'text-blue-700' : 'text-gray-800'
                  }`}>
                    {style.label}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {style.description}
                  </Text>
                </View>
                <View className={`w-5 h-5 rounded-full border-2 ${
                  workStyle === style.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {workStyle === style.id && (
                    <View className="w-2 h-2 bg-white rounded-full m-auto" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Focus Time */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Typical Focus Duration
          </Text>
          {focusTimes.map((time) => (
            <TouchableOpacity
              key={time.id}
              onPress={() => setFocusTime(time.id)}
              className={`w-full p-4 mb-3 border rounded-xl ${
                focusTime === time.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className={`text-base font-medium ${
                    focusTime === time.id ? 'text-blue-700' : 'text-gray-800'
                  }`}>
                    {time.label}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {time.description}
                  </Text>
                </View>
                <View className={`w-5 h-5 rounded-full border-2 ${
                  focusTime === time.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {focusTime === time.id && (
                    <View className="w-2 h-2 bg-white rounded-full m-auto" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notifications */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Notification Preferences
          </Text>
          {notificationOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => setNotifications(option.id)}
              className={`w-full p-4 mb-3 border rounded-xl ${
                notifications === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className={`text-base font-medium ${
                    notifications === option.id ? 'text-blue-700' : 'text-gray-800'
                  }`}>
                    {option.label}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {option.description}
                  </Text>
                </View>
                <View className={`w-5 h-5 rounded-full border-2 ${
                  notifications === option.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {notifications === option.id && (
                    <View className="w-2 h-2 bg-white rounded-full m-auto" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Buttons */}
        <View className="space-y-3">
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!isFormValid}
            className={`w-full py-4 rounded-lg ${
              isFormValid ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <Text className={`text-base font-semibold text-center ${
              isFormValid ? 'text-white' : 'text-gray-500'
            }`}>
              Continue
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
      </ScrollView>
    </SafeAreaView>
  );
}
