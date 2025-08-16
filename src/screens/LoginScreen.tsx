import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
} from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { COLORS, IMAGES } from '../constants';
import InputField from '../components/InputField';

interface LoginScreenProps {
    navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const [email, setEmail] = useState('driver@gmail.com');
    const [password, setPassword] = useState('password');
    const { login, isLoading } = useAuthStore();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const success = await login(email, password);
        if (success) {
            navigation.replace('MainApp');
        } else {
            Alert.alert('Error', 'Invalid email or password');
        }
    };

    return (
        <View className="flex-1">
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryGreen} />

            {/* Background with two sections */}
            <View className="flex-1">
                {/* Green section (top) */}
                <View className="flex-1" style={{ backgroundColor: COLORS.primaryGreen }} />
                {/* White section (bottom) */}
                <View className="flex-1 bg-white" />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="absolute inset-0"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'flex-start',
                        paddingTop: 80 // Décalage vers le haut
                    }}
                >
                    <View className="px-6">
                        {/* Header Section - In green area */}
                        <View className="items-center mb-16">
                            {/* Logo from assets */}
                            <View className="mb-8 mt-5">
                                <Image
                                    source={IMAGES.logoWhite}
                                    className="w-50 h-50"
                                    resizeMode="contain"
                                />
                            </View>

                            {/* Title */}
                            <Text className="text-white text-3xl font-bold mb-4">Sign In</Text>

                            {/* Subtitle */}
                            <Text className="text-white/80 text-center text-lg">
                                Enter your email and password to log in !
                            </Text>
                        </View>

                        {/* Form Container - Overlapping both sections */}
                        <View className="bg-white rounded-3xl p-8 shadow-2xl">
                            {/* Email Input */}
                            <InputField
                                label="Email"
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                type="email"
                                className="mb-6"
                                inputStyle="email"
                            />

                            {/* Password Input */}
                            <InputField
                                label="Password"
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                type="password"
                                className="mb-8"
                                inputStyle="password"
                            />

                            {/* Sign In Button with green background */}
                            <TouchableOpacity
                                className="rounded-xl py-5 items-center"
                                style={{ backgroundColor: COLORS.primaryGreen }}
                                onPress={handleLogin}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Text className="text-white font-semibold text-lg">Loading...</Text>
                                ) : (
                                    <Text className="text-white font-semibold text-lg">Sign In</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default LoginScreen;
