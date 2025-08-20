import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight2 } from 'iconsax-react-native';
import { InputField, Button } from '../../components';

const PasswordScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleConfirm = () => {
        // Here you would typically update the password
        navigation.goBack();
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
                    <Text className="text-xl font-bold text-gray-900">Password</Text>
                </View>
            </View>

            {/* Content */}
            <View className="px-5 mt-4">
                {/* New Password Field */}
                <View className="mb-6">
                    <InputField
                        label="New Password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="********"
                        type="password"
                    />
                </View>

                {/* Confirm Password Field */}
                <View className="mb-6">
                    <InputField
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="********"
                        type="password"
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
                            title="Confirm"
                            onPress={handleConfirm}
                            variant="primary"
                            className="flex-1 ml-2"
                            textClassName="text-white font-poppins-semibold text-base"
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PasswordScreen;
