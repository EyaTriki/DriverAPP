// screens/SettingsScreen.tsx
import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, Image, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../stores/authStore';
import { User, Wallet, LogoutCurve, Camera, Calendar as Today } from 'iconsax-react-native';
import { IMAGES } from '../../constants/images';
import { BoxComponent } from '../../components';
import { FilePicker } from '../../components';
import { FilePickerResult } from '../../components/FilePicker';


const SettingsScreen: React.FC = () => {
    const { user, logout } = useAuthStore();
    const navigation = useNavigation<any>();
    const [profileImage, setProfileImage] = useState<string | null>(null);


    const handleCameraPress = async () => {
        try {
            const result: FilePickerResult | null = await FilePicker.takePhoto({
                mediaType: 'photo',
                maxHeight: 2000,
                maxWidth: 2000,
                quality: 0.8,
            });

            if (result && result.uri) {
                setProfileImage(result.uri);
            }
        } catch (error) {
            console.error('Camera error:', error);
            Alert.alert('Error', 'Failed to take photo. Please try again.');
        }
    };

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
        <View className="flex-1 bg-[#F7F7FA]">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 140, paddingTop: 100 }}
            >
                {/* Profile card */}
                <View className="px-5 pt-3">
                    <View className="bg-white rounded-3xl px-5 pt-12 pb-6 items-center" style={Platform.select({

                    }) as any}>
                        {/* Avatar stack */}
                        <View className="absolute -top-10">
                            {/* outer grey ring */}
                            <View className="w-30 h-30 rounded-full border-[3px] border-white items-center justify-center">
                                {/* inner avatar container */}
                                <View className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                                    <Image
                                        source={user?.picture  ? { uri: user?.picture } : IMAGES.avatarPlaceholder}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                </View>
                            </View>

                            {/* camera badge */}
                            <TouchableOpacity
                                className="absolute -right-1 -bottom-1 w-7 h-7 rounded-full bg-[#8BC34A] items-center justify-center border-2 border-white"
                                onPress={handleCameraPress}
                            >
                                <Camera size={14} color="#fff" variant="Outline" />
                            </TouchableOpacity>
                        </View>

                        <Text className="mt-4 text-lg font-poppins-bold text-gray-900">
                            {user?.username || 'John Doe'}
                        </Text>
                        <Text className="mt-1 font-poppins-regular text-lg text-gray-500">
                            {user?.email || 'Johndoe20@gmail.com'}
                        </Text>
                    </View>
                </View>

                {/* Tiles */}
                <View className="px-6 mt-6">
                    <BoxComponent
                        title="Profile"
                        icon={User}
                        onPress={() => navigation.navigate('Profile')}
                        variant="settings"
                        textClass="font-poppins-medium text-base"
                    />
                    <BoxComponent
                        title="Request Day Off"
                        icon={Today}
                        onPress={() => navigation.navigate('RequestDayOff')}
                        variant="settings"
                        textClass="font-poppins-medium text-base"

                    />
                    <BoxComponent
                        title="Payroll"
                        icon={Wallet}
                        onPress={() => navigation.navigate('Payroll')}
                        variant="settings"
                        textClass="font-poppins-medium text-base"

                    />

                    {/* Logout (danger) */}
                    <BoxComponent
                        title="Logout"
                        icon={LogoutCurve}
                        danger
                        onPress={handleLogout}
                        variant="settings"
                        textClass="font-poppins-medium text-base"

                    />
                </View>
            </ScrollView>


        </View>
    );
};

export default SettingsScreen;
