import React from 'react';
import { View } from 'react-native';
import RecentActivity, { ActivityItem } from './RecentActivity';

// Example usage of the RecentActivity component
const RecentActivityExample: React.FC = () => {
    // Sample activity data
    const sampleActivities: ActivityItem[] = [
        {
            id: '1',
            action: 'Added',
            itemName: 'Fridges',
            quantity: 24,
            timestamp: 'Today, 10:32 AM',
            type: 'add'
        },
        {
            id: '2',
            action: 'Removed',
            itemName: 'Sofas',
            quantity: 5,
            timestamp: 'Yesterday, 4:15 PM',
            type: 'remove'
        },
        {
            id: '3',
            action: 'Removed',
            itemName: 'Sofas',
            quantity: 5,
            timestamp: 'Yesterday, 4:15 PM',
            type: 'remove'
        },
        {
            id: '4',
            action: 'Updated',
            itemName: 'Tables',
            quantity: 12,
            timestamp: '2 days ago, 9:45 AM',
            type: 'update'
        }
    ];

    const handleViewAll = () => {
        console.log('View All Activities pressed');
        // Navigate to full activity list or open modal
    };

    return (
        <View style={{ padding: 16, backgroundColor: '#F5F5F5' }}>
            <RecentActivity
                activities={sampleActivities}
                onViewAll={handleViewAll}
                maxItems={3}
            />
        </View>
    );
};

export default RecentActivityExample;
