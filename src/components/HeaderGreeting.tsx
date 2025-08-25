import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IMAGES } from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants';
import { useAuthStore } from '../stores/authStore';

type Props = {
    subtitle?: string;
    onBellPress?: () => void;
    avatarUri?: string;
};

const HeaderGreeting: React.FC<Props> = ({
    subtitle = 'Hello, Welcome 👋',
    onBellPress,
}) => {
    const { user } = useAuthStore();
    const navigation = useNavigation<any>();

    // Debug logging
    console.log('HeaderGreeting - User:', user);
    console.log('HeaderGreeting - User picture:', user?.picture);
    console.log('HeaderGreeting - User username:', user?.username);

    const handleBellPress = () => {
        if (onBellPress) {
            // If parent provides custom bell press handler, use it
            onBellPress();
        } else {
            // Default behavior: navigate to notifications
            navigation.navigate('Notifications');
        }
    };

    return (
        <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center gap-3">
                <Image
                    source={
                        user?.picture && user.picture.trim() !== ''
                            ? { uri: user.picture }
                            : IMAGES.avatarPlaceholder
                    }
                    style={{ width: 66, height: 55, borderRadius: 44 }}
                    resizeMode="cover"
                    onError={() => console.log('Erreur de chargement de l\'avatar')}
                />
                <View >
                    <Text className="text-gray text-sm font-poppins-regular">{subtitle}</Text>
                    <Text className="text-lg font-poppins-bold">{user?.username}</Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={handleBellPress}
                className="w-30 h-30 rounded-full items-center justify-center"

            >
                <Ionicons name="notifications-circle" size={42} color={COLORS.primaryGreen} />
            </TouchableOpacity>
        </View>
    );
};

export default HeaderGreeting;
