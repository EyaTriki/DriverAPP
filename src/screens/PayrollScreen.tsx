import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, ScrollView, Alert } from 'react-native';
import { ArrowRight2 } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import FilterModal from '../components/FilterModal';
import {
    usePayrollStore,
    formatCurrency,
    formatHours,
    formatDate,
    getStatusColor,
    getStatusText,
    calculateTotalEarnings,
    calculateTotalHours
} from '../stores/payrollStore';

interface PayrollScreenProps {
    navigation: any;
    route: any;
}

const PayrollScreen: React.FC<PayrollScreenProps> = () => {
    const navigation = useNavigation<any>();
    const [showFilterModal, setShowFilterModal] = useState(false);

    // Payroll store
    const {
        records,
        isLoading,
        error,
        fetchPayrollRecords,
        clearError
    } = usePayrollStore();

    // Fetch payroll records on component mount
    useEffect(() => {
        fetchPayrollRecords();
    }, [fetchPayrollRecords]);

    // Use all records for now - filtering will be handled by FilterModal
    const filteredRecords = records || [];

    // Calculate totals for filtered records
    const totalEarnings = calculateTotalEarnings(filteredRecords);
    const totalHours = calculateTotalHours(filteredRecords);

    const handleFilterApply = (selectedDates: any) => {
        setShowFilterModal(false);
        // Filter is automatically applied through useMemo
        console.log('Filter applied:', { selectedDates });
    };

    // Handle error display
    useEffect(() => {
        if (error) {
            Alert.alert('Error', error, [
                { text: 'OK', onPress: clearError }
            ]);
        }
    }, [error, clearError]);

    return (
        <View className="flex-1 bg-backgroundScreen">
            {/* Header */}
            <View className="pt-12 pb-6 px-5">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="w-10 h-10 rounded-full bg-[#8CC044] items-center justify-center mr-4"
                        >
                            <ArrowRight2 size={20} color="#FFFFFF" variant="Outline" style={{ transform: [{ rotate: '180deg' }] }} />
                        </TouchableOpacity>
                        <View>
                            <Text className="text-xl font-bold text-gray-900">Payroll</Text>
                            <Text className="text-sm text-gray-600">View your earnings</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => setShowFilterModal(true)}
                        className="w-10 h-10 rounded-full bg-[#8CC044] items-center justify-center"
                    >
                        <Text className="text-white font-bold text-lg">⋮</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Loading State */}
                {isLoading && (
                    <View className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <Text className="text-gray-600 text-center">Loading payroll records...</Text>
                    </View>
                )}

                {/* Payroll Summary Card */}
                {!isLoading && (
                    <View className="bg-white rounded-2xl p-6 shadow-sm mb-4">
                        <Text className="text-lg font-bold text-gray-900 mb-4">Payroll Summary</Text>

                        <View className="space-y-3">
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Period:</Text>
                                <Text className="text-gray-900 font-medium">All Records</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Total Hours:</Text>
                                <Text className="text-gray-900 font-medium">{formatHours(totalHours)}</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Records Found:</Text>
                                <Text className="text-gray-900 font-medium">{filteredRecords.length}</Text>
                            </View>
                        </View>

                        <View className="border-t border-gray-200 my-4" />

                        <View className="flex-row justify-between">
                            <Text className="text-lg font-bold text-gray-900">Total Earnings:</Text>
                            <Text className="text-blue-600 text-lg font-bold">{formatCurrency(totalEarnings)}</Text>
                        </View>
                    </View>
                )}

                {/* Payroll Records List */}
                {!isLoading && filteredRecords.length > 0 && (
                    <View className="space-y-4">
                        <Text className="text-lg font-bold text-gray-900">Payroll Records</Text>
                        {filteredRecords.map((record, index) => (
                            <View key={record._id} className="bg-white rounded-2xl p-6 shadow-sm">
                                <View className="flex-row justify-between items-start mb-3">
                                    <Text className="text-lg font-bold text-gray-900">
                                        Record #{index + 1}
                                    </Text>
                                    <View
                                        className="px-3 py-1 rounded-full"
                                        style={{ backgroundColor: getStatusColor(record.status) + '20' }}
                                    >
                                        <Text
                                            className="text-sm font-medium"
                                            style={{ color: getStatusColor(record.status) }}
                                        >
                                            {getStatusText(record.status)}
                                        </Text>
                                    </View>
                                </View>

                                <View className="space-y-2">
                                    <View className="flex-row justify-between">
                                        <Text className="text-gray-600">Date:</Text>
                                        <Text className="text-gray-900 font-medium">
                                            {formatDate(record.startTime)}
                                        </Text>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text className="text-gray-600">Start Time:</Text>
                                        <Text className="text-gray-900 font-medium">
                                            {new Date(record.startTime).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </Text>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text className="text-gray-600">End Time:</Text>
                                        <Text className="text-gray-900 font-medium">
                                            {new Date(record.endTime).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </Text>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text className="text-gray-600">Hours Worked:</Text>
                                        <Text className="text-gray-900 font-medium">
                                            {formatHours(record.totalHours)}
                                        </Text>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text className="text-gray-600">Hourly Rate:</Text>
                                        <Text className="text-gray-900 font-medium">
                                            {formatCurrency(record.hourlyRate)}
                                        </Text>
                                    </View>
                                </View>

                                <View className="border-t border-gray-200 my-4" />

                                <View className="flex-row justify-between">
                                    <Text className="text-lg font-bold text-gray-900">Amount:</Text>
                                    <Text className="text-blue-600 text-lg font-bold">
                                        {formatCurrency(record.totalAmount)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Empty State */}
                {!isLoading && filteredRecords.length === 0 && (
                    <View className="mt-8 p-8 bg-gray-50 rounded-lg">
                        <Text className="text-gray-500 text-center text-lg">No payroll records found</Text>
                        <Text className="text-gray-400 text-center text-sm mt-2">
                            No records found.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Filter Modal */}
            <FilterModal
                visible={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                onApply={handleFilterApply}
            />
        </View>
    );
};

export default PayrollScreen;
