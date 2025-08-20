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
    showStatusBadge?: boolean; // New prop to control whether to show status or proof badge
};

const TippingCard: React.FC<{ item: TippingItem }> = ({ item }) => {
    return (
        <View className="flex-col w-full bg-white   p-4 mb-4">
            {/* TOP AREA: title/status/subline */}
            <View className="relative">
                {/* Title */}
                <Text className="font-poppins-semibold text-sm text-gray-900">
                    {item.requestLabel}
                </Text>

                {/* Status row */}
                {item.approvedOn ? (
                    <View className="flex-row items-center mt-3 ">
                        <AntDesign name="clockcircleo" size={16} color={COLORS.primaryGreen} />
                        <Text className="ml-2 text-primaryGreen font-poppins-medium text-sm ">
                            {item.approvedOn}
                        </Text>
                    </View>
                ) : null}

                {/* Subline and badge on same line */}
                <View className="flex-row items-center justify-between mt-3">
                    {item.subline ? (
                        <Text className="text-gray-700 font-poppins-medium text-xs flex-1 pr-2">{item.subline}</Text>
                    ) : <View className="flex-1" />}

                    {item.showStatusBadge ? (
                        <View
                            className="px-3 py-1.5 rounded"
                            style={{
                                backgroundColor: item.status === 'approved' ? '#8CC04420' :
                                    item.status === 'pending' ? '#F59E0B20' :
                                        item.status === 'rejected' ? '#EF444420' : '#6B728020'
                            }}
                        >
                            <Text
                                className="font-poppins-regular text-sm"
                                style={{
                                    color: item.status === 'approved' ? '#8CC044' :
                                        item.status === 'pending' ? '#F59E0B' :
                                            item.status === 'rejected' ? '#EF4444' : '#6B7280'
                                }}
                            >
                                {item.status === 'approved' ? 'Approved' :
                                    item.status === 'pending' ? 'Pending' :
                                        item.status === 'rejected' ? 'Rejected' : 'Unknown'}
                            </Text>
                        </View>
                    ) : item.proofUploaded ? (
                        <TouchableOpacity
                            onPress={item.onPressProof}
                            activeOpacity={0.9}
                            className="px-3 py-1.5 rounded bg-orangebck"
                        >
                            <Text className="text-orange font-poppins-regular text-sm">Proof uploaded</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        </View>
    );
};

export default TippingCard;
