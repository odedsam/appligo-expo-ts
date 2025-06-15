import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'glass' | 'elevated' | 'outline' | 'dark';
  onPress?: () => void;
  className?: string;
  style?: ViewStyle;
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shadow?: boolean;
  glow?: boolean;
}

export default function Card({
  children,
  variant = 'default',
  onPress,
  className = '',
  style,
  padding = 'md',
  rounded = 'xl',
  shadow = false,
  glow = false,
}: CardProps) {
  const getPaddingClasses = () => {
    switch (padding) {
      case 'sm':
        return 'p-3';
      case 'lg':
        return 'p-6';
      case 'xl':
        return 'p-8';
      case 'none':
        return '';
      default:
        return 'p-4';
    }
  };

  const getRoundedClasses = () => {
    switch (rounded) {
      case 'sm':
        return 'rounded-lg';
      case 'md':
        return 'rounded-xl';
      case 'lg':
        return 'rounded-2xl';
      case '2xl':
        return 'rounded-3xl';
      default:
        return 'rounded-xl';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-transparent';
      case 'glass':
        return 'bg-white/10 backdrop-blur-xl border border-white/20';
      case 'elevated':
        return 'bg-white dark:bg-gray-900';
      case 'outline':
        return 'bg-transparent border-2 border-gray-200 dark:border-gray-700';
      case 'dark':
        return 'bg-gray-900 dark:bg-black';
      default:
        return 'bg-white dark:bg-gray-800';
    }
  };

  const getShadowStyle = () => {
    if (!shadow && variant !== 'elevated') return {};

    return {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: variant === 'elevated' ? 8 : 4,
      },
      shadowOpacity: variant === 'elevated' ? 0.15 : 0.1,
      shadowRadius: variant === 'elevated' ? 12 : 8,
      elevation: variant === 'elevated' ? 8 : 4,
    };
  };

  const getGlowStyle = () => {
    if (!glow) return {};

    return {
      shadowColor: '#667eea',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 0,
    };
  };

  const baseClasses = `${getPaddingClasses()} ${getRoundedClasses()} ${getVariantClasses()} ${className}`;
  const combinedStyle = { ...getShadowStyle(), ...getGlowStyle(), ...style };

  const CardContent = () => (
    <View className={baseClasses} style={combinedStyle}>
      {children}
    </View>
  );

  const GradientCard = () => (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={baseClasses}
      style={combinedStyle}
    >
      {children}
    </LinearGradient>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        className="active:scale-98"
      >
        {variant === 'gradient' ? <GradientCard /> : <CardContent />}
      </TouchableOpacity>
    );
  }

  return variant === 'gradient' ? <GradientCard /> : <CardContent />;
}

// Additional Card variants for specific use cases
export function StatsCard({ children, className = '', ...props }: Omit<CardProps, 'variant'>) {
  return (
    <Card
      variant="glass"
      className={`border border-blue-500/20 ${className}`}
      glow
      {...props}
    >
      {children}
    </Card>
  );
}

export function FeatureCard({ children, className = '', ...props }: Omit<CardProps, 'variant'>) {
  return (
    <Card
      variant="elevated"
      className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 ${className}`}
      {...props}
    >
      {children}
    </Card>
  );
}

export function ActionCard({ children, className = '', ...props }: CardProps) {
  return (
    <Card
      variant="outline"
      className={`border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors ${className}`}
      {...props}
    >
      {children}
    </Card>
  );
}
