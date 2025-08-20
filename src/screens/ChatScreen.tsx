// ChatScreen.tsx
import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';

interface ChatScreenProps {
    navigation: any;
    route: any;
}

const ChatScreen: React.FC<ChatScreenProps> = () => {
    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center">
            <View>
                <Text className="text-lg text-gray-500">Chat screen </Text>
            </View>
        </SafeAreaView>
    );
};

export default ChatScreen;
