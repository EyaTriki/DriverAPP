import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PersonalInformationScreen from '../screens/PersonalInformationScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import PasswordScreen from '../screens/PasswordScreen';

const Stack = createStackNavigator();

const SettingsNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
            }}
        >
            <Stack.Screen name="SettingsMain" component={SettingsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="PersonalInformation" component={PersonalInformationScreen} />
            <Stack.Screen name="Documents" component={DocumentsScreen} />
            <Stack.Screen name="Password" component={PasswordScreen} />
        </Stack.Navigator>
    );
};

export default SettingsNavigator;
