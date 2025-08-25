import React from 'react';
import { View, FlatList, Text } from 'react-native';
import NotificationItem, { NotificationItemProps } from './NotificationItem';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

export interface NotificationListProps {
    notifications: NotificationItemProps[];
    onNotificationPress?: (notification: NotificationItemProps) => void;
    emptyMessage?: string;
    headerTitle?: string;
}

const NotificationList: React.FC<NotificationListProps> = ({
    notifications,
    onNotificationPress,
    emptyMessage = 'No notifications yet',
    headerTitle,
}) => {
    const handleNotificationPress = (notification: NotificationItemProps) => {
        onNotificationPress?.(notification);
    };

    const renderNotification = ({ item }: { item: NotificationItemProps }) => (
        <NotificationItem
            {...item}
            onPress={() => handleNotificationPress(item)}
        />
    );

    const renderEmptyState = () => (
        <View className="flex-1 items-center justify-center py-20">
            <Text
                style={[
                    TYPOGRAPHY.bodyMedium,
                    { color: COLORS.gray, textAlign: 'center' }
                ]}
            >
                {emptyMessage}
            </Text>
        </View>
    );

    const renderHeader = () => {
        if (!headerTitle) return null;

        return (
            <View className="px-4 py-3 ">
                <Text
                    style={[
                        TYPOGRAPHY.titleBold,
                        { color: COLORS.black }
                    ]}
                >
                    {headerTitle}
                </Text>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-backgroundScreen">
            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                ItemSeparatorComponent={() => <View className="h-px bg-gray-100" />}
            />
        </View>
    );
};

export default NotificationList;
