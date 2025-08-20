// TabNavigator.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import ChatScreen from '../screens/ChatScreen';
import StorageScreen from '../screens/StorageScreen';
import TippingScreen from '../screens/TippingScreen';
import SettingsNavigator from './SettingsNavigator';

const IconItem = ({
  focused,
  children,
}: {
  focused: boolean;
  children: React.ReactNode;
}) => (
  <View style={styles.tabItem}>
    {children}
    {focused && <View style={styles.activeDash} />}
  </View>
);

const TabNavigator = () => {
  const renderIcon = (routeName: string, selectedTab: string) => {
    const focused = routeName === selectedTab;
    const c = focused ? COLORS.primaryGreen : '#000';

    switch (routeName) {
      case 'Dashboard':
        return (
          <IconItem focused={focused}>
            <Ionicons name="menu" size={30} color={c} />
          </IconItem>
        );
      case 'Collab':
        return (
          <IconItem focused={focused}>
            <MaterialCommunityIcons name="truck-outline" size={30} color={c} />
          </IconItem>
        );
      case 'Resaux':
        return (
          <IconItem focused={focused}>
            <MaterialCommunityIcons name="home-variant-outline" size={30} color={c} />
          </IconItem>
        );
      case 'Settings':
        return (
          <IconItem focused={focused}>
            <Ionicons name="settings-outline" size={30} color={c} />
          </IconItem>
        );
      default:
        return null;
    }
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }: any) => (
    <TouchableOpacity
      style={styles.tabTouch}
      activeOpacity={0.8}
      onPress={() => navigate(routeName)}
    >
      {renderIcon(routeName, selectedTab)}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-backgroundScreen">

      <CurvedBottomBar.Navigator
        screenOptions={{ headerShown: false }}
        type="DOWN"             // courbe qui remonte vers le bouton central
        height={60}
        width={Dimensions.get('window').width}
        circleWidth={70}        // taille du bouton central
        bgColor="#FFFFFF"
        borderTopLeftRight
        borderColor="#E0E8F2"
        borderWidth={1}
        circlePosition="CENTER"
        style={styles.bar}
        shadowStyle={styles.barShadow}
        initialRouteName="Dashboard"
        id="TabNavigator"
        backBehavior="history"
        screenListeners={{}}
        defaultScreenOptions={{}}

        renderCircle={({ navigate }: { navigate: any }) => (
          <Animated.View style={styles.centerFAB}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigate('Chat')}
              style={styles.centerButton}
            >
              <Ionicons name="chatbubbles-outline" size={32} color="#FFF" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>8</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
        tabBar={renderTabBar}
      >
        {/* LEFT side */}
        <CurvedBottomBar.Screen name="Dashboard" position="LEFT" component={DashboardScreen} />
        <CurvedBottomBar.Screen name="Collab" position="LEFT" component={TippingScreen} />

        {/* CENTER FAB routes to this screen */}
        <CurvedBottomBar.Screen name="Chat" position="CIRCLE" component={ChatScreen} />

        {/* RIGHT side */}
        <CurvedBottomBar.Screen name="Resaux" position="RIGHT" component={StorageScreen} />
        <CurvedBottomBar.Screen name="Settings" position="RIGHT" component={SettingsNavigator} />
      </CurvedBottomBar.Navigator>

    </View >
  );
};

const styles = StyleSheet.create({
  bar: {
    marginTop: 2,
  },

  barShadow: {
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: -6 },
    // shadowOpacity: 0.12,
    // shadowRadius: 12,
    // elevation: 15,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 0,
  },
  tabTouch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  tabItem: {
    height: 50,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeDash: {
    position: 'absolute',
    bottom: 0,
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primaryGreen,
  },
  centerFAB: {
    width: 70,
    height: 70,
    borderRadius: 35,
    bottom: 24, // élévation du bouton au-dessus de la barre
    backgroundColor: COLORS.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    // elevation: 12,
  },
  centerButton: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badgeText: { color: '#FFF', fontWeight: '700', fontSize: 10 },
});

export default TabNavigator;
