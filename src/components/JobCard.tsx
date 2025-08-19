import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';

type Props = {
    title: string;
    address: string;
    status?: 'ended' | 'new' | 'inprogress';
    onPress?: () => void;
    imageUri?: string;
};

const statusStyle = (s?: Props['status']) => {
    switch (s) {
        case 'ended':
            return { badgeBg: 'bg-red-100', badgeText: 'text-red-600', label: 'Ended' };
        case 'inprogress':
            return { badgeBg: 'bg-amber-100', badgeText: 'text-amber-700', label: 'In progress' };
        default:
            return { badgeBg: 'bg-green-100', badgeText: 'text-green-700', label: 'New' };
    }
};

const JobCard: React.FC<Props> = ({ title, address, status = 'ended', onPress, imageUri }) => {
    const s = statusStyle(status);
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            className="w-64 mr-4 rounded-2xl bg-white border border-containerGray overflow-hidden"
        >
            <Image
                source={
                    imageUri
                        ? { uri: imageUri }
                        : { uri: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80' }
                }
                className="w-full h-28"
            />

            <View className="p-3">
                <View className="flex-row items-center justify-between">
                    <AntDesign name="clockcircleo" size={14} color={COLORS.primaryGreen} />

                    <Text className="font-poppins-bold text-base text-gray-900">{title}</Text>
                    <Ionicons name="ellipsis-horizontal" size={18} color="#687076" />
                </View>

                <View className="flex-row items-center mt-1">
                    <Ionicons name="location-outline" size={14} color="#8E9BAA" />
                    <Text className="ml-1 text-gray text-sm" numberOfLines={1}>
                        {address}
                    </Text>
                </View>

                <View className="mt-2 self-start px-2.5 py-1 rounded-lg flex-row items-center gap-1
                          bg-gray-100">
                    {/* status pill */}
                    <View className={`px-2 py-0.5 rounded ${s.badgeBg}`}>
                        <Text className={`text-xs ${s.badgeText}`}>{s.label}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default JobCard;
