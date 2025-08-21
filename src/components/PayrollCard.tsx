import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';

export type PayrollItem = {
    id: string;
    date: string;
    totalHours: number;
    regularHours: number;
    extraHours: number;
    status: 'paid' | 'pending' | 'processing';
    totalSalary: number;
    currency?: string;
    onPress?: () => void;
};

interface PayrollCardProps {
    item: PayrollItem;
    isActive?: boolean;
    onPress?: () => void;
}

const PayrollCard: React.FC<PayrollCardProps> = ({ item, isActive = false, onPress }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return COLORS.primaryGreen;
            case 'pending':
                return '#F59E0B';
            case 'processing':
                return '#3B82F6';
            default:
                return '#6B7280';
        }
    };

    const getStatusBackground = (status: string) => {
        switch (status) {
            case 'paid':
                return '#8CC04420';
            case 'pending':
                return '#F59E0B20';
            case 'processing':
                return '#3B82F620';
            default:
                return '#6B728020';
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress || item.onPress}
            activeOpacity={0.9}
            className={`w-96 bg-white rounded-2xl p-12 min-h-80`}
        >
            <View className="space-y-6">
                <View className="flex-row justify-between">
                    <Text className="text-gray-900 font-semibold">{item.date}</Text>
                    <Text className="text-gray-600 font-medium">Date:</Text>
                </View>

                <View className="flex-row justify-between">
                    <Text className="text-gray-900 font-semibold">{item.totalHours}h</Text>
                    <Text className="text-gray-600 font-medium">Total Hours:</Text>
                </View>

                <View className="flex-row justify-between">
                    <Text className="text-gray-900 font-semibold">{item.regularHours}h</Text>
                    <Text className="text-gray-600 font-medium">Regular Hours:</Text>
                </View>

                <View className="flex-row justify-between">
                    <Text className="text-gray-900 font-semibold">{item.extraHours}h</Text>
                    <Text className="text-gray-600 font-medium">Extra Hours:</Text>
                </View>

                <View className="flex-row justify-between">
                    <Text
                        className="font-semibold"
                        style={{ color: getStatusColor(item.status) }}
                    >
                        {item.status}
                    </Text>
                    <Text className="text-gray-600 font-medium">Status:</Text>
                </View>
            </View>

            <View className="border-t border-gray-200 my-6" />

            <View className="flex-row justify-between items-center">
                <Text className="text-blue-600 text-xl font-bold">
                    {item.currency || '$'}{item.totalSalary}
                </Text>
                <Text className="text-lg font-bold text-gray-900">Total Salary:</Text>
            </View>
        </TouchableOpacity>
    );
};

export default PayrollCard;
