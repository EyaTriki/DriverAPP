import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight2 } from 'iconsax-react-native';
import { useAuthStore } from '../../stores/authStore';
import { InputField, Button } from '../../components';

const PersonalInformationScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { user, updateProfile, isLoading } = useAuthStore();
    const [name, setName] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');

    const handleConfirm = async () => {
        if (!name || !email) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        try {
            const success = await updateProfile({
                username: name,
                email: email
            });
            if (success) {
                Alert.alert('Success', 'Personal information updated successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error: any) {
            Alert.alert('Update Error', error.message || 'Failed to update personal information');
        }
    };

    return (
        <View className="flex-1 bg-backgroundScreen">
            {/* Header */}
            <View className="pt-12 pb-8 px-5">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 rounded-full bg-[#8CC044] items-center justify-center mr-4"
                    >
                        <ArrowRight2 size={20} color="#FFFFFF" variant="Outline" style={{ transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-900">Personal Informations</Text>
                </View>
            </View>

            {/* Content */}
            <View className="px-5 mt-4">
                {/* Name Field */}
                <View className="mb-6">
                    <InputField
                        label="Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="John Doe"
                        type="text"
                    />
                </View>

                {/* Email Field */}
                <View className="mb-6">
                    <InputField
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="JohnDoe20@gmail.com"
                        type="email"
                    />
                </View>

                {/* Action Buttons - Positioned after content */}
                <View className="mt-8 px-4">
                    <View className="flex-row justify-between gap-2">
                        <Button
                            title="Cancel"
                            onPress={() => navigation.goBack()}
                            variant="transparent"
                            className="flex-1 mr-2"
                            textClassName="text-black font-poppins-semibold text-base"

                        />
                        <Button
                            title={isLoading ? "Updating..." : "Confirm"}
                            onPress={handleConfirm}
                            variant="primary"
                            className="flex-1 ml-2 "
                            textClassName="text-white font-poppins-semibold text-base"
                            disabled={isLoading}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PersonalInformationScreen;
