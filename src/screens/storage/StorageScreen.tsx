import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import HeaderGreeting from '../../components/HeaderGreeting';
import StorageCard from '../../components/StorageCard';
import RecentActivity from '../../components/RecentActivity';

interface StorageScreenProps {
  navigation: any;
  route: any;
}

const StorageScreen: React.FC<StorageScreenProps> = ({ navigation }) => {
  const handleAddItems = () => {
    navigation.navigate('AddItems');
  };

  const handleRemoveItems = () => {
    navigation.navigate('RemoveItems');
  };

  // Sample activity data
  const recentActivities = [
    {
      id: '1',
      action: 'Added',
      itemName: 'Fridges',
      quantity: 24,
      timestamp: 'Today, 10:32 AM',
      type: 'add' as const
    },
    {
      id: '2',
      action: 'Removed',
      itemName: 'Sofas',
      quantity: 5,
      timestamp: 'Yesterday, 4:15 PM',
      type: 'remove' as const
    },
    {
      id: '3',
      action: 'Removed',
      itemName: 'Sofas',
      quantity: 5,
      timestamp: 'Yesterday, 4:15 PM',
      type: 'remove' as const
    },
    {
      id: '4',
      action: 'Added',
      itemName: 'Tables',
      quantity: 12,
      timestamp: '2 days ago, 2:30 PM',
      type: 'add' as const
    },
    {
      id: '5',
      action: 'Removed',
      itemName: 'Chairs',
      quantity: 8,
      timestamp: '3 days ago, 11:45 AM',
      type: 'remove' as const
    },
    {
      id: '6',
      action: 'Added',
      itemName: 'Lamps',
      quantity: 15,
      timestamp: '4 days ago, 9:20 AM',
      type: 'add' as const
    }
  ];

  return (
    <ScrollView className="flex-1 bg-backgroundScreen" contentContainerStyle={{ paddingBottom: 120 }}>
      <View className="p-5">
        <HeaderGreeting
          subtitle="Hello, Welcome 👋"
        />
        <Text className="text-xl font-poppins-semibold mt-6 mb-4">Storage</Text>

        {/* Add Items Card */}
        <StorageCard
          title="Add Items"
          subtitle="Log new items into storage"
          iconName="boxes"
          iconType="fontawesome5"
          iconColor="#8CC044"
          backgroundColor="rgba(140, 192, 68, 0.18)"
          onPress={handleAddItems}
        />

        {/* Remove Items Card */}
        <StorageCard
          title="Remove Items"
          subtitle="Update or reduce stock"
          iconName="trash-outline"
          iconColor="#3B82F6"
          backgroundColor="rgba(59, 130, 246, 0.18)"
          onPress={handleRemoveItems}
        />
      </View>

      {/* Recent Activity Section */}
      <View className="px-5">
        <RecentActivity
          activities={recentActivities}
          maxItems={3}
        />
      </View>

    </ScrollView>
  );
};

export default StorageScreen;
