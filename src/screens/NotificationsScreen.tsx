import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight2 } from 'iconsax-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NotificationList } from '../components';
import { NotificationItemProps } from '../components/NotificationItem';

const NotificationsScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'read'>('all');

    // Sample notification data
    const [notifications, setNotifications] = useState<NotificationItemProps[]>([
        {
            id: '1',
            isRead: false,
            message: 'A message has been sent to you by',
            senderName: 'Bobby Shmurda.',
            timestamp: 'Today At 18:30 PM',
        },
        {
            id: '2',
            isRead: true,
            message: 'A message has been sent to you by',
            senderName: 'John Doe.',
            timestamp: 'Yesterday At 15:30 PM',
        },
        {
            id: '3',
            isRead: true,
            message: 'Your day off request has been approved',
            senderName: 'HR Department',
            timestamp: '2 days ago',
        },
        {
            id: '4',
            isRead: false,
            message: 'New job assignment available',
            senderName: 'Dispatch Team',
            timestamp: '3 days ago',
        },
        {
            id: '5',
            isRead: false,
            message: 'Your payroll has been processed',
            senderName: 'Payroll System',
            timestamp: '1 week ago',
        },
    ]);

    // Filter notifications based on selected filter
    const filteredNotifications = notifications.filter(notification => {
        switch (selectedFilter) {
            case 'unread':
                return !notification.isRead;
            case 'read':
                return notification.isRead;
            default:
                return true;
        }
    });

    // Handle notification press
    const handleNotificationPress = (notification: NotificationItemProps) => {
        Alert.alert(
            'Notification Details',
            `From: ${notification.senderName}\nMessage: ${notification.message}\nTime: ${notification.timestamp}`,
            [
                {
                    text: 'Mark as Read',
                    onPress: () => {
                        if (!notification.isRead) {
                            setNotifications(prev =>
                                prev.map(n =>
                                    n.id === notification.id
                                        ? { ...n, isRead: true }
                                        : n
                                )
                            );
                        }
                    },
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]
        );
    };

    // Mark all notifications as read
    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, isRead: true }))
        );
        setFilterModalVisible(false);
    };

    return (
        <View className="flex-1 bg-backgroundScreen">
            {/* Header */}
            <View className="pt-12 pb-8 px-5">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="w-10 h-10 rounded-full bg-[#8CC044] items-center justify-center mr-4"
                        >
                            <ArrowRight2 size={20} color="#FFFFFF" variant="Outline" style={{ transform: [{ rotate: '180deg' }] }} />
                        </TouchableOpacity>
                        <View>
                            <Text className="text-xl font-bold text-gray-900">Notifications</Text>
                            {selectedFilter !== 'all' && (
                                <Text className="text-sm text-gray-500 font-poppins-medium">
                                    {selectedFilter === 'unread' ? 'Unread only' : 'Read only'}
                                </Text>
                            )}
                        </View>
                    </View>
                    <TouchableOpacity
                        className="w-10 h-10 items-center justify-center"
                        onPress={() => setFilterModalVisible(true)}
                    >
                        <MaterialCommunityIcons name="dots-vertical" size={26} color="#111827" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Notification List */}
            <View className="flex-1">
                <NotificationList
                    notifications={filteredNotifications}
                    onNotificationPress={handleNotificationPress}
                    emptyMessage="No notifications found"
                />
            </View>

            {/* Filter Modal */}
            <Modal
                visible={filterModalVisible}
                transparent
                animationType="none"
                statusBarTranslucent
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View className="flex-1 justify-end">
                    {/* Backdrop */}
                    <TouchableOpacity
                        onPress={() => setFilterModalVisible(false)}
                        className="absolute inset-0 bg-black/50"
                        activeOpacity={1}
                    />

                    {/* Bottom Sheet */}
                    <View className="bg-white rounded-t-3xl p-6">
                        {/* Handle */}
                        <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />

                        {/* Header with Title and Close Icon */}
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-xl font-poppins-bold text-gray-900">
                                Filter
                            </Text>
                            <TouchableOpacity
                                onPress={() => setFilterModalVisible(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                            >
                                <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Filter options */}
                        <View className="mb-8">
                            <TouchableOpacity
                                className="flex-row items-center justify-between py-3"
                                onPress={() => {
                                    setSelectedFilter('all');
                                    setFilterModalVisible(false);
                                }}
                            >
                                <Text className="text-base text-gray-900 font-poppins-medium">
                                    All
                                </Text>
                                <View className="w-5 h-5 rounded-full  items-center justify-center">
                                    {selectedFilter === 'all' && (
                                        <View className="w-3 h-3 rounded-full bg-[#8CC044]" />
                                    )}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-row items-center justify-between py-3"
                                onPress={() => {
                                    setSelectedFilter('unread');
                                    setFilterModalVisible(false);
                                }}
                            >
                                <Text className="text-base text-gray-900 font-poppins-medium">
                                    Unread
                                </Text>
                                <View className="w-5 h-5 rounded-full items-center justify-center">
                                    {selectedFilter === 'unread' && (
                                        <View className="w-3 h-3 rounded-full bg-[#8CC044]" />
                                    )}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-row items-center justify-between py-3"
                                onPress={() => {
                                    setSelectedFilter('read');
                                    setFilterModalVisible(false);
                                }}
                            >
                                <Text className="text-base text-gray-900 font-poppins-medium">
                                    Read
                                </Text>
                                <View className="w-5 h-5 rounded-full  items-center justify-center">
                                    {selectedFilter === 'read' && (
                                        <View className="w-3 h-3 rounded-full bg-[#8CC044]" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Mark all as read button */}
                        <TouchableOpacity
                            className="bg-[#8CC044] rounded-2xl py-4 items-center"
                            onPress={markAllAsRead}
                        >
                            <Text className="text-white font-poppins-semibold text-base">
                                Mark all as read
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default NotificationsScreen;
