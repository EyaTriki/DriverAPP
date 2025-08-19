import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User, DocumentText, Lock, ArrowRight2 } from 'iconsax-react-native';

const softShadow = Platform.select({
    ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.07,
        shadowRadius: 16,
    },
    android: { elevation: 4 },
});

type IconType = React.ComponentType<any>;

const ProfileTile = ({
    title,
    icon: Icon,
    onPress,
}: {
    title: string;
    icon: IconType;
    onPress: () => void;
}) => (
    <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        className="bg-white rounded-2xl px-4 py-4 mb-4"
        style={softShadow as any}
    >
        <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
                <View className="w-11 h-11 rounded-xl border border-gray-200 bg-white items-center justify-center mr-3">
                    <Icon size={24} color="#111827" variant="Outline" />
                </View>
                <Text className="text-base font-semibold text-gray-900">
                    {title}
                </Text>
            </View>
            <ArrowRight2 size={22} color="#9CA3AF" variant="Outline" />
        </View>
    </TouchableOpacity>
);

const ProfileScreen: React.FC = () => {
    const navigation = useNavigation<any>();

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
                    <Text className="text-xl font-bold text-gray-900">Profile</Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 100 }}>
                <ProfileTile
                    title="Personal Informations"
                    icon={User}
                    onPress={() => navigation.navigate('PersonalInformation')}
                />
                <ProfileTile
                    title="Documents"
                    icon={DocumentText}
                    onPress={() => navigation.navigate('Documents')}
                />
                <ProfileTile
                    title="Password"
                    icon={Lock}
                    onPress={() => navigation.navigate('Password')}
                />
            </ScrollView>
        </View>
    );
};

export default ProfileScreen;
