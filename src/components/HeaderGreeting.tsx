import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { IMAGES } from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants';
import { useAuthStore } from '../stores/authStore';

type Props = {
    name: string;
    subtitle?: string;
    onBellPress?: () => void;
    avatarUri?: string;
};

const HeaderGreeting: React.FC<Props> = ({
    subtitle = 'Hello, Welcome 👋',
    onBellPress,
}) => {
    const { user } = useAuthStore();
    return (
        <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center gap-3">
                <Image
                    source={
                        IMAGES.avatarPlaceholder
                    }
                    className="w-22 h-22 rounded-full"
                    onError={() => console.log('Erreur de chargement de l\'avatar')}
                />
                <View >
                    <Text className="text-gray text-sm font-poppins-regular">{subtitle}</Text>
                    <Text className="text-lg font-poppins-bold">{user?.username}</Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={onBellPress}
                className="w-30 h-30 rounded-full items-center justify-center"

            >
                <Ionicons name="notifications-circle" size={42} color={COLORS.primaryGreen} />
            </TouchableOpacity>
        </View>
    );
};

export default HeaderGreeting;
