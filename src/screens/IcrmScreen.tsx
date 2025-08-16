import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MessageCircle, SearchNormal, More } from 'iconsax-react-native';

const IcrmScreen: React.FC = () => {
  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="p-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-800">Messages</Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity className="p-2">
              <SearchNormal size={24} color="#666" variant="Outline" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2">
              <More size={24} color="#666" variant="Outline" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Conversations */}
        <View className="space-y-4">
          {/* Conversation 1 */}
          <TouchableOpacity className="bg-gray-50 rounded-xl p-4 flex-row items-center">
            <View className="w-12 h-12 bg-green-100 rounded-full justify-center items-center mr-4">
              <Text className="text-green-600 font-bold text-lg">JD</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-gray-800 font-semibold text-base">John Driver</Text>
                <Text className="text-gray-400 text-sm">14:30</Text>
              </View>
              <Text className="text-gray-600 text-sm" numberOfLines={1}>
                Bonjour, avez-vous des nouvelles sur le projet ?
              </Text>
            </View>
            <View className="w-3 h-3 bg-red-500 rounded-full ml-2"></View>
          </TouchableOpacity>

          {/* Conversation 2 */}
          <TouchableOpacity className="bg-gray-50 rounded-xl p-4 flex-row items-center">
            <View className="w-12 h-12 bg-blue-100 rounded-full justify-center items-center mr-4">
              <Text className="text-blue-600 font-bold text-lg">ML</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-gray-800 font-semibold text-base">Marie Logistics</Text>
                <Text className="text-gray-400 text-sm">12:15</Text>
              </View>
              <Text className="text-gray-600 text-sm" numberOfLines={1}>
                La livraison est confirmée pour demain matin
              </Text>
            </View>
          </TouchableOpacity>

          {/* Conversation 3 */}
          <TouchableOpacity className="bg-gray-50 rounded-xl p-4 flex-row items-center">
            <View className="w-12 h-12 bg-purple-100 rounded-full justify-center items-center mr-4">
              <Text className="text-purple-600 font-bold text-lg">PS</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-gray-800 font-semibold text-base">Paul Support</Text>
                <Text className="text-gray-400 text-sm">10:45</Text>
              </View>
              <Text className="text-gray-600 text-sm" numberOfLines={1}>
                Besoin d'assistance technique pour le système
              </Text>
            </View>
            <View className="w-3 h-3 bg-red-500 rounded-full ml-2"></View>
          </TouchableOpacity>

          {/* Conversation 4 */}
          <TouchableOpacity className="bg-gray-50 rounded-xl p-4 flex-row items-center">
            <View className="w-12 h-12 bg-orange-100 rounded-full justify-center items-center mr-4">
              <Text className="text-orange-600 font-bold text-lg">AM</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-gray-800 font-semibold text-base">Anna Manager</Text>
                <Text className="text-gray-400 text-sm">09:20</Text>
              </View>
              <Text className="text-gray-600 text-sm" numberOfLines={1}>
                Réunion d'équipe prévue à 15h aujourd'hui
              </Text>
            </View>
          </TouchableOpacity>

          {/* Conversation 5 */}
          <TouchableOpacity className="bg-gray-50 rounded-xl p-4 flex-row items-center">
            <View className="w-12 h-12 bg-pink-100 rounded-full justify-center items-center mr-4">
              <Text className="text-pink-600 font-bold text-lg">SC</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-gray-800 font-semibold text-base">Sarah Client</Text>
                <Text className="text-gray-400 text-sm">Hier</Text>
              </View>
              <Text className="text-gray-600 text-sm" numberOfLines={1}>
                Merci pour votre excellent service !
              </Text>
            </View>
          </TouchableOpacity>

          {/* Conversation 6 */}
          <TouchableOpacity className="bg-gray-50 rounded-xl p-4 flex-row items-center">
            <View className="w-12 h-12 bg-teal-100 rounded-full justify-center items-center mr-4">
              <Text className="text-teal-600 font-bold text-lg">TC</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-gray-800 font-semibold text-base">Tom Coordinator</Text>
                <Text className="text-gray-400 text-sm">Hier</Text>
              </View>
              <Text className="text-gray-600 text-sm" numberOfLines={1}>
                Documents de transport à récupérer
              </Text>
            </View>
            <View className="w-3 h-3 bg-red-500 rounded-full ml-2"></View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View className="mt-8">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity className="flex-1 bg-green-50 rounded-xl p-4 items-center">
              <MessageCircle size={24} color="#10B981" variant="Linear" />
              <Text className="text-green-600 font-medium text-sm mt-2">Nouveau message</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-blue-50 rounded-xl p-4 items-center">
              <View className="w-6 h-6 bg-blue-500 rounded-full justify-center items-center">
                <Text className="text-white font-bold text-xs">+</Text>
              </View>
              <Text className="text-blue-600 font-medium text-sm mt-2">Nouveau groupe</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default IcrmScreen;
