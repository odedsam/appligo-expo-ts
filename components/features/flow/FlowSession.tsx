import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Alert, Vibration } from 'react-native';
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

const FlowSession: React.FC<FlowSessionProps> = ({
  onSessionComplete,
  onSessionPause,
  onSessionResume,
  initialTasks = []
}) => {
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
        require('../../assets/sounds/notification.mp3') // You'll need to add this sound file
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
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, completed: true } : task
    ));

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
      setCurrentTaskIndex(prev => prev + 1);
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
    setFocusLevel(prev => Math.min(prev + 10, 100)); // Refresh focus after break
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
    setDistractions(prev => prev + 1);
    setFocusLevel(prev => Math.max(prev - 5, 0));
  };

  const addTask = (task: Omit<FlowTask, 'id' | 'completed'>) => {
    const newTask: FlowTask = {
      ...task,
      id: Date.now().toString(),
      completed: false,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const removeTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const getPriorityColor = (priority: FlowTask['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
    }
  };

  const getCategoryIcon = (category: FlowTask['category']) => {
    switch (category) {
      case 'application': return 'document-text';
      case 'research': return 'search';
      case 'networking': return 'people';
      case 'interview': return 'videocam';
      case 'follow-up': return 'mail';
      default: return 'clipboard';
    }
  };

  const renderTaskCard = (task: FlowTask, index: number) => (
    <View
      key={task.id}
      className={`p-4 rounded-xl border-2 mb-3 ${
        task.completed
          ? 'bg-green-50 border-green-200'
          : currentTaskIndex === index && sessionState === 'active'
          ? 'bg-blue-50 border-blue-500 shadow-lg'
          : 'bg-white border-gray-200'
      }`}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <View className={`w-3 h-3 rounded-full mr-2 ${getPriorityColor(task.priority)}`} />
            <Ionicons
              name={getCategoryIcon(task.category) as keyof typeof Ionicons.glyphMap}
              size={16}
              color="#6B7280"
            />
            <Text className="text-xs text-gray-500 ml-1 capitalize">
              {task.category}
            </Text>
          </View>
          <Text className={`font-semibold mb-1 ${task.completed ? 'text-green-700 line-through' : 'text-gray-900'}`}>
            {task.title}
          </Text>
          <Text className="text-gray-600 text-sm mb-2">
            {task.description}
          </Text>
          <Text className="text-xs text-gray-500">
            Est. {task.estimatedTime} min
          </Text>
        </View>
        <View className="ml-4">
          {task.completed ? (
            <View className="bg-green-500 rounded-full p-2">
              <Ionicons name="checkmark" size={20} color="white" />
            </View>
          ) : (
            <Pressable
              onPress={() => completeTask(task.id)}
              className="bg-blue-500 rounded-full p-2"
            >
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
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Flow Session
          </Text>
          <Text className="text-gray-600 mb-6">
            Enter your flow state and maximize productivity
          </Text>

          {tasks.length === 0 ? (
            <View className="bg-white rounded-xl p-8 items-center mb-6">
              <Ionicons name="list" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 text-center mt-4 mb-6">
                No tasks added yet. Add some tasks to start your flow session.
              </Text>
              <Pressable
                onPress={() => addTask({
                  title: 'Apply to Software Engineer Position',
                  description: 'Complete application for React Native position at TechCorp',
                  estimatedTime: 30,
                  priority: 'high',
                  category: 'application'
                })}
                className="bg-blue-500 px-6 py-3 rounded-lg"
              >
                <Text className="text-white font-semibold">Add Sample Task</Text>
              </Pressable>
            </View>
          ) : (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                Your Tasks ({tasks.length})
              </Text>
              {tasks.map((task, index) => renderTaskCard(task, index))}
            </View>
          )}

          {tasks.length > 0 && (
            <Pressable
              onPress={startSession}
              className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 items-center shadow-lg"
            >
              <View className="flex-row items-center">
                <Ionicons name="play" size={24} color="white" />
                <Text className="text-white font-bold text-lg ml-2">
                  Start Flow Session
                </Text>
              </View>
              <Text className="text-white/80 text-sm mt-1">
                Begin your focused work session
              </Text>
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
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-gray-900">
                Flow Session Active
              </Text>
              <View className="flex-row items-center">
                <View className={`w-3 h-3 rounded-full mr-2 ${sessionState === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <Text className="text-sm text-gray-600 capitalize">
                  {sessionState}
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="bg-gray-200 rounded-full h-2 mb-3">
              <View
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>
            <Text className="text-sm text-gray-600">
              Task {currentTaskIndex + 1} of {tasks.length} • {Math.round(progress)}% Complete
            </Text>
          </View>

          {/* Focus Level */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="font-semibold text-gray-900">Focus Level</Text>
              <Text className="text-lg font-bold text-blue-600">{focusLevel}%</Text>
            </View>
            <View className="bg-gray-200 rounded-full h-3">
              <View
                className={`h-3 rounded-full ${focusLevel > 70 ? 'bg-green-500' : focusLevel > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${focusLevel}%` }}
              />
            </View>
            <View className="flex-row items-center justify-between mt-3">
              <Text className="text-sm text-gray-600">
                Distractions: {distractions}
              </Text>
              <Pressable
                onPress={reportDistraction}
                className="bg-red-100 px-3 py-1 rounded-full"
              >
                <Text className="text-red-600 text-xs font-medium">
                  Report Distraction
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Current Task */}
          {currentTask && (
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Current Task
              </Text>
              {renderTaskCard(currentTask, currentTaskIndex)}
            </View>
          )}

          {/* Session Controls */}
          <View className="flex-row space-x-3 mb-6">
            {sessionState === 'active' ? (
              <Pressable
                onPress={pauseSession}
                className="flex-1 bg-yellow-500 rounded-xl p-4 items-center"
              >
                <Ionicons name="pause" size={24} color="white" />
                <Text className="text-white font-semibold mt-1">Pause</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={resumeSession}
                className="flex-1 bg-green-500 rounded-xl p-4 items-center"
              >
                <Ionicons name="play" size={24} color="white" />
                <Text className="text-white font-semibold mt-1">Resume</Text>
              </Pressable>
            )}

            <Pressable
              onPress={takeBreak}
              className="flex-1 bg-blue-500 rounded-xl p-4 items-center"
            >
              <Ionicons name="cafe" size={24} color="white" />
              <Text className="text-white font-semibold mt-1">Break</Text>
            </Pressable>

            <Pressable
              onPress={endSession}
              className="flex-1 bg-red-500 rounded-xl p-4 items-center"
            >
              <Ionicons name="stop" size={24} color="white" />
              <Text className="text-white font-semibold mt-1">End</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (sessionState === 'break') {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-4">
        <View className="bg-white rounded-2xl p-8 items-center shadow-lg">
          <Ionicons name="cafe" size={64} color="#3B82F6" />
          <Text className="text-2xl font-bold text-gray-900 mt-4 mb-2">
            Break Time
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Take a moment to recharge. Your focus will be refreshed when you return.
          </Text>
          <Pressable
            onPress={endBreak}
            className="bg-blue-500 px-8 py-4 rounded-xl"
          >
            <Text className="text-white font-semibold text-lg">
              Back to Work
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (sessionState === 'completed') {
    return (
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-4">
          <View className="bg-white rounded-2xl p-6 items-center shadow-lg mb-6">
            <Ionicons name="trophy" size={64} color="#10B981" />
            <Text className="text-2xl font-bold text-gray-900 mt-4 mb-2">
              Session Complete!
            </Text>
            <Text className="text-gray-600 text-center">
              Great work! You've completed your flow session.
            </Text>
          </View>

          {sessionData && (
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                Session Summary
              </Text>
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Tasks Completed</Text>
                  <Text className="font-semibold">{sessionData.completedTasks}/{tasks.length}</Text>
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
            className="bg-blue-500 rounded-xl p-4 items-center mt-6"
          >
            <Text className="text-white font-semibold text-lg">
              Start New Session
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return null;
};

export default FlowSession;
