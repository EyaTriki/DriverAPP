import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../constants';

export type TippingItem = {
    id: string;
    status: 'approved' | 'pending' | 'rejected';
    requestLabel: string;
    approvedOn?: string;
    subline?: string;
    proofUploaded?: boolean;
    onPressProof?: () => void;
};

const TippingCard: React.FC<{ item: TippingItem }> = ({ item }) => {
    return (
        <View className="flex-col w-full bg-white   p-4 mb-4">
            {/* TOP AREA: title/status/subline + pill pinned inside same column */}
            <View className="relative">
                {/* Title (reserve space on the right for the pill) */}
                <Text className="font-semibold text-gray-900 pr-28">
                    {item.requestLabel}
                </Text>

                {/* Pill pinned to top-right */}
                {item.proofUploaded ? (
                    <TouchableOpacity
                        onPress={item.onPressProof}
                        activeOpacity={0.9}
                        className="absolute right-0 bottom-0 px-3 py-1.5 rounded bg-orangebck"
                    >
                        <Text className="text-orange font-medium ">Proof uploaded</Text>
                    </TouchableOpacity>
                ) : null}

                {/* Status row */}
                {item.approvedOn ? (
                    <View className="flex-row items-center mt-3">
                        <AntDesign name="clockcircleo" size={16} color={COLORS.primaryGreen} />
                        <Text className="ml-2 text-primaryGreen font-medium">
                            {item.approvedOn}
                        </Text>
                    </View>
                ) : null}

                {/* Subline */}
                {item.subline ? (
                    <Text className="text-gray-700 mt-3 ">{item.subline}</Text>
                ) : null}
            </View>
        </View>
    );
};

export default TippingCard;
