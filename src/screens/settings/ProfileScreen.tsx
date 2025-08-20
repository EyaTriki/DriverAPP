import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User, DocumentText, Lock, ArrowRight2 } from 'iconsax-react-native';
import { BoxComponent } from '../../components';

const ProfileScreen: React.FC = () => {
    const navigation = useNavigation<any>();

    return (
        <View className="flex-1 bg-backgroundScreen">
            {/* Header */}
            <View className="pt-12 pb-6 px-5">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 rounded-full bg-[#8CC044] items-center justify-center mr-4"
                    >
                        <ArrowRight2 size={20} color="#FFFFFF" variant="Outline" style={{ transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-900">Profile</Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-5 mt-6" contentContainerStyle={{ paddingBottom: 100 }}>
                <BoxComponent
                    title="Personal Informations"
                    icon={User}
                    onPress={() => navigation.navigate('PersonalInformation')}
                    variant="profile"
                    textClass="font-poppins-medium text-base"

                />
                <BoxComponent
                    title="Documents"
                    icon={DocumentText}
                    onPress={() => navigation.navigate('Documents')}
                    variant="profile"
                    textClass="font-poppins-medium text-base"

                />
                <BoxComponent
                    title="Password"
                    icon={Lock}
                    onPress={() => navigation.navigate('Password')}
                    variant="profile"
                    textClass="font-poppins-medium text-base"

                />
            </ScrollView>
        </View>
    );
};

export default ProfileScreen;
