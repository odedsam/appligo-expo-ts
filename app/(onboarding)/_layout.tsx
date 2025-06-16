import { Stack, usePathname } from 'expo-router';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingLayout() {
  const pathname = usePathname();

  const getStepNumber = (path: string): number => {
    if (path.includes('stepone')) return 1;
    if (path.includes('steptwo')) return 2;
    if (path.includes('stepthree')) return 3;
    if (path.includes('stepfour')) return 4;
    return 1;
  };

  const currentStep = getStepNumber(pathname);
  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <Stack
        screenOptions={{
          header: () => (
            <View className="bg-black my-8 px-5 py-4 shadow-sm">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-2xl font-semibold text-white">
                  Getting Started
                </Text>
                <Text className="text-sm font-medium text-white">
                  Step <Text className='text-green-500 font-bold'>{currentStep}</Text> of <Text>{totalSteps}</Text>
                </Text>
              </View>

              <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </View>
            </View>
          ),
        }}
      />
    </SafeAreaView>
  );
}
