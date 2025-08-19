import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import HeaderGreeting from '../components/HeaderGreeting';
import ActionPill from '../components/ActionPill';
import JobCard from '../components/JobCard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';            // 'my-location'


const DashboardScreen: React.FC = () => {
  return (
    <ScrollView className="flex-1 bg-backgroundScreen" contentContainerStyle={{ paddingBottom: 120 }}>
      <View className="p-6">
        {/* Greeting header */}
        <HeaderGreeting
          name="John Doe"
          subtitle="Hello, Welcome 👋"
          onBellPress={() => { }}
        />

        {/* Title */}
        <Text className="text-xl font-poppins-bold mt-6">Job Lists</Text>


        <View className="mt-4 gap-3 flex-col items-center">
          {/* Pick Up — my-location icon */}
          <ActionPill
            label="Pick Up"
            size="lg"
            rightIcon={<MaterialIcons name="my-location" size={20} color="#fff" />}
            bubbleClassName="bg-white/20 rounded-full"
            className="w-64 self-center"     // ~256px wide and centered
            onPress={() => { }}
          />

          {/* Start Today Shift — square arrow right */}
          <ActionPill
            label="Start Today Shift"
            size="lg"
            rightIcon={
              <View className="bg-white/20 rounded-lg p-1">
                <MaterialIcons
                  name="arrow-forward"
                  size={22}
                  color="#fff"
                />
              </View>
            }
            bubbleClassName=""
            className="w-72 self-start " // positioned slightly to the left of center
            onPress={() => { }}
          />
        </View>


        {/* --- TO DO / Horizontal cards --- */}
        <View className="mt-8">
          {/* header row */}
          <View className="flex-row items-center justify-between mb-2 px-1 mt-8">
            <Text className="text-base font-poppins-bold text-gray-900">TO DO</Text>
            <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
              <Text className="text-gray-700"></Text>
            </View>
          </View>

          {/* curved container feel (soft top border) */}
          <View className="rounded-3xl bg-white border border-containerGray pt-6 pb-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              <JobCard
                title="Anytime"
                address="221B Baker Street London"
                status="ended"
              />
              <JobCard
                title="Warehouse"
                address="Wayne Manor"
                status="inprogress"
              />
              <JobCard
                title="Morning"
                address="42 Wallaby Way"
                status="new"
              />
            </ScrollView>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;
