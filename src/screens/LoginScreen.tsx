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
import LoadingOverlay from '../components/LoadingOverlay';

interface LoginScreenProps {
    navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const [email, setEmail] = useState('driver1@wp.com');
    const [password, setPassword] = useState('password');
    const [showSuccessLoader, setShowSuccessLoader] = useState(false);
    const { login, isLoading } = useAuthStore();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            console.log('Attempting login with:', { email, password });
            const success = await login(email, password);
            if (success) {
                console.log('Login successful, showing success loader');
                setShowSuccessLoader(true);

                // Show loader for 2 seconds then navigate
                setTimeout(() => {
                    setShowSuccessLoader(false);
                    navigation.replace('MainApp');
                }, 2000);
            }
        } catch (error: any) {
            console.log('Login error:', error);
            console.error('Login error:', error);
            // Show error as alert - the error message comes from the auth store
            Alert.alert('Login Error', error.message || 'An error occurred during login');
        }
    };



    return (
        <View className="flex-1">
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryGreen} />

            {/* Success Loader Overlay */}
            {showSuccessLoader && (
                <LoadingOverlay message="Login successful! Loading your dashboard..." />
            )}

            <View className="absolute inset-0">
                {/* Top green area (fixed height) */}
                <View style={{ height: 400, backgroundColor: COLORS.primaryGreen }} />
                {/* Bottom white area fills the rest */}
                <View style={{ flex: 1, backgroundColor: 'white' }} />
            </View>




            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                style={{ flex: 1 }}
            >
                <ScrollView
                    className="flex-1"
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'flex-start',
                        paddingTop: 80,
                        paddingBottom: 190, // Increased bottom padding for better keyboard handling
                        minHeight: '100%'
                    }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <View className="px-6">
                        {/* Header Section - In green area */}
                        <View className="items-center mb-16">
                            {/* Logo from assets */}
                            <View className="mb-8 mt-5">
                                <Image
                                    source={IMAGES.logoWhite}
                                    className="w-33 h-32"
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
                        <View className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
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
