import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface AIMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  typing?: boolean;
}

interface AIAssistantProps {
  onMessageSent?: (message: string) => void;
  onAssistantResponse?: (response: string) => void;
  isConnected?: boolean;
  userName?: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  prompt: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  onMessageSent,
  onAssistantResponse,
  isConnected = true,
  userName = 'User',
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      content: `Hello ${userName}! I'm your AI assistant. I can help you with productivity tips, time management, goal setting, and answer any questions you have. How can I assist you today?`,
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Productivity Tips',
      description: 'Get personalized productivity advice',
      icon: 'bulb',
      color: 'from-yellow-400 to-orange-500',
      prompt: 'Give me 3 personalized productivity tips for today',
    },
    {
      id: '2',
      title: 'Focus Session',
      description: 'Plan your next focus session',
      icon: 'target',
      color: 'from-blue-400 to-purple-500',
      prompt: 'Help me plan an effective focus session. What should I work on?',
    },
    {
      id: '3',
      title: 'Goal Setting',
      description: 'Set and track your goals',
      icon: 'trophy',
      color: 'from-green-400 to-teal-500',
      prompt: 'Help me set SMART goals for this week',
    },
    {
      id: '4',
      title: 'Time Management',
      description: 'Optimize your schedule',
      icon: 'time',
      color: 'from-pink-400 to-red-500',
      prompt: 'Analyze my schedule and suggest time management improvements',
    },
  ];

  useEffect(() => {
    // Pulse animation for typing indicator
    if (isTyping) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.6,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isTyping]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

    // Simple response logic - in a real app, this would call your AI service
    const responses = {
      greeting: [
        "Hello! I'm here to help you boost your productivity and achieve your goals. What would you like to work on today?",
        "Hi there! Ready to make today productive? I can help with time management, goal setting, or any questions you have.",
      ],
      productivity: [
        "Here are some proven productivity strategies:\n\n1. **Time Blocking**: Schedule specific blocks for different tasks\n2. **2-Minute Rule**: If it takes less than 2 minutes, do it now\n3. **Energy Management**: Match high-energy tasks with your peak hours\n\nWhich of these resonates with you?",
        "Great question! Try the Pomodoro Technique: 25 minutes focused work, 5-minute break. Also, prioritize tasks using the Eisenhower Matrix (urgent vs important). What's your biggest productivity challenge?",
      ],
      focus: [
        "For better focus sessions:\n\n• **Environment**: Clean, distraction-free space\n• **Single-tasking**: One task at a time\n• **Digital minimalism**: Turn off notifications\n• **Clear objectives**: Define what 'done' looks like\n\nWhat type of work will you focus on?",
        "Focus is like a muscle - it gets stronger with practice! Start with shorter sessions (15-20 min) and gradually increase. Remove distractions, set clear goals, and take regular breaks. What's pulling your attention away?",
      ],
      goals: [
        "Let's create SMART goals:\n\n**S**pecific - Clear and well-defined\n**M**easurable - Track progress\n**A**chievable - Realistic\n**R**elevant - Aligned with values\n**T**ime-bound - Have deadlines\n\nWhat area of your life would you like to set goals for?",
        "Goal setting is powerful! Break big goals into smaller milestones, track progress weekly, and celebrate wins. What's one goal you're excited about achieving?",
      ],
      time: [
        "Time management tips:\n\n1. **Audit your time** - Track how you spend it for a week\n2. **Batch similar tasks** - Group emails, calls, etc.\n3. **Use the 80/20 rule** - Focus on high-impact activities\n4. **Say no strategically** - Protect your priorities\n\nWhat's your biggest time challenge?",
        "Time is our most valuable resource! Try time-blocking your calendar, batching similar tasks, and using the 'two-minute rule'. What activities consume most of your time?",
      ],
      default: [
        "That's an interesting point! I'd love to help you explore that further. Can you tell me more about what specifically you'd like assistance with?",
        "I'm here to support your productivity journey! Whether it's time management, goal setting, or just staying motivated - what can I help you with?",
        "Great question! I can help you with productivity strategies, time management, goal setting, and motivation. What's on your mind?",
      ],
    };

    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    } else if (lowerMessage.includes('productiv') || lowerMessage.includes('tip')) {
      return responses.productivity[Math.floor(Math.random() * responses.productivity.length)];
    } else if (lowerMessage.includes('focus') || lowerMessage.includes('concentrat')) {
      return responses.focus[Math.floor(Math.random() * responses.focus.length)];
    } else if (lowerMessage.includes('goal') || lowerMessage.includes('target')) {
      return responses.goals[Math.floor(Math.random() * responses.goals.length)];
    } else if (lowerMessage.includes('time') || lowerMessage.includes('schedul') || lowerMessage.includes('manag')) {
      return responses.time[Math.floor(Math.random() * responses.time.length)];
    } else {
      return responses.default[Math.floor(Math.random() * responses.default.length)];
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !isConnected) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      content: text.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setShowQuickActions(false);
    setIsTyping(true);
    onMessageSent?.(text.trim());

    try {
      const response = await simulateAIResponse(text.trim());

      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      onAssistantResponse?.(response);
    } catch (error) {
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    sendMessage(action.prompt);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        className="px-6 py-4 pb-6"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
              <Ionicons name="sparkles" size={20} color="white" />
            </View>
            <View>
              <Text className="text-white font-bold text-lg">AI Assistant</Text>
              <View className="flex-row items-center">
                <View className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                <Text className="text-white/80 text-sm">
                  {isConnected ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={() => {
              Alert.alert(
                'Clear Chat',
                'Are you sure you want to clear the conversation?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => {
                      setMessages([messages[0]]); // Keep welcome message
                      setShowQuickActions(true);
                    },
                  },
                ]
              );
            }}
            className="p-2 rounded-full bg-white/20"
          >
            <Ionicons name="refresh" size={20} color="white" />
          </Pressable>
        </View>
      </LinearGradient>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            className={`mb-4 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <View
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-500 rounded-br-md'
                  : 'bg-white rounded-bl-md shadow-sm border border-gray-100'
              }`}
            >
              <Text className={`${message.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                {message.content}
              </Text>
            </View>
            <Text className="text-xs text-gray-500 mt-1 mx-2">
              {formatTime(message.timestamp)}
            </Text>
          </View>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <View className="items-start mb-4">
            <Animated.View
              style={{ opacity: pulseAnim }}
              className="bg-white p-4 rounded-2xl rounded-bl-md shadow-sm border border-gray-100"
            >
              <View className="flex-row items-center">
                <View className="flex-row space-x-1">
                  <View className="w-2 h-2 bg-gray-400 rounded-full" />
                  <View className="w-2 h-2 bg-gray-400 rounded-full" />
                  <View className="w-2 h-2 bg-gray-400 rounded-full" />
                </View>
                <Text className="text-gray-500 text-sm ml-2">AI is thinking...</Text>
              </View>
            </Animated.View>
          </View>
        )}

        {/* Quick Actions */}
        {showQuickActions && messages.length === 1 && (
          <View className="mb-6">
            <Text className="text-gray-600 font-medium mb-3 px-2">Quick Actions</Text>
            <View className="space-y-3">
              {quickActions.map((action) => (
                <Pressable
                  key={action.id}
                  onPress={() => handleQuickAction(action)}
                  className="overflow-hidden rounded-xl"
                >
                  <LinearGradient
                    colors={action.color.includes('yellow') ? ['#FCD34D', '#F59E0B'] :
                           action.color.includes('blue') ? ['#60A5FA', '#8B5CF6'] :
                           action.color.includes('green') ? ['#34D399', '#14B8A6'] :
                           ['#F472B6', '#EF4444']}
                    className="p-4 flex-row items-center"
                  >
                    <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
                      <Ionicons name={action.icon} size={20} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-semibold">{action.title}</Text>
                      <Text className="text-white/80 text-sm">{action.description}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="white" />
                  </LinearGradient>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View className="px-4 pb-4 bg-white border-t border-gray-200">
        <View className="flex-row items-end space-x-3 py-3">
          <View className="flex-1 min-h-[44px] max-h-32 bg-gray-100 rounded-2xl px-4 py-3">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder={isConnected ? "Ask me anything..." : "AI is offline"}
              placeholderTextColor="#9CA3AF"
              multiline
              className="text-gray-800 text-base"
              editable={isConnected}
              onSubmitEditing={() => {
                if (inputText.trim()) {
                  sendMessage(inputText);
                }
              }}
            />
          </View>

          <Pressable
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || !isConnected || isTyping}
            className={`w-11 h-11 rounded-full items-center justify-center ${
              inputText.trim() && isConnected && !isTyping
                ? 'bg-blue-500'
                : 'bg-gray-300'
            }`}
          >
            <Ionicons
              name="send"
              size={18}
              color={inputText.trim() && isConnected && !isTyping ? 'white' : '#9CA3AF'}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AIAssistant;
