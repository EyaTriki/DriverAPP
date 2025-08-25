import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import ChatScreen from '../screens/ChatScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import AddItemsScreen from '../screens/storage/AddItemsScreen';
import RemoveItemsScreen from '../screens/storage/RemoveItemsScreen';
import { useAuthStore } from '../stores/authStore';
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();

const MainNavigator = () => {
    const { isLoading, isAuthenticated, checkAuthStatus } = useAuthStore();

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#8CC044" />
            </View>
        );
    }

    // Determine initial route based on authentication status
    const getInitialRouteName = () => {
        if (isAuthenticated) {
            return 'MainApp';
        }
        return 'Splash';
    };

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={getInitialRouteName()}
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
            >
                <Stack.Screen
                    name="Splash"
                    component={SplashScreen}
                    options={{
                        gestureEnabled: false,
                    }}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                        gestureEnabled: false,
                    }}
                />
                <Stack.Screen
                    name="MainApp"
                    component={TabNavigator}
                    options={{
                        gestureEnabled: false,
                    }}
                />
                <Stack.Screen
                    name="Chat"
                    component={ChatScreen}
                    options={{
                        headerShown: false,
                        gestureEnabled: true,
                    }}
                />
                <Stack.Screen
                    name="Notifications"
                    component={NotificationsScreen}
                    options={{
                        headerShown: false,
                        gestureEnabled: true,
                    }}
                />
                <Stack.Screen
                    name="AddItems"
                    component={AddItemsScreen}
                    options={{
                        headerShown: false,
                        gestureEnabled: true,
                    }}
                />
                <Stack.Screen
                    name="RemoveItems"
                    component={RemoveItemsScreen}
                    options={{
                        headerShown: false,
                        gestureEnabled: true,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default MainNavigator;
