import React from 'react';
import { ActivityIndicator } from 'react-native';
import { View, Text } from './styled';

interface LoadingProps {
  message?: string;
}

const Loading = ({ message = 'Loading...' }: LoadingProps) => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#4f46e5" />
      <Text className="text-gray-600 mt-4">{message}</Text>
    </View>
  );
};

export default Loading;