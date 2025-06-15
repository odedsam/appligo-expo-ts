import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  category?: 'productivity' | 'motivation' | 'planning' | 'general';
  metadata?: {
    tokens?: number;
    responseTime?: number;
    confidence?: number;
  };
}

interface AIChatProps {
  initialMessages?: ChatMessage[];
  onNewMessage?: (message: ChatMessage) => void;
  onChatExport?: (messages: ChatMessage[]) => void;
  maxMessages?: number;
  enableVoice?: boolean;
  theme?: 'light' | 'dark';
}

interface ChatSuggestion {
  id: string;
  text: string;
  category: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const AIChat: React.FC<AIChatProps> = ({
  initialMessages = [],
  onNewMessage,
  onChatExport,
  maxMessages = 100,
  enableVoice = false,
  theme = 'light',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const suggestions: ChatSuggestion[] = [
    {
      id: '1',
      text: 'How can I improve my daily routine?',
      category: 'productivity',
      icon: 'checkmark-circle',
    },
    {
      id: '2',
      text: 'Help me set goals for this month',
      category: 'planning',
      icon: 'calendar',
    },
    {
      id: '3',
      text: 'I need motivation to stay focused',
      category: 'motivation',
      icon: 'flame',
    },
    {
      id: '4',
      text: 'What are some effective study techniques?',
      category: 'productivity',
      icon: 'book',
    },
    {
      id: '5',
      text: 'How do I overcome procrastination?',
      category: 'motivation',
      icon: 'trending-up',
    },
    {
      id: '6',
      text: 'Create a weekly schedule template',
      category: 'planning',
      icon: 'grid',
    },
  ];

  const categories = [
    { id: 'all', name: 'All', icon: 'apps' as keyof typeof Ionicons.glyphMap },
    { id: 'productivity', name: 'Productivity', icon: 'flash' as keyof typeof Ionicons.glyphMap },
    { id: 'planning', name: 'Planning', icon: 'calendar' as keyof typeof Ionicons.glyphMap },
    { id: 'motivation', name: 'Motivation', icon: 'heart' as keyof typeof Ionicons.glyphMap },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const generateAIResponse = async (userMessage: string): Promise<ChatMessage> => {
    // Simulate AI processing
    const processingTime = 1000 + Math.random() * 2000;
    await new Promise(resolve => setTimeout(resolve, processingTime));

    const responses = {
      routine: [
        "Creating a solid daily routine is key to productivity! Here's a framework:\n\n🌅 **Morning**: Wake up same time, exercise, healthy breakfast\n📋 **Planning**: Review priorities, time-block your day\n⚡ **Energy Management**: Tackle important tasks during peak hours\n🌙 **Evening**: Reflect, prepare for tomorrow, wind down\n\nWhat part of your routine needs the most work?",
        "Great question about routines! Try the 'Rule of 3' - pick 3 key things each day. Also, batch similar tasks together and use transition rituals between activities. Small, consistent habits compound over time. What's your current morning routine like?",
      ],
      goals: [
        "Let's create meaningful goals using the SMART framework:\n\n✅ **Specific**: What exactly do you want to achieve?\n📊 **Measurable**: How will you track progress?\n🎯 **Achievable**: Is it realistic given your resources?\n💡 **Relevant**: Does it align with your values?\n⏰ **Time-bound**: When will you complete it?\n\nWhat area of your life would you like to set goals for?",
        "Goal setting is powerful! Break big goals into smaller milestones, create accountability systems, and celebrate progress. The key is consistency over perfection. What's one goal you're excited about achieving this month?",
      ],
      motivation: [
        "Staying motivated can be challenging! Here are proven strategies:\n\n🔥 **Find Your Why**: Connect tasks to deeper values\n🏆 **Small Wins**: Celebrate micro-achievements\n👥 **Accountability**: Share goals with others\n📈 **Progress Tracking**: Visualize your growth\n🎵 **Environment**: Create inspiring surroundings\n\nWhat usually drains your motivation?",
        "Motivation comes and goes - discipline and systems are what sustain us! Start with tiny habits, remove friction for good behaviors, and create positive feedback loops. What's one small action you can take right now?",
      ],
      study: [
        "Effective study techniques backed by science:\n\n🧠 **Active Recall**: Test yourself instead of re-reading\n📚 **Spaced Repetition**: Review material at increasing intervals\n🎯 **Pomodoro Technique**: 25 min focus, 5 min break\n📝 **Feynman Method**: Explain concepts simply\n🔄 **Interleaving**: Mix different topics/subjects\n\nWhich subject are you studying?",
        "Great study habits make all the difference! Try the 'Elaborative Interrogation' - ask yourself 'why' and 'how' questions. Also, teach others what you learn and use multiple senses when studying. What's your biggest study challenge?",
      ],
      procrastination: [
        "Procrastination is often about emotions, not time management:\n\n😰 **Fear of failure**: Start with imperfect action\n😵 **Overwhelm**: Break tasks into tiny steps\n😴 **Lack of energy**: Match tasks to energy levels\n🎯 **Unclear goals**: Define specific outcomes\n⏰ **Time blocking**: Schedule when you'll do it\n\nWhat type of tasks do you procrastinate on most?",
        "The 2-minute rule works wonders: if it takes less than 2 minutes, do it now! For bigger tasks, commit to just 5 minutes - often you'll keep going. Remove friction and make starting easier than avoiding. What's one task you've been putting off?",
      ],
      schedule: [
        "Here's a balanced weekly schedule template:\n\n**Monday-Friday:**\n• 6:00-7:00 AM: Morning routine\n• 7:00-9:00 AM: Deep work block\n• 9:00-12:00 PM: Meetings/collaboration\n• 1:00-3:00 PM: Focused tasks\n• 3:00-5:00 PM: Admin/emails\n• Evening: Personal time\n\n**Weekend:**\n• Longer projects, rest, planning\n\nWhat's your ideal wake-up time?",
        "Time blocking is a game-changer! Assign specific times for different activities, include buffer time, batch similar tasks, and protect your peak energy hours for important work. Would you like help customizing this for your specific situation?",
      ],
      default: [
        "That's an interesting question! I'm here to help you with productivity, motivation, goal setting, and personal development. Could you tell me more about what specifically you'd like assistance with?",
        "I'd love to help you with that! Whether it's about productivity strategies, time management, motivation, or achieving your goals - I'm here to support you. What's on your mind?",
      ],
    };

    const lowerMessage = userMessage.toLowerCase();
    let responseArray = responses.default;
    let category: ChatMessage['category'] = 'general';

    if (lowerMessage.includes('routine') || lowerMessage.includes('habit')) {
      responseArray = responses.routine;
      category = 'productivity';
    } else if (lowerMessage.includes('goal') || lowerMessage.includes('target') || lowerMessage.includes('plan')) {
      responseArray = responses.goals;
      category = 'planning';
    } else if (lowerMessage.includes('motivat') || lowerMessage.includes('inspir') || lowerMessage.includes('focus')) {
      responseArray = responses.motivation;
      category = 'motivation';
    } else if (lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('technique')) {
      responseArray = responses.study;
      category = 'productivity';
    } else if (lowerMessage.includes('procrastinat') || lowerMessage.includes('delay') || lowerMessage.includes('avoid')) {
      responseArray = responses.procrastination;
      category = 'motivation';
    } else if (lowerMessage.includes('schedule') || lowerMessage.includes('time') || lowerMessage.includes('calendar')) {
      responseArray = responses.schedule;
      category = 'planning';
    }

    const response = responseArray[Math.floor(Math.random() * responseArray.length)];

    return {
      id: `ai-${Date.now()}`,
      content: response,
      role: 'assistant',
      timestamp: new Date(),
      category,
      metadata: {
        responseTime: processingTime,
        confidence: 0.8 + Math.random() * 0.2,
        tokens: response.length / 4, // Rough token estimate
      },
    };
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Create user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: text.trim(),
      role: 'user',
      timestamp: new Date(),
      category: 'general',
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setShowSuggestions(false);
    setIsLoading(true);
    onNewMessage?.(userMessage);

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(text.trim());

      // Add AI response to chat
      setMessages(prev => {
        const updated = [...prev, aiResponse];
        // Limit messages if maxMessages is set
        if (updated.length > maxMessages) {
          return updated.slice(-maxMessages);
        }
        return updated;
      });

      onNewMessage?.(aiResponse);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: "I apologize, but I'm having trouble processing your request. Please try again.",
        role: 'assistant',
        timestamp: new Date(),
        category: 'general',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionPress = (suggestion: ChatSuggestion) => {
    sendMessage(suggestion.text);
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setMessages([]);
            setShowSuggestions(true);
          }
        },
      ]
    );
  };

  const exportChat = () => {
    if (messages.length === 0) {
      Alert.alert('No Messages', 'There are no messages to export.');
      return;
    }
    onChatExport?.(messages);
    Alert.alert('Chat Exported', 'Your chat history has been exported successfully.');
  };

  const filteredSuggestions = selectedCategory === 'all'
    ? suggestions
    : suggestions.filter(s => s.category === selectedCategory);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCategoryColor = (category?: string): string => {
    switch (category) {
      case 'productivity': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-green-100 text-green-800';
      case 'motivation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isDarkMode = theme === 'dark';
  const themeStyles = {
    container: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    header: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    headerText: isDarkMode ? 'text-white' : 'text-gray-900',
    chatBubbleUser: isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white',
    chatBubbleAI: isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800',
    chatTimestamp: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    inputArea: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    textInput: isDarkMode ? 'text-white' : 'text-gray-800',
    sendButton: isLoading ? 'bg-blue-300' : 'bg-blue-500',
    suggestionButton: isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200',
    suggestionButtonActive: 'bg-blue-500 text-white border-blue-500',
    categoryChip: isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700',
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className={`flex-1 ${themeStyles.container}`}
    >
      {/* Header */}
      <View className={`pt-12 pb-4 px-4 flex-row items-center justify-between ${themeStyles.header} border-b`}>
        <Text className={`text-2xl font-bold ${themeStyles.headerText}`}>AI Chat</Text>
        <View className="flex-row">
          <Pressable onPress={exportChat} className="p-2">
            <Ionicons name="share-outline" size={24} color={isDarkMode ? 'white' : 'gray'} />
          </Pressable>
          <Pressable onPress={clearChat} className="p-2 ml-2">
            <Ionicons name="trash-outline" size={24} color={isDarkMode ? 'white' : 'gray'} />
          </Pressable>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            className={`flex-row items-end mb-4 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <View
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? themeStyles.chatBubbleUser + ' rounded-br-none'
                  : themeStyles.chatBubbleAI + ' rounded-bl-none border border-gray-200'
              }`}
            >
              <Text className={message.role === 'user' ? 'text-white' : themeStyles.textInput}>
                {message.content}
              </Text>
              <View className="flex-row items-center justify-end mt-1">
                {message.category && message.category !== 'general' && (
                  <View className={`px-2 py-0.5 rounded-full mr-2 ${getCategoryColor(message.category)}`}>
                    <Text className="text-xs font-medium">{message.category}</Text>
                  </View>
                )}
                <Text className={`text-xs ${themeStyles.chatTimestamp}`}>
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            </View>
          </View>
        ))}
        {isLoading && (
          <View className="flex-row items-center justify-start mb-4">
            <View className={`max-w-[80%] p-3 rounded-lg ${themeStyles.chatBubbleAI} rounded-bl-none border border-gray-200`}>
              <ActivityIndicator size="small" color={isDarkMode ? 'white' : 'gray'} />
              <Text className={`mt-1 text-xs ${themeStyles.chatTimestamp}`}>Typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Suggestions and Input */}
      <View className={`border-t ${themeStyles.inputArea} p-4`}>
        {showSuggestions && messages.length === 0 && (
          <View className="mb-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
              {categories.map(cat => (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  className={`flex-row items-center px-4 py-2 rounded-full mr-2 border ${
                    selectedCategory === cat.id
                      ? themeStyles.suggestionButtonActive
                      : themeStyles.suggestionButton
                  }`}
                >
                  <Ionicons name={cat.icon} size={16} color={selectedCategory === cat.id ? 'white' : (isDarkMode ? 'gray' : 'gray')} />
                  <Text className={`ml-2 font-medium ${selectedCategory === cat.id ? 'text-white' : (isDarkMode ? 'text-gray-200' : 'text-gray-700')}`}>
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <View className="flex-row flex-wrap justify-center">
              {filteredSuggestions.map((suggestion) => (
                <Pressable
                  key={suggestion.id}
                  onPress={() => handleSuggestionPress(suggestion)}
                  className={`flex-row items-center px-4 py-2 rounded-full m-1 border ${themeStyles.suggestionButton}`}
                >
                  <Ionicons name={suggestion.icon} size={16} color={isDarkMode ? 'gray' : 'gray'} />
                  <Text className={`ml-2 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {suggestion.text}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <View className="flex-row items-center">
          {enableVoice && (
            <Pressable
              onPress={() => Alert.alert('Voice input', 'Voice input is not yet implemented.')}
              className="p-3 rounded-full bg-red-500 mr-2"
            >
              <Ionicons name="mic" size={24} color="white" />
            </Pressable>
          )}
          <TextInput
            ref={inputRef}
            className={`flex-1 border rounded-full py-3 px-4 ${themeStyles.textInput} ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
            placeholder="Type your message..."
            placeholderTextColor={isDarkMode ? '#A0AEC0' : '#718096'}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => sendMessage(inputText)}
            returnKeyType="send"
            blurOnSubmit={false}
            editable={!isLoading}
          />
          <Pressable
            onPress={() => sendMessage(inputText)}
            className={`ml-2 p-3 rounded-full ${themeStyles.sendButton}`}
            disabled={isLoading || !inputText.trim()}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Ionicons name="send" size={24} color="white" />
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AIChat;
