// ChatScreen.tsx
import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';

interface StorageScreenProps {
  navigation: any;
  route: any;
}

const StorageScreen: React.FC<StorageScreenProps> = () => {
  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center">
      <View>
        <Text className="text-lg text-gray-500">Storage screen </Text>
      </View>
    </SafeAreaView>
  );
};

export default StorageScreen;
