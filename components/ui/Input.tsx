import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  leftIcon?: keyof typeof Feather.glyphMap;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightIconPress?: () => void;
  error?: string;
  success?: string;
  variant?: 'default' | 'outline' | 'filled' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  type?: 'text' | 'password' | 'email' | 'numeric';
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  showCharCount?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  error,
  success,
  variant = 'default',
  size = 'md',
  type = 'text',
  required = false,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  showCharCount = false,
  autoFocus = false,
  className = '',
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-10 px-3 text-sm';
      case 'lg':
        return 'h-14 px-4 text-lg';
      default:
        return 'h-12 px-4 text-base';
    }
  };

  const getVariantClasses = () => {
    const baseClasses = 'rounded-xl border-2';

    switch (variant) {
      case 'outline':
        return `${baseClasses} bg-transparent border-gray-300 dark:border-gray-600`;
      case 'filled':
        return `${baseClasses} bg-gray-100 dark:bg-gray-800 border-transparent`;
      case 'glass':
        return `${baseClasses} bg-white/10 backdrop-blur-xl border-white/20`;
      default:
        return `${baseClasses} bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700`;
    }
  };

  const getStateClasses = () => {
    if (error) {
      return 'border-red-500 focus:border-red-600';
    }
    if (success) {
      return 'border-green-500 focus:border-green-600';
    }
    if (isFocused) {
      return 'border-blue-500 focus:border-blue-600';
    }
    return 'focus:border-blue-500';
  };

  const getInputType = () => {
    switch (type) {
      case 'email':
        return { keyboardType: 'email-address' as const, autoCapitalize: 'none' as const };
      case 'numeric':
        return { keyboardType: 'numeric' as const };
      case 'password':
        return { secureTextEntry: !showPassword, autoCapitalize: 'none' as const };
      default:
        return {};
    }
  };

  const inputClasses = `${getSizeClasses()} ${getVariantClasses()} ${getStateClasses()} ${disabled ? 'opacity-50' : ''} ${className}`;

  return (
    <View className="w-full">
      {/* Label */}
      {label && (
        <View className="flex-row items-center mb-2">
          <Text className="text-base font-medium text-gray-900 dark:text-gray-100">
            {label}
          </Text>
          {required && (
            <Text className="text-red-500 ml-1">*</Text>
          )}
        </View>
      )}

      {/* Input Container */}
      <View className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            <Feather
              name={leftIcon}
              size={20}
              color={error ? '#ef4444' : success ? '#10b981' : isFocused ? '#3b82f6' : '#6b7280'}
            />
          </View>
        )}

        {/* Input */}
        <TextInput
          className={`${inputClasses} ${leftIcon ? 'pl-12' : ''} ${rightIcon || type === 'password' ? 'pr-12' : ''} text-gray-900 dark:text-gray-100`}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          autoFocus={autoFocus}
          {...getInputType()}
          {...props}
        />

        {/* Right Icon */}
        {(rightIcon || type === 'password') && (
          <TouchableOpacity
            onPress={type === 'password' ? () => setShowPassword(!showPassword) : onRightIconPress}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
            disabled={disabled}
          >
            <Feather
              name={
                type === 'password'
                  ? (showPassword ? 'eye-off' : 'eye')
                  : rightIcon || 'help-circle'
              }
              size={20}
              color={error ? '#ef4444' : success ? '#10b981' : isFocused ? '#3b82f6' : '#6b7280'}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Helper Text */}
      <View className="mt-2 flex-row justify-between items-center">
        <View className="flex-1">
          {error && (
            <View className="flex-row items-center">
              <Feather name="alert-circle" size={16} color="#ef4444" />
              <Text className="text-red-500 text-sm ml-1">{error}</Text>
            </View>
          )}
          {success && !error && (
            <View className="flex-row items-center">
              <Feather name="check-circle" size={16} color="#10b981" />
              <Text className="text-green-500 text-sm ml-1">{success}</Text>
            </View>
          )}
        </View>

        {/* Character Count */}
        {showCharCount && maxLength && (
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
}

// Specialized Input Components
export function SearchInput({
  placeholder = "Search...",
  onSearch,
  ...props
}: Omit<InputProps, 'leftIcon' | 'rightIcon'> & { onSearch?: (text: string) => void }) {
  return (
    <Input
      placeholder={placeholder}
      leftIcon="search"
      rightIcon={props.value ? "x" : undefined}
      onRightIconPress={() => props.onChangeText('')}
      {...props}
    />
  );
}

export function NumberInput({
  min,
  max,
  step = 1,
  ...props
}: InputProps & { min?: number; max?: number; step?: number }) {
  const handleIncrement = () => {
    const currentValue = parseInt(props.value) || 0;
    const newValue = Math.min(currentValue + step, max || Infinity);
    props.onChangeText(newValue.toString());
  };

  const handleDecrement = () => {
    const currentValue = parseInt(props.value) || 0;
    const newValue = Math.max(currentValue - step, min || -Infinity);
    props.onChangeText(newValue.toString());
  };

  return (
    <View className="flex-row items-center space-x-2">
      <TouchableOpacity
        onPress={handleDecrement}
        className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg items-center justify-center"
      >
        <Feather name="minus" size={16} color="#6b7280" />
      </TouchableOpacity>

      <View className="flex-1">
        <Input
          type="numeric"
          textAlign="center"
          {...props}
        />
      </View>

      <TouchableOpacity
        onPress={handleIncrement}
        className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg items-center justify-center"
      >
        <Feather name="plus" size={16} color="#6b7280" />
      </TouchableOpacity>
    </View>
  );
}
