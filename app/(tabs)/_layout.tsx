import { useColorScheme } from '@/components/useColorScheme';

import { Platform, View } from 'react-native';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';

const Colors = {
  light: {
    text: '#2D3748',
    background: '#F7FAFC',
    tint: '#667eea',
    tabIconDefault: '#A0AEC0',
    tabIconSelected: '#667eea',
    tabBarBackground: '#FFFFFF',
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
  },
  dark: {
    text: '#F7FAFC',
    background: '#1A202C',
    tint: '#9F7AEA',
    tabIconDefault: '#718096',
    tabIconSelected: '#9F7AEA',
    tabBarBackground: '#2D3748',
    gradientStart: '#9F7AEA',
    gradientEnd: '#667eea',
  },
};

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'] | React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
  focused: boolean;
  iconSet?: 'ionicons' | 'material';
}) {
  const IconComponent = props.iconSet === 'material' ? MaterialIcons : Ionicons;

  return (
    <View className="items-center justify-center">
      {props.focused && (
        <View className="absolute -top-1 h-1 w-8 rounded-full bg-current opacity-80" style={{ backgroundColor: props.color }} />
      )}
      <View className={`rounded-2xl p-2 ${props.focused ? 'bg-white/10' : ''}`}>
        <IconComponent
          size={24}
          name={props.name as any}
          color={props.color}
          style={{
            transform: [{ scale: props.focused ? 1.1 : 1 }],
            opacity: props.focused ? 1 : 0.8,
          }}
        />
      </View>
    </View>
  );
}

function CustomTabBarBackground({ colorScheme }: { colorScheme: 'light' | 'dark' }) {
  if (Platform.OS === 'ios') {
    return <BlurView intensity={100} tint={colorScheme} className="absolute inset-0" />;
  }

  return (
    <LinearGradient
      colors={
        colorScheme === 'dark'
          ? ['rgba(45, 55, 72, 0.95)', 'rgba(26, 32, 44, 0.98)']
          : ['rgba(255, 255, 255, 0.95)', 'rgba(247, 250, 252, 0.98)']
      }
      className="absolute inset-0"
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
          fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          height: 70,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          borderRadius: 25,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 15,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarBackground: () => <CustomTabBarBackground colorScheme={colorScheme ?? 'light'} />,
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      }}>
      <Tabs.Screen
        name="flow"
        options={{
          title: 'flow',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="water" color={color} focused={focused} />,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
        }}
      />

      <Tabs.Screen
        name="planner"
        options={{
          title: 'planner',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="calendar" color={color} focused={focused} />,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
        }}
      />

      <Tabs.Screen
        name="seed"
        options={{
          title: 'seed',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="eco" color={color} focused={focused} iconSet="material" />,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: 'stats',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="stats-chart" color={color} focused={focused} />,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
        }}
      />
    </Tabs>
  );
}
