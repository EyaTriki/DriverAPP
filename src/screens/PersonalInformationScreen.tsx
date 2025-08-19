import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight2 } from 'iconsax-react-native';
import { useAuthStore } from '../stores/authStore';

const PersonalInformationScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { user } = useAuthStore();
    const [name, setName] = useState(user?.name || 'John Doe');
    const [email, setEmail] = useState(user?.email || 'JohnDoe20@gmail.com');

    const handleConfirm = () => {
        // Here you would typically update the user data
        navigation.goBack();
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="pt-12 pb-6 px-5">
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
            <View className="flex-1 px-5">
                {/* Name Field */}
                <View className="mb-8">
                    <Text className="text-base font-semibold text-gray-900 mb-3">Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900"
                        placeholder="John Doe"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* Email Field */}
                <View className="mb-8">
                    <Text className="text-base font-semibold text-gray-900 mb-3">Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900"
                        placeholder="JohnDoe20@gmail.com"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
            </View>

            {/* Action Buttons */}
            <View className="px-5 pb-8">
                <View className="flex-row space-x-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="flex-1 py-4 rounded-xl border border-gray-200"
                    >
                        <Text className="text-center text-base font-semibold text-gray-900">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleConfirm}
                        className="flex-1 py-4 rounded-xl bg-[#8CC044]"
                    >
                        <Text className="text-center text-base font-semibold text-white">Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default PersonalInformationScreen;
