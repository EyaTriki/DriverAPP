import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { Menu, Truck, MessageCircle, Setting2 } from 'iconsax-react-native';
import { COLORS } from '../constants';

// Import des écrans
import DashboardScreen from '../screens/DashboardScreen';
import IcrmScreen from '../screens/IcrmScreen';
import ResauxScreen from '../screens/ResauxScreen';
import CollabScreen from '../screens/CollabScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

// Composant pour les icônes de tab avec indicateurs actifs
const TabIcon = ({
  icon: Icon,
  isActive,
  hasIndicator = false
}: {
  icon: any;
  isActive: boolean;
  hasIndicator?: boolean;
}) => (
  <View className="items-center justify-center" style={{ height: 50 }}>
    <Icon
      size={28}
      color={isActive ? COLORS.primaryGreen : '#000000'}
      variant={isActive ? "Linear" : "Outline"}
    />
    {hasIndicator && isActive && (
      <View
        className="mt-2"
        style={{
          width: 32,
          height: 3,
          borderRadius: 2,
          backgroundColor: COLORS.primaryGreen,
        }}
      />
    )}
  </View>
);

// Composant pour l'icône centrale avec badge
const CenterTabIcon = ({ isActive: _isActive }: { isActive: boolean }) => (
  <View className="items-center justify-center relative" style={{ height: 50 }}>
    <View
      className="absolute -top-8"
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: COLORS.primaryGreen,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 12,
      }}
    >
      <MessageCircle size={32} color="#FFFFFF" variant="Linear" />

      {/* Badge de notification */}
      <View
        className="absolute -top-2 -right-2"
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: '#FF3B30',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: '#FFFFFF',
        }}
      >
        <Text className="text-white text-xs font-bold">8</Text>
      </View>
    </View>
  </View>
);

const TabNavigator = () => {
  return (
    <View className="flex-1">
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 90,
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            borderTopWidth: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 15,
            paddingHorizontal: 20,
            paddingBottom: 10,
            paddingTop: 15,
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: COLORS.primaryGreen,
          tabBarInactiveTintColor: '#000000',
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon={Menu}
                isActive={focused}
                hasIndicator={true}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Collab"
          component={CollabScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon={Truck}
                isActive={focused}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Icrm"
          component={IcrmScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <CenterTabIcon isActive={focused} />
            ),
          }}
        />

        <Tab.Screen
          name="Resaux"
          component={ResauxScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon={Menu}
                isActive={focused}
                hasIndicator={true}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon={Setting2}
                isActive={focused}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default TabNavigator;
