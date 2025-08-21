import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { COLORS } from '../constants';

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Loading...' }) => {
  return (
    <View className="absolute inset-0 bg-white justify-center items-center z-50">
      <View className="items-center">
        <ActivityIndicator size="large" color={COLORS.primaryGreen} />
        <Text className="text-gray-600 mt-4 text-lg font-medium">{message}</Text>
      </View>
    </View>
  );
};

export default LoadingOverlay;
