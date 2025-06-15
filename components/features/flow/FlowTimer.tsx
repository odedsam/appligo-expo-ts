import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Alert, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

interface TimerSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  sessionsUntilLongBreak: number;
}

interface FlowTimerProps {
  settings?: TimerSettings;
  onTimerComplete?: (type: 'work' | 'break', duration: number) => void;
  onTimerStart?: () => void;
  onTimerPause?: () => void;
  onTimerReset?: () => void;
}

type TimerState = 'idle' | 'running' | 'paused' | 'completed';
type TimerType = 'work' | 'shortBreak' | 'longBreak';

const FlowTimer: React.FC<FlowTimerProps> = ({
  settings = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
  },
  onTimerComplete,
  onTimerStart,
  onTimerPause,
  onTimerReset,
}) => {
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60); // in seconds
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [currentType, setCurrentType] = useState<TimerType>('work');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalWorkTime, setTotalWorkTime] = useState(0); // in seconds
  const [totalBreakTime, setTotalBreakTime] = useState(0); // in seconds
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            completeTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState]);

  const playCompletionSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/timer-complete.mp3') // You'll need to add this sound file
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      // Fallback to vibration if sound fails
      Vibration.vibrate([0, 500, 200, 500]);
    }
  };

  const startTimer = () => {
    setTimerState('running');
    startTimeRef.current = Date.now();
    onTimerStart?.();
  };

  const pauseTimer = () => {
    setTimerState('paused');
    onTimerPause?.();
  };

  const resumeTimer = () => {
    setTimerState('running');
    startTimeRef.current = Date.now();
  };

  const resetTimer = () => {
    setTimerState('idle');
    const duration = getDurationForType(currentType);
    setTimeLeft(duration * 60);
    onTimerReset?.();
  };

  const completeTimer = async () => {
    setTimerState('completed');

    // Update statistics
    const duration = getDurationForType(currentType);
    if (currentType === 'work') {
      setTotalWorkTime(prev => prev + duration * 60);
      setCompletedSessions(prev => prev + 1);
    } else {
      setTotalBreakTime(prev => prev + duration * 60);
    }

    // Play completion sound and vibrate
    await playCompletionSound();

    // Show completion alert
    Alert.alert(
      `${currentType === 'work' ? 'Work' : 'Break'} Complete!`,
      `Time for a ${getNextTimerType() === 'work' ? 'work session' : 'break'}.`,
      [
        { text: 'Skip', onPress: skipToNext },
        { text: 'Start Next', onPress: startNextTimer },
      ]
    );

    onTimerComplete?.(
      currentType === 'work' ? 'work' : 'break',
      duration
    );
  };

  const getDurationForType = (type: TimerType): number => {
    switch (type) {
      case 'work':
        return settings.workDuration;
      case 'shortBreak':
        return settings.shortBreakDuration;
      case 'longBreak':
        return settings.longBreakDuration;
    }
  };

  const getNextTimerType = (): TimerType => {
    if (currentType === 'work') {
      return (completedSessions + 1) % settings.sessionsUntilLongBreak === 0
        ? 'longBreak'
        : 'shortBreak';
    }
    return 'work';
  };

  const startNextTimer = () => {
    const nextType = getNextTimerType();
    setCurrentType(nextType);
    const duration = getDurationForType(nextType);
    setTimeLeft(duration * 60);
    setTimerState('running');
    startTimeRef.current = Date.now();
  };

  const skipToNext = () => {
    const nextType = getNextTimerType();
    setCurrentType(nextType);
    const duration = getDurationForType(nextType);
    setTimeLeft(duration * 60);
    setTimerState('idle');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getProgress = (): number => {
    const totalDuration = getDurationForType(currentType) * 60;
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  };

  const getTimerColor = (): string => {
    switch (currentType) {
      case 'work':
        return 'from-red-500 to-red-600';
      case 'shortBreak':
        return 'from-green-500 to-green-600';
      case 'longBreak':
        return 'from-blue-500 to-blue-600';
    }
  };

  const getTimerIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (currentType) {
      case 'work':
        return 'briefcase';
      case 'shortBreak':
        return 'cafe';
      case 'longBreak':
        return 'bed';
    }
  };

  const getTimerTitle = (): string => {
    switch (currentType) {
      case 'work':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Timer Display */}
      <View className="flex-1 justify-center items-center p-8">
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          className="w-80 h-80 rounded-full justify-center items-center shadow-2xl"
        >
          {/* Progress Ring */}
          <View className="absolute inset-4 rounded-full border-8 border-gray-200">
            <View
              className={`absolute inset-0 rounded-full border-8 border-transparent`}
              style={{
                borderTopColor: currentType === 'work' ? '#EF4444' : currentType === 'shortBreak' ? '#10B981' : '#3B82F6',
                transform: [{ rotate: `${(getProgress() * 360) / 100}deg` }],
              }}
            />
          </View>

          {/* Timer Content */}
          <View className="items-center">
            <View className={`p-4 rounded-full mb-4 bg-gradient-to-br ${getTimerColor()}`}>
              <Ionicons name={getTimerIcon()} size={32} color="white" />
            </View>

            <Text className="text-5xl font-bold text-gray-900 mb-2">
              {formatTime(timeLeft)}
            </Text>

            <Text className="text-lg text-gray-600 mb-4">
              {getTimerTitle()}
            </Text>

            <View className="flex-row items-center">
              <View className={`w-3 h-3 rounded-full mr-2 ${
                timerState === 'running' ? 'bg-green-500' :
                timerState === 'paused' ? 'bg-yellow-500' : 'bg-gray-400'
              }`} />
              <Text className="text-sm text-gray-600 capitalize">
                {timerState === 'completed' ? 'Complete' : timerState}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Controls */}
      <View className="px-8 pb-8">
        <View className="flex-row space-x-4 mb-6">
          {timerState === 'idle' || timerState === 'completed' ? (
            <Pressable
              onPress={startTimer}
              className={`flex-1 py-4 rounded-2xl bg-gradient-to-r ${getTimerColor()} shadow-lg`}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="play" size={24} color="white" />
                <Text className="text-white font-bold text-lg ml-2">Start</Text>
              </View>
            </Pressable>
          ) : timerState === 'running' ? (
            <Pressable
              onPress={pauseTimer}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="pause" size={24} color="white" />
                <Text className="text-white font-bold text-lg ml-2">Pause</Text>
              </View>
            </Pressable>
          ) : (
            <Pressable
              onPress={resumeTimer}
              className={`flex-1 py-4 rounded-2xl bg-gradient-to-r ${getTimerColor()} shadow-lg`}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="play" size={24} color="white" />
                <Text className="text-white font-bold text-lg ml-2">Resume</Text>
              </View>
            </Pressable>
          )}

          <Pressable
            onPress={resetTimer}
            className="px-6 py-4 rounded-2xl bg-gray-200 shadow-lg"
          >
            <Ionicons name="refresh" size={24} color="#374151" />
          </Pressable>
        </View>

        {/* Statistics */}
        <View className="bg-white rounded-2xl p-6 shadow-lg">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Today's Progress</Text>

          <View className="flex-row justify-between mb-4">
            <View className="items-center">
              <View className="p-3 rounded-full bg-red-100 mb-2">
                <Ionicons name="briefcase" size={20} color="#EF4444" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">{completedSessions}</Text>
              <Text className="text-sm text-gray-600">Sessions</Text>
            </View>

            <View className="items-center">
              <View className="p-3 rounded-full bg-blue-100 mb-2">
                <Ionicons name="time" size={20} color="#3B82F6" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {formatTotalTime(totalWorkTime)}
              </Text>
              <Text className="text-sm text-gray-600">Focus Time</Text>
            </View>

            <View className="items-center">
              <View className="p-3 rounded-full bg-green-100 mb-2">
                <Ionicons name="cafe" size={20} color="#10B981" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {formatTotalTime(totalBreakTime)}
              </Text>
              <Text className="text-sm text-gray-600">Break Time</Text>
            </View>
          </View>

          {/* Session Progress Indicators */}
          <View className="flex-row justify-center space-x-2">
            {Array.from({ length: settings.sessionsUntilLongBreak }, (_, i) => (
              <View
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < completedSessions % settings.sessionsUntilLongBreak
                    ? 'bg-red-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </View>
          <Text className="text-xs text-gray-500 text-center mt-2">
            {settings.sessionsUntilLongBreak - (completedSessions % settings.sessionsUntilLongBreak)} sessions until long break
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="flex-row space-x-4 mt-6">
          <Pressable
            onPress={() => {
              setCurrentType('work');
              setTimeLeft(settings.workDuration * 60);
              setTimerState('idle');
            }}
            className="flex-1 py-3 rounded-xl bg-red-100 border border-red-200"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="briefcase" size={18} color="#EF4444" />
              <Text className="text-red-600 font-medium ml-2">Work</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              setCurrentType('shortBreak');
              setTimeLeft(settings.shortBreakDuration * 60);
              setTimerState('idle');
            }}
            className="flex-1 py-3 rounded-xl bg-green-100 border border-green-200"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="cafe" size={18} color="#10B981" />
              <Text className="text-green-600 font-medium ml-2">Short Break</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              setCurrentType('longBreak');
              setTimeLeft(settings.longBreakDuration * 60);
              setTimerState('idle');
            }}
            className="flex-1 py-3 rounded-xl bg-blue-100 border border-blue-200"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="bed" size={18} color="#3B82F6" />
              <Text className="text-blue-600 font-medium ml-2">Long Break</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default FlowTimer;
