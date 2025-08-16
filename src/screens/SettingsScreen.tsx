import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/Button';

const SettingsScreen: React.FC = () => {
    const { user, logout } = useAuthStore();
    const navigation = useNavigation();

    const handleLogout = async () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel',
                },
                {
                    text: 'Déconnexion',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout();
                            // Navigation vers l'écran de connexion après déconnexion
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' as never }],
                            });
                        } catch (error) {
                            console.error('Erreur lors de la déconnexion:', error);
                            Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 100 }}>
            <View className="p-5">
                {/* Header */}
                <View className="items-center mt-12 mb-10">
                    <Text className="text-2xl font-bold text-gray-900">Paramètres</Text>
                </View>

                {/* User Info Card */}
                <View className="bg-gray-50 rounded-2xl p-6 mb-8">
                    <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
                        <Text className="text-gray-600 font-semibold text-base">Nom:</Text>
                        <Text className="text-gray-900 text-base">{user?.name || 'Driver'}</Text>
                    </View>
                    <View className="flex-row justify-between items-center py-3">
                        <Text className="text-gray-600 font-semibold text-base">Email:</Text>
                        <Text className="text-gray-900 text-base">{user?.email || 'driver@gmail.com'}</Text>
                    </View>
                </View>

                {/* Settings Options */}
                <View className="bg-gray-50 rounded-2xl p-6 mb-8">
                    <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-200">
                        <Text className="text-gray-600 font-semibold text-base">Notifications</Text>
                        <Text className="text-gray-400 text-sm">Activées</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-200">
                        <Text className="text-gray-600 font-semibold text-base">Langue</Text>
                        <Text className="text-gray-400 text-sm">Français</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row justify-between items-center py-3">
                        <Text className="text-gray-600 font-semibold text-base">Thème</Text>
                        <Text className="text-gray-400 text-sm">Clair</Text>
                    </TouchableOpacity>
                </View>

                {/* Additional Settings */}
                <View className="bg-gray-50 rounded-2xl p-6 mb-8">
                    <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-200">
                        <Text className="text-gray-600 font-semibold text-base">Sécurité</Text>
                        <Text className="text-gray-400 text-sm">Configurer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-200">
                        <Text className="text-gray-600 font-semibold text-base">Confidentialité</Text>
                        <Text className="text-gray-400 text-sm">Gérer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row justify-between items-center py-3">
                        <Text className="text-gray-600 font-semibold text-base">Aide</Text>
                        <Text className="text-gray-400 text-sm">Support</Text>
                    </TouchableOpacity>
                </View>

                {/* Account Settings */}
                <View className="bg-gray-50 rounded-2xl p-6 mb-8">
                    <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-200">
                        <Text className="text-gray-600 font-semibold text-base">Profil</Text>
                        <Text className="text-gray-400 text-sm">Modifier</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-200">
                        <Text className="text-gray-600 font-semibold text-base">Mot de passe</Text>
                        <Text className="text-gray-400 text-sm">Changer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row justify-between items-center py-3">
                        <Text className="text-gray-600 font-semibold text-base">Compte</Text>
                        <Text className="text-gray-400 text-sm">Gérer</Text>
                    </TouchableOpacity>
                </View>

                {/* App Settings */}
                <View className="bg-gray-50 rounded-2xl p-6 mb-8">
                    <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-200">
                        <Text className="text-gray-600 font-semibold text-base">Version</Text>
                        <Text className="text-gray-400 text-sm">1.0.0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-200">
                        <Text className="text-gray-600 font-semibold text-base">Mise à jour</Text>
                        <Text className="text-gray-400 text-sm">Disponible</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row justify-between items-center py-3">
                        <Text className="text-gray-600 font-semibold text-base">À propos</Text>
                        <Text className="text-gray-400 text-sm">Informations</Text>
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <Button
                    title="Se déconnecter"
                    onPress={handleLogout}
                    variant="danger"
                    size="large"
                    className="mb-8"
                />
            </View>
        </ScrollView>
    );
};

export default SettingsScreen;
