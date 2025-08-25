import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderGreeting from '../components/HeaderGreeting';
import ActionPill from '../components/ActionPill';
import JobCard from '../components/JobCard';
import FilterModal from '../components/FilterModal';
import PickupModal from '../components/PickupModal';
import StartTodayModal from '../components/StartTodayModal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/colors';


const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isPickupModalVisible, setIsPickupModalVisible] = useState(false);
  const [isStartTodayModalVisible, setIsStartTodayModalVisible] = useState(false);

  const handleFilterPress = () => {
    setIsFilterModalVisible(true);
  };

  const handleFilterClose = () => {
    setIsFilterModalVisible(false);
  };

  const handleFilterApply = (selectedDates: any) => {
    console.log('Selected dates:', selectedDates);
    // Handle the filter application here
  };

  const handlePickupPress = () => {
    setIsPickupModalVisible(true);
  };

  const handlePickupClose = () => {
    setIsPickupModalVisible(false);
  };

  const handlePickupNext = () => {
    console.log('Pickup next pressed');
    setIsPickupModalVisible(false);
    // Handle pickup next action here
  };

  const handleStartTodayPress = () => {
    setIsStartTodayModalVisible(true);
  };

  const handleStartTodayClose = () => {
    setIsStartTodayModalVisible(false);
  };

  const handleStartTodayConfirm = () => {
    console.log('Start today confirmed');
    setIsStartTodayModalVisible(false);
    // Handle start today confirmation here
  };

  return (
    <View className="flex-1 bg-backgroundScreen">
      {/* Header + buttons area (keeps page padding) */}
      <View className="px-6 pt-6">
        <HeaderGreeting
          subtitle="Hello, Welcome 👋"
        />

        <Text className="text-xl font-poppins-semibold mt-8">Job Lists</Text>

        <View className="mt-4 gap-4 flex-col items-center mb-2">
          <ActionPill
            label="Pick Up"
            size="lg"
            textClassName="font-poppins-semibold text-base mt-2 mb-2"
            rightIcon={<MaterialIcons name="my-location" size={24} color="#fff" />}
            bubbleClassName="bg-white/20 rounded-full"
            className="w-64 h-16"
            onPress={handlePickupPress}
          />

          <ActionPill
            label="Start Today Shift"
            textClassName="font-poppins-semibold text-base mt-2 mb-2"
            size="lg"
            rightIcon={
              <View className="bg-white/20 rounded-lg ">
                <MaterialIcons name="arrow-forward" size={26} color="#fff" />
              </View>
            }
            bubbleClassName=""
            className="w-80 h-16"
            onPress={handleStartTodayPress}
          />
        </View>
      </View>

      {/* FULL-WIDTH, FULL-HEIGHT SHEET BELOW THE HEADER */}
      <View
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 65, top: 540
        }}

      >
        <View className="flex-1 bg-white border border-containerGray pt-6 pb-6" style={{
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}>
          {/* optional tiny dot/handle on top */}
          <View className="absolute -top-2 left-1/2 -ml-2 w-4 h-4  bg-backgroundScreen opacity-70" />

          <View className="flex-row items-center justify-between px-6">
            <Text className="text-base font-poppins-bold text-gray-900">TO DO</Text>
            <TouchableOpacity onPress={handleFilterPress}>
              <Ionicons name="filter-circle-outline" size={35} color={COLORS.primaryGreen} />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 4 }}
          >
            <JobCard title="Anytime" address="221B Baker Street London" status="ended" />
            <JobCard title="Warehouse" address="Wayne Manor" status="inprogress" />
            <JobCard title="Morning" address="42 Wallaby Way" status="new" />
          </ScrollView>
        </View>
      </View>

      {/* Filter Modal */}
      <FilterModal
        visible={isFilterModalVisible}
        onClose={handleFilterClose}
        onApply={handleFilterApply}
      />

      {/* Pickup Modal */}
      <PickupModal
        visible={isPickupModalVisible}
        onClose={handlePickupClose}
        onNext={handlePickupNext}
      />

      {/* Start Today Modal */}
      <StartTodayModal
        visible={isStartTodayModalVisible}
        onClose={handleStartTodayClose}
        onConfirm={handleStartTodayConfirm}
      />
    </View>
  );
};

export default DashboardScreen;
