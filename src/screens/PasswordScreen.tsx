import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight2, Eye, EyeSlash } from 'iconsax-react-native';

const PasswordScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleConfirm = () => {
        // Here you would typically update the password
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
                    <Text className="text-xl font-bold text-gray-900">Password</Text>
                </View>
            </View>

            {/* Content */}
            <View className="flex-1 px-5">
                {/* New Password Field */}
                <View className="mb-8">
                    <Text className="text-base font-semibold text-gray-900 mb-3">New Password</Text>
                    <View className="relative">
                        <TextInput
                            value={newPassword}
                            onChangeText={setNewPassword}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 pr-12"
                            placeholder="********"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!showNewPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-4"
                        >
                            {showNewPassword ? (
                                <EyeSlash size={20} color="#9CA3AF" variant="Outline" />
                            ) : (
                                <Eye size={20} color="#9CA3AF" variant="Outline" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Confirm Password Field */}
                <View className="mb-8">
                    <Text className="text-base font-semibold text-gray-900 mb-3">Confirm New Password</Text>
                    <View className="relative">
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 pr-12"
                            placeholder="********"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!showConfirmPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-4"
                        >
                            {showConfirmPassword ? (
                                <EyeSlash size={20} color="#9CA3AF" variant="Outline" />
                            ) : (
                                <Eye size={20} color="#9CA3AF" variant="Outline" />
                            )}
                        </TouchableOpacity>
                    </View>
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

export default PasswordScreen;
