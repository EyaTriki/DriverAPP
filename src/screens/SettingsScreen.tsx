// screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../stores/authStore';
import { User, Calendar, Wallet, LogoutCurve, ArrowRight2, Camera } from 'iconsax-react-native';


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

const SettingsTile = ({
    title,
    icon: Icon,
    onPress,
    danger = false,
}: {
    title: string;
    icon: IconType;
    onPress?: () => void;
    danger?: boolean;
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
                    <Icon size={24} color={danger ? '#E53935' : '#111827'} variant="Outline" />
                </View>
                <Text
                    className={`text-base font-semibold ${danger ? 'text-red-500' : 'text-gray-900'
                        }`}
                >
                    {title}
                </Text>
            </View>

            <ArrowRight2 size={22} color={danger ? '#EF4444' : '#9CA3AF'} variant="Outline" />
        </View>
    </TouchableOpacity>
);

const SettingsScreen: React.FC = () => {
    const { user, logout } = useAuthStore();
    const navigation = useNavigation<any>();

    const handleLogout = async () => {
        Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
            { text: 'Annuler', style: 'cancel' },
            {
                text: 'Déconnexion',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await logout();
                        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    } catch (e) {
                        console.error(e);
                        Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion.');
                    }
                },
            },
        ]);
    };

    return (
        <ScrollView
            className="flex-1 bg-[#F7F7FA]"
            contentContainerStyle={{ paddingBottom: 140, paddingTop: 100 }}
        >
            {/* Profile card */}
            <View className="px-5 pt-6">
                <View className="bg-white rounded-3xl px-5 pt-12 pb-6 items-center" style={softShadow as any}>
                    {/* Avatar stack */}
                    <View className="absolute -top-10">
                        {/* outer grey ring */}
                        <View className="w-24 h-24 rounded-full border-[3px] border-[#E6E6E6] items-center justify-center">
                            {/* inner white ring */}
                            <View className="w-22 h-22 rounded-full border-[3px] border-white overflow-hidden bg-gray-200">
                                {user?.avatar ? (
                                    <Image source={{ uri: user.avatar }} className="w-full h-full" resizeMode="cover" />
                                ) : (
                                    <Image
                                        source={{ uri: 'https://i.pravatar.cc/150?img=5' }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                )}
                            </View>
                        </View>

                        {/* camera badge */}
                        <View className="absolute -right-1 -bottom-1 w-7 h-7 rounded-full bg-[#8BC34A] items-center justify-center border-2 border-white">
                            <Camera size={14} color="#fff" variant="Bold" />
                        </View>
                    </View>

                    <Text className="mt-4 text-xl font-extrabold text-gray-900">
                        {user?.name || 'John Doe'}
                    </Text>
                    <Text className="mt-1 text-sm text-gray-500">
                        {user?.email || 'Johndoe20@gmail.com'}
                    </Text>
                </View>
            </View>

            {/* Tiles */}
            <View className="px-5 mt-6">
                <SettingsTile
                    title="Profile"
                    icon={User}
                    onPress={() => navigation.navigate('Profile')}
                />
                <SettingsTile
                    title="Request Day Off"
                    icon={Calendar}
                    onPress={() => navigation.navigate('RequestDayOff')}
                />
                <SettingsTile
                    title="Payroll"
                    icon={Wallet}
                    onPress={() => navigation.navigate('Payroll')}
                />

                {/* Logout (danger) */}
                <SettingsTile
                    title="Logout"
                    icon={LogoutCurve}
                    danger
                    onPress={handleLogout}
                />
            </View>
        </ScrollView>
    );
};

export default SettingsScreen;
