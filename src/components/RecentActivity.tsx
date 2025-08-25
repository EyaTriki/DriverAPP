import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';
import { Refresh } from 'iconsax-react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export interface ActivityItem {
    id: string;
    action: string;
    itemName: string;
    quantity: number;
    timestamp: string;
    type: 'add' | 'remove' | 'update';
}

export interface RecentActivityProps {
    activities: ActivityItem[];
    maxItems?: number;
}

const ActivityItemComponent: React.FC<{ activity: ActivityItem }> = ({ activity }) => {
    const getIcon = () => {
        switch (activity.type) {
            case 'add':
                return <MaterialIcons name="add" size={20} color="#22C55E" />;
            case 'remove':
                return <MaterialIcons name="remove" size={20} color="#3B82F6" />;
            case 'update':
                return <Refresh size={16} color="#EAB308" />;
            default:
                return <MaterialIcons name="add" size={20} color="#6B7280" />;
        }
    };

    return (
        <View className="flex-row items-start p-4 bg-white rounded-lg  border-gray-100 mb-3 shadow-sm">
            {/* Icon */}
            <View className="w-10 h-10 items-center justify-center mr-3">
                <View className={`w-8 h-8 rounded-full items-center justify-center`} style={{
                    backgroundColor: activity.type === 'add' ? 'rgba(140, 192, 68, 0.18)' :
                        activity.type === 'remove' ? 'rgba(59, 130, 246, 0.18)' :
                            'rgba(234, 179, 8, 0.18)'
                }}>
                    {getIcon()}
                </View>
            </View>

            {/* Content */}
            <View className="flex-1">
                <Text
                    style={[
                        TYPOGRAPHY.bodyMedium,
                        { color: COLORS.black, fontWeight: '600' }
                    ]}
                >
                    {activity.action} {activity.quantity} {activity.itemName}
                </Text>
                <Text
                    style={[
                        TYPOGRAPHY.captionMedium,
                        { color: COLORS.gray, marginTop: 2 }
                    ]}
                >
                    {activity.timestamp}
                </Text>
            </View>
        </View>
    );
};

const RecentActivity: React.FC<RecentActivityProps> = ({
    activities,
    maxItems = 3
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const displayedActivities = isExpanded
        ? activities
        : activities.slice(0, maxItems);

    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <View className="bg-gray-50 p-2 rounded-lg">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
                <Text
                    className="text-base font-poppins-semibold text-black"
                >
                    Recent Activity
                </Text>
                {activities.length > maxItems && (
                    <TouchableOpacity onPress={handleToggleExpand}>
                        <Text
                            style={[
                                TYPOGRAPHY.buttonSemiBold,
                                { color: '#007AFF' }
                            ]}
                        >
                            {isExpanded ? 'Show Less' : 'View All'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Activity List */}
            <View>
                {displayedActivities.map((activity) => (
                    <ActivityItemComponent
                        key={activity.id}
                        activity={activity}
                    />
                ))}
            </View>
        </View>
    );
};

export default RecentActivity;
