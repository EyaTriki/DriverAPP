import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const ResauxScreen = () => {
  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="p-6">
        <Text className="text-2xl font-bold text-gray-800 mb-6">Réseaux</Text>

        {/* Section 1 */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Connexions</Text>
          <Text className="text-gray-600">Gestion des connexions réseau.</Text>
        </View>

        {/* Section 2 */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Contacts</Text>
          <Text className="text-gray-600">Liste des contacts professionnels.</Text>
        </View>

        {/* Section 3 */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Groupes</Text>
          <Text className="text-gray-600">Groupes de travail et communautés.</Text>
        </View>

        {/* Section 4 */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Événements</Text>
          <Text className="text-gray-600">Événements réseau et rencontres.</Text>
        </View>

        {/* Section 5 */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Recommandations</Text>
          <Text className="text-gray-600">Suggestions de connexions.</Text>
        </View>

        {/* Section 6 */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Statistiques</Text>
          <Text className="text-gray-600">Analyses du réseau professionnel.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ResauxScreen;