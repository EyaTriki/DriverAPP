import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const DashboardScreen = () => (
  <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 100 }}>
    <View className="p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-6">Dashboard</Text>

      {/* Section 1 */}
      <View className="bg-gray-50 rounded-xl p-4 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Section 1</Text>
        <Text className="text-gray-600">Contenu de la première section du dashboard.</Text>
      </View>

      {/* Section 2 */}
      <View className="bg-gray-50 rounded-xl p-4 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Section 2</Text>
        <Text className="text-gray-600">Contenu de la deuxième section du dashboard.</Text>
      </View>

      {/* Section 3 */}
      <View className="bg-gray-50 rounded-xl p-4 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Section 3</Text>
        <Text className="text-gray-600">Contenu de la troisième section du dashboard.</Text>
      </View>

      {/* Section 4 */}
      <View className="bg-gray-50 rounded-xl p-4 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Section 4</Text>
        <Text className="text-gray-600">Contenu de la quatrième section du dashboard.</Text>
      </View>

      {/* Section 5 */}
      <View className="bg-gray-50 rounded-xl p-4 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Section 5</Text>
        <Text className="text-gray-600">Contenu de la cinquième section du dashboard.</Text>
      </View>

      {/* Section 6 */}
      <View className="bg-gray-50 rounded-xl p-4 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Section 6</Text>
        <Text className="text-gray-600">Contenu de la sixième section du dashboard.</Text>
      </View>

      {/* Section 7 */}
      <View className="bg-gray-50 rounded-xl p-4 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Section 7</Text>
        <Text className="text-gray-600">Contenu de la septième section du dashboard.</Text>
      </View>

      {/* Section 8 */}
      <View className="bg-gray-50 rounded-xl p-4 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Section 8</Text>
        <Text className="text-gray-600">Contenu de la huitième section du dashboard.</Text>
      </View>
    </View>
  </ScrollView>
);

export default DashboardScreen;
