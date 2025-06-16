import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, Vibration, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Audio } from 'expo-av';

interface FlowTask {
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  priority: 'low' | 'medium' | 'high';
  category: 'application' | 'research' | 'networking' | 'interview' | 'follow-up';
  completed: boolean;
}

interface FlowSessionData {
  id: string;
  startTime: Date;
  endTime?: Date;
  tasks: FlowTask[];
  completedTasks: number;
  totalFocusTime: number; // in minutes
  breaks: number;
  productivity: number; // percentage
}

interface FlowSessionProps {
  onSessionComplete?: (sessionData: FlowSessionData) => void;
  onSessionPause?: () => void;
  onSessionResume?: () => void;
  initialTasks?: FlowTask[];
}

type SessionState = 'idle' | 'planning' | 'active' | 'paused' | 'break' | 'completed';

const FlowSession: React.FC<FlowSessionProps> = ({ onSessionComplete, onSessionPause, onSessionResume, initialTasks = [] }) => {
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [tasks, setTasks] = useState<FlowTask[]>(initialTasks);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [sessionData, setSessionData] = useState<FlowSessionData | null>(null);
  const [focusLevel, setFocusLevel] = useState(0);
  const [distractions, setDistractions] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const sessionRef = useRef<FlowSessionData | null>(null);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playNotificationSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/notification.mp3'), // You'll need to add this sound file
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      // Fallback to vibration if sound fails
      Vibration.vibrate([0, 250, 250, 250]);
    }
  };

  const startSession = () => {
    if (tasks.length === 0) {
      Alert.alert('No Tasks', 'Please add some tasks before starting your flow session.');
      return;
    }

    const newSession: FlowSessionData = {
      id: Date.now().toString(),
      startTime: new Date(),
      tasks: tasks,
      completedTasks: 0,
      totalFocusTime: 0,
      breaks: 0,
      productivity: 0,
    };

    setSessionData(newSession);
    sessionRef.current = newSession;
    setSessionState('active');
    setFocusLevel(80); // Start with high focus
    playNotificationSound();
  };

  const pauseSession = () => {
    setSessionState('paused');
    onSessionPause?.();
  };

  const resumeSession = () => {
    setSessionState('active');
    onSessionResume?.();
  };

  const completeTask = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: true } : task)));

    if (sessionData) {
      const updatedSession = {
        ...sessionData,
        completedTasks: sessionData.completedTasks + 1,
      };
      setSessionData(updatedSession);
      sessionRef.current = updatedSession;
    }

    // Move to next task
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex((prev) => prev + 1);
    } else {
      endSession();
    }
  };

  const takeBreak = () => {
    setSessionState('break');
    if (sessionData) {
      const updatedSession = {
        ...sessionData,
        breaks: sessionData.breaks + 1,
      };
      setSessionData(updatedSession);
      sessionRef.current = updatedSession;
    }
  };

  const endBreak = () => {
    setSessionState('active');
    setFocusLevel((prev) => Math.min(prev + 10, 100)); // Refresh focus after break
  };

  const endSession = () => {
    if (sessionData) {
      const completedSession: FlowSessionData = {
        ...sessionData,
        endTime: new Date(),
        productivity: Math.round((sessionData.completedTasks / tasks.length) * 100),
      };

      setSessionData(completedSession);
      setSessionState('completed');
      onSessionComplete?.(completedSession);
      playNotificationSound();
    }
  };

  const reportDistraction = () => {
    setDistractions((prev) => prev + 1);
    setFocusLevel((prev) => Math.max(prev - 5, 0));
  };

  const addTask = (task: Omit<FlowTask, 'id' | 'completed'>) => {
    const newTask: FlowTask = {
      ...task,
      id: Date.now().toString(),
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const removeTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const getPriorityColor = (priority: FlowTask['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
    }
  };

  const getCategoryIcon = (category: FlowTask['category']) => {
    switch (category) {
      case 'application':
        return 'document-text';
      case 'research':
        return 'search';
      case 'networking':
        return 'people';
      case 'interview':
        return 'videocam';
      case 'follow-up':
        return 'mail';
      default:
        return 'clipboard';
    }
  };

  const renderTaskCard = (task: FlowTask, index: number) => (
    <View
      key={task.id}
      className={`mb-3 rounded-xl border-2 p-4 ${
        task.completed
          ? 'border-green-200 bg-green-50'
          : currentTaskIndex === index && sessionState === 'active'
            ? 'border-blue-500 bg-blue-50 shadow-lg'
            : 'border-gray-200 bg-white'
      }`}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="mb-2 flex-row items-center">
            <View className={`mr-2 h-3 w-3 rounded-full ${getPriorityColor(task.priority)}`} />
            <Ionicons name={getCategoryIcon(task.category) as keyof typeof Ionicons.glyphMap} size={16} color="#6B7280" />
            <Text className="ml-1 text-xs capitalize text-gray-500">{task.category}</Text>
          </View>
          <Text className={`mb-1 font-semibold ${task.completed ? 'text-green-700 line-through' : 'text-gray-900'}`}>{task.title}</Text>
          <Text className="mb-2 text-sm text-gray-600">{task.description}</Text>
          <Text className="text-xs text-gray-500">Est. {task.estimatedTime} min</Text>
        </View>
        <View className="ml-4">
          {task.completed ? (
            <View className="rounded-full bg-green-500 p-2">
              <Ionicons name="checkmark" size={20} color="white" />
            </View>
          ) : (
            <Pressable onPress={() => completeTask(task.id)} className="rounded-full bg-blue-500 p-2">
              <Ionicons name="checkmark" size={20} color="white" />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );

  if (sessionState === 'idle') {
    return (
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-4">
          <Text className="mb-2 text-2xl font-bold text-gray-900">Flow Session</Text>
          <Text className="mb-6 text-gray-600">Enter your flow state and maximize productivity</Text>

          {tasks.length === 0 ? (
            <View className="mb-6 items-center rounded-xl bg-white p-8">
              <Ionicons name="list" size={48} color="#9CA3AF" />
              <Text className="mb-6 mt-4 text-center text-gray-500">No tasks added yet. Add some tasks to start your flow session.</Text>
              <Pressable
                onPress={() =>
                  addTask({
                    title: 'Apply to Software Engineer Position',
                    description: 'Complete application for React Native position at TechCorp',
                    estimatedTime: 30,
                    priority: 'high',
                    category: 'application',
                  })
                }
                className="rounded-lg bg-blue-500 px-6 py-3">
                <Text className="font-semibold text-white">Add Sample Task</Text>
              </Pressable>
            </View>
          ) : (
            <View className="mb-6">
              <Text className="mb-4 text-lg font-semibold text-gray-900">Your Tasks ({tasks.length})</Text>
              {tasks.map((task, index) => renderTaskCard(task, index))}
            </View>
          )}

          {tasks.length > 0 && (
            <Pressable
              onPress={startSession}
              className="items-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-4 shadow-lg">
              <View className="flex-row items-center">
                <Ionicons name="play" size={24} color="white" />
                <Text className="ml-2 text-lg font-bold text-white">Start Flow Session</Text>
              </View>
              <Text className="mt-1 text-sm text-white/80">Begin your focused work session</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    );
  }

  if (sessionState === 'active' || sessionState === 'paused') {
    const currentTask = tasks[currentTaskIndex];
    const progress = (currentTaskIndex / tasks.length) * 100;

    return (
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-4">
          {/* Session Header */}
          <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-900">Flow Session Active</Text>
              <View className="flex-row items-center">
                <View className={`mr-2 h-3 w-3 rounded-full ${sessionState === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <Text className="text-sm capitalize text-gray-600">{sessionState}</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="mb-3 h-2 rounded-full bg-gray-200">
              <View className="h-2 rounded-full bg-blue-500" style={{ width: `${progress}%` }} />
            </View>
            <Text className="text-sm text-gray-600">
              Task {currentTaskIndex + 1} of {tasks.length} • {Math.round(progress)}% Complete
            </Text>
          </View>

          {/* Focus Level */}
          <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="font-semibold text-gray-900">Focus Level</Text>
              <Text className="text-lg font-bold text-blue-600">{focusLevel}%</Text>
            </View>
            <View className="h-3 rounded-full bg-gray-200">
              <View
                className={`h-3 rounded-full ${focusLevel > 70 ? 'bg-green-500' : focusLevel > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${focusLevel}%` }}
              />
            </View>
            <View className="mt-3 flex-row items-center justify-between">
              <Text className="text-sm text-gray-600">Distractions: {distractions}</Text>
              <Pressable onPress={reportDistraction} className="rounded-full bg-red-100 px-3 py-1">
                <Text className="text-xs font-medium text-red-600">Report Distraction</Text>
              </Pressable>
            </View>
          </View>

          {/* Current Task */}
          {currentTask && (
            <View className="mb-4">
              <Text className="mb-3 text-lg font-semibold text-gray-900">Current Task</Text>
              {renderTaskCard(currentTask, currentTaskIndex)}
            </View>
          )}

          {/* Session Controls */}
          <View className="mb-6 flex-row space-x-3">
            {sessionState === 'active' ? (
              <Pressable onPress={pauseSession} className="flex-1 items-center rounded-xl bg-yellow-500 p-4">
                <Ionicons name="pause" size={24} color="white" />
                <Text className="mt-1 font-semibold text-white">Pause</Text>
              </Pressable>
            ) : (
              <Pressable onPress={resumeSession} className="flex-1 items-center rounded-xl bg-green-500 p-4">
                <Ionicons name="play" size={24} color="white" />
                <Text className="mt-1 font-semibold text-white">Resume</Text>
              </Pressable>
            )}

            <Pressable onPress={takeBreak} className="flex-1 items-center rounded-xl bg-blue-500 p-4">
              <Ionicons name="cafe" size={24} color="white" />
              <Text className="mt-1 font-semibold text-white">Break</Text>
            </Pressable>

            <Pressable onPress={endSession} className="flex-1 items-center rounded-xl bg-red-500 p-4">
              <Ionicons name="stop" size={24} color="white" />
              <Text className="mt-1 font-semibold text-white">End</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (sessionState === 'break') {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4">
        <View className="items-center rounded-2xl bg-white p-8 shadow-lg">
          <Ionicons name="cafe" size={64} color="#3B82F6" />
          <Text className="mb-2 mt-4 text-2xl font-bold text-gray-900">Break Time</Text>
          <Text className="mb-6 text-center text-gray-600">Take a moment to recharge. Your focus will be refreshed when you return.</Text>
          <Pressable onPress={endBreak} className="rounded-xl bg-blue-500 px-8 py-4">
            <Text className="text-lg font-semibold text-white">Back to Work</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (sessionState === 'completed') {
    return (
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-4">
          <View className="mb-6 items-center rounded-2xl bg-white p-6 shadow-lg">
            <Ionicons name="trophy" size={64} color="#10B981" />
            <Text className="mb-2 mt-4 text-2xl font-bold text-gray-900">Session Complete!</Text>
            <Text className="text-center text-gray-600">Great work! You've completed your flow session.</Text>
          </View>

          {sessionData && (
            <View className="rounded-xl bg-white p-4 shadow-sm">
              <Text className="mb-4 text-lg font-semibold text-gray-900">Session Summary</Text>
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Tasks Completed</Text>
                  <Text className="font-semibold">
                    {sessionData.completedTasks}/{tasks.length}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Productivity</Text>
                  <Text className="font-semibold text-green-600">{sessionData.productivity}%</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Breaks Taken</Text>
                  <Text className="font-semibold">{sessionData.breaks}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Distractions</Text>
                  <Text className="font-semibold">{distractions}</Text>
                </View>
              </View>
            </View>
          )}

          <Pressable
            onPress={() => {
              setSessionState('idle');
              setCurrentTaskIndex(0);
              setTasks([]);
              setSessionData(null);
              setFocusLevel(0);
              setDistractions(0);
            }}
            className="mt-6 items-center rounded-xl bg-blue-500 p-4">
            <Text className="text-lg font-semibold text-white">Start New Session</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return null;
};

export default FlowSession;
