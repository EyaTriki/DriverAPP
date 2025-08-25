import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

export interface NotificationItemProps {
    id: string;
    isRead: boolean;
    message: string;
    senderName: string;
    timestamp: string;
    icon?: React.ReactNode;
    onPress?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    isRead,
    message,
    senderName,
    timestamp,
    icon,
    onPress,
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            className="flex-row items-start py-4  border-gray-100"
        >
            {/* Read/Unread indicator */}
            <View
                className={`w-2 h-2 rounded-full mt-2 mr-2 ml-4 ${isRead ? 'bg-white' : 'bg-blue-400'
                    }`}
            />

            {/* Icon */}
            <View className="w-10 h-10 rounded-full bg-primaryGreen items-center justify-center mr-3 mt-1">
                {icon || (
                    <Image
                        source={require('../assets/images/logo-white.png')}
                        className="w-8 h-8"
                        resizeMode="contain"
                    />
                )}
            </View>

            {/* Content */}
            <View className="flex-1">
                {/* Message */}
                <Text
                    style={[
                        TYPOGRAPHY.bodyMedium,
                        { color: COLORS.black, lineHeight: 20 }
                    ]}
                    numberOfLines={2}
                >
                    {message}
                </Text>

                {/* Sender name */}
                <Text
                    style={[
                        TYPOGRAPHY.subtitleMedium,
                        { color: COLORS.black, fontWeight: '600', marginTop: 2 }
                    ]}
                >
                    {senderName}
                </Text>

                {/* Timestamp */}
                <Text
                    style={[
                        TYPOGRAPHY.captionMedium,
                        { color: COLORS.gray, marginTop: 2 }
                    ]}
                >
                    {timestamp}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default NotificationItem;
