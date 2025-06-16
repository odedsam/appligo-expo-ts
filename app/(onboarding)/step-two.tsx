import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function StepTwo() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const productivityGoals = [
    { id: 'time-management', label: 'Better Time Management', icon: '⏰' },
    { id: 'task-organization', label: 'Task Organization', icon: '📋' },
    { id: 'focus-improvement', label: 'Improve Focus', icon: '🎯' },
    { id: 'habit-building', label: 'Build Better Habits', icon: '🔄' },
    { id: 'goal-tracking', label: 'Track Goals', icon: '📈' },
    { id: 'work-life-balance', label: 'Work-Life Balance', icon: '⚖️' },
    { id: 'reduce-distractions', label: 'Reduce Distractions', icon: '🔕' },
    { id: 'team-collaboration', label: 'Team Collaboration', icon: '👥' },
  ];

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleContinue = () => {
    router.push('./step-three');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 py-8">
        {/* Header */}
        <Text className="text-3xl font-bold text-gray-900 mb-4 text-center">
          What are your productivity goals?
        </Text>
        <Text className="text-base text-gray-600 mb-8 text-center">
          Select all that apply to personalize your AppliGo experience
        </Text>

        {/* Goals Grid */}
        <View className="mb-8">
          {productivityGoals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              onPress={() => toggleGoal(goal.id)}
              className={`w-full p-4 mb-3 border rounded-xl flex-row items-center ${
                selectedGoals.includes(goal.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <Text className="text-2xl mr-4">{goal.icon}</Text>
              <Text
                className={`text-base font-medium flex-1 ${
                  selectedGoals.includes(goal.id) ? 'text-blue-700' : 'text-gray-800'
                }`}
              >
                {goal.label}
              </Text>
              {selectedGoals.includes(goal.id) && (
                <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected count */}
        <Text className="text-sm text-gray-500 text-center mb-8">
          {selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''} selected
        </Text>

        {/* Buttons */}
        <View className="space-y-3">
          <TouchableOpacity
            onPress={handleContinue}
            disabled={selectedGoals.length === 0}
            className={`w-full py-4 rounded-lg ${
              selectedGoals.length > 0
                ? 'bg-blue-600'
                : 'bg-gray-300'
            }`}
          >
            <Text className={`text-base font-semibold text-center ${
              selectedGoals.length > 0 ? 'text-white' : 'text-gray-500'
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
