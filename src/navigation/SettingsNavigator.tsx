import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ProfileScreen from '../screens/settings/ProfileScreen';
import PersonalInformationScreen from '../screens/settings/PersonalInformationScreen';
import DocumentsScreen from '../screens/settings/DocumentsScreen';
import PasswordScreen from '../screens/settings/PasswordScreen';
import RequestDayOffScreen from '../screens/settings/RequestDayOffScreen';
import PayrollScreen from '../screens/PayrollScreen';

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
            <Stack.Screen name="RequestDayOff" component={RequestDayOffScreen} />
            <Stack.Screen name="Payroll" component={PayrollScreen} />
        </Stack.Navigator>
    );
};

export default SettingsNavigator;
