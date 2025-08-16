import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const CollabScreen = () => {
  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="p-6">
        <Text className="text-2xl font-bold text-gray-800 mb-6">Collaboration</Text>

        {/* Section 1 */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Projets en cours</Text>
          <Text className="text-gray-600">Liste des projets de collaboration actifs.</Text>
        </View>

        {/* Section 2 */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Équipes</Text>
          <Text className="text-gray-600">Gestion des équipes de collaboration.</Text>
        </View>

        {/* Section 3 */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Tâches</Text>
          <Text className="text-gray-600">Répartition et suivi des tâches.</Text>
        </View>

        {/* Section 4 */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Communication</Text>
          <Text className="text-gray-600">Outils de communication d'équipe.</Text>
        </View>

        {/* Section 5 */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Documents partagés</Text>
          <Text className="text-gray-600">Accès aux documents de collaboration.</Text>
        </View>

        {/* Section 6 */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Calendrier</Text>
          <Text className="text-gray-600">Planning des réunions et événements.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default CollabScreen;