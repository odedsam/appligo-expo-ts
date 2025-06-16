import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function StepOne() {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Non-binary', value: 'non-binary' },
  ];

  const handleContinue = () => { router.push('./step-two'); };
  const handleSkip = () => { router.push('./step-two'); };



  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      <View className="flex-1 px-6 ">
        {/* Header */}
        <Text className="text-3xl font-bold text-white mb-8 text-center">
          Set Up Your Profile
        </Text>

        {/* Full Name Input */}
        <View className="mb-6">
          <Text className="text-base font-medium text-white mb-2">
            Full Name
          </Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-base"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Age Input */}
        <View className="mb-6">
          <Text className="text-base font-medium text-white mb-2">
            Age
          </Text>
          <TextInput
            value={age}
            onChangeText={setAge}
            placeholder="Enter your age"
            keyboardType="numeric"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-base"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Gender Selection */}
        <View className="mb-8">
          <Text className="text-base font-medium text-white mb-3">
            Gender
          </Text>
          <View className="space-y-3">
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setGender(option.value)}
                className={`w-full px-4 py-3 bg-blue-400 border rounded-lg flex-row items-center ${
                  gender === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full border-2 mr-3 ${
                    gender === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  {gender === option.value && (
                    <View className="w-2 h-2 bg-white rounded-full m-auto" />
                  )}
                </View>
                <Text
                  className={`text-base ${
                    gender === option.value ? 'text-blue-700' : 'text-white'
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Spacer to push buttons to bottom */}
        <View className="flex-1" />

        {/* Buttons */}
        <View className="space-y-3 mt-8">
          <TouchableOpacity
            onPress={handleContinue}
            className="w-full bg-blue-600 py-4 rounded-lg">
            <Text className="text-white text-base font-semibold text-center">
              Continue
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSkip}
            className="w-full bg-zinc-700 py-4 rounded-lg">
            <Text className="text-white text-base font-semibold text-center">
              Skip For Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
