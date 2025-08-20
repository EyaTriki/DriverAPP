import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../constants/colors';

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

const shadow = {
    elevation: 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
};

const JobCard: React.FC<Props> = ({ title, address, status = 'ended', onPress, imageUri }) => {
    const s = statusStyle(status);

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress} className="mr-4 ">
            <View
                className="w-73 rounded-2xl bg-white border border-containerGray px-4 py-4 flex-row items-center "
                style={shadow}
            >
                {/* Left thumbnail */}
                <Image
                    source={{
                        uri: imageUri
                            ? imageUri
                            : 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=160&q=80',
                    }}
                    style={{ width: 80, height: 64, borderRadius: 12 }}  // ← explicit size
                    resizeMode="cover"
                    onError={(e) => console.warn('Image load error:', e.nativeEvent.error)}
                />


                {/* Text block */}
                <View className="flex-1 ml-4">
                    {/* Title row */}
                    <View className="flex-row items-center">
                        <AntDesign name="clockcircleo" size={16} color={COLORS.primaryGreen} />
                        <Text className="ml-2 font-poppins-medium text-[16px] text-gray-900" numberOfLines={1}>
                            {title}
                        </Text>
                    </View>

                    {/* Address row */}
                    <View className="mt-1 flex-row items-center">
                        <Ionicons name="location-outline" size={17} color="#8E9BAA" className='self-end' />
                        <Text className="ml-1 font-poppins-medium text-[12px] text-gray-800" numberOfLines={1}>
                            {address}
                        </Text>
                    </View>

                    {/* Status pill */}
                    <View className="mt-2 self-start">
                        <View className={`px-2.5 py-1 rounded-lg ${s.badgeBg}`}>
                            <Text className={`font-poppins-medium text-[9px]  ${s.badgeText}`}>{s.label}</Text>
                        </View>
                    </View>
                </View>

                {/* Right chevron button */}
                <TouchableOpacity
                    className="ml-3 mt-10 w-9 h-9 rounded-full border border-containerGray bg-white items-center justify-center self-end"
                    activeOpacity={0.8}
                >
                    <Ionicons name="chevron-forward" size={18} color="#687076" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

export default JobCard;
