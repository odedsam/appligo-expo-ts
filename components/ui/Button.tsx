import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof Feather.glyphMap;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  gradient?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  gradient = false,
}: ButtonProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 rounded-lg';
      case 'lg':
        return 'px-8 py-4 rounded-xl';
      default:
        return 'px-6 py-3 rounded-xl';
    }
  };

  const getTextSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm font-medium';
      case 'lg':
        return 'text-lg font-semibold';
      default:
        return 'text-base font-semibold';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'lg':
        return 24;
      default:
        return 20;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: gradient ? 'bg-transparent' : 'bg-blue-600',
          text: 'text-white',
          pressed: 'bg-blue-700',
        };
      case 'secondary':
        return {
          container: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-900 dark:text-gray-100',
          pressed: 'bg-gray-200 dark:bg-gray-700',
        };
      case 'outline':
        return {
          container: 'bg-transparent border-2 border-blue-600',
          text: 'text-blue-600',
          pressed: 'bg-blue-50',
        };
      case 'ghost':
        return {
          container: 'bg-transparent',
          text: 'text-blue-600',
          pressed: 'bg-blue-50',
        };
      case 'danger':
        return {
          container: 'bg-red-600',
          text: 'text-white',
          pressed: 'bg-red-700',
        };
      case 'success':
        return {
          container: 'bg-green-600',
          text: 'text-white',
          pressed: 'bg-green-700',
        };
      default:
        return {
          container: 'bg-blue-600',
          text: 'text-white',
          pressed: 'bg-blue-700',
        };
    }
  };

  const styles = getVariantStyles();
  const iconSize = getIconSize();
  const isDisabled = disabled || loading;

  const ButtonContent = () => (
    <View className="flex-row items-center justify-center">
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' || variant === 'success' ? 'white' : '#3b82f6'}
          className="mr-2"
        />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <Feather
          name={icon}
          size={iconSize}
          color={variant === 'primary' || variant === 'danger' || variant === 'success' ? 'white' : '#3b82f6'}
          style={{ marginRight: 8 }}
        />
      )}
      <Text className={`${getTextSizeClasses()} ${styles.text}`}>
        {title}
      </Text>
      {icon && iconPosition === 'right' && !loading && (
        <Feather
          name={icon}
          size={iconSize}
          color={variant === 'primary' || variant === 'danger' || variant === 'success' ? 'white' : '#3b82f6'}
          style={{ marginLeft: 8 }}
        />
      )}
    </View>
  );

  if (gradient && variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        className={`${getSizeClasses()} ${fullWidth ? 'w-full' : ''} ${isDisabled ? 'opacity-50' : 'active:scale-95'} ${className}`}
        style={{ elevation: isDisabled ? 0 : 4 }}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={`${getSizeClasses()} -m-0`}
        >
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`${getSizeClasses()} ${styles.container} ${fullWidth ? 'w-full' : ''} ${isDisabled ? 'opacity-50' : 'active:scale-95'} ${className}`}
      style={{ elevation: variant === 'primary' && !isDisabled ? 4 : 0 }}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
}
