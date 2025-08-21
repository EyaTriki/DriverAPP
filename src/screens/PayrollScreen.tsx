import React, { useState, useEffect, useMemo } from 'react';
import { TouchableOpacity, View, Text, Modal, ScrollView, Alert } from 'react-native';
import { ArrowRight2 } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { 
    usePayrollStore, 
    PayrollRecord, 
    formatCurrency, 
    formatHours, 
    formatDate,
    getStatusColor,
    getStatusText,
    calculateTotalEarnings,
    calculateTotalHours,
    getRecordsForMonth
} from '../stores/payrollStore';

interface PayrollScreenProps {
    navigation: any;
    route: any;
}

const PayrollScreen: React.FC<PayrollScreenProps> = () => {
    const navigation = useNavigation<any>();
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('Custom');
    const [selectedDates, setSelectedDates] = useState<{ [key: string]: any }>({});
    const [isSelectingEndDate, setIsSelectingEndDate] = useState(false);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    // Payroll store
    const { 
        records, 
        isLoading, 
        error, 
        fetchPayrollRecords, 
        clearError 
    } = usePayrollStore();

    const periods = ['Day', 'Week', 'Month', 'Year', 'Custom'];

    // Fetch payroll records on component mount
    useEffect(() => {
        fetchPayrollRecords();
    }, []);

    // Filter records based on selected period and dates
    const filteredRecords = useMemo(() => {
        if (!records || records.length === 0) {
            return [];
        }

        if (selectedPeriod === 'Custom' && startDate && endDate) {
            return records.filter(record => {
                if (!record.startTime) return false;
                try {
                    const recordDate = new Date(record.startTime);
                    if (isNaN(recordDate.getTime())) return false;
                    return recordDate >= startDate && recordDate <= endDate;
                } catch (error) {
                    return false;
                }
            });
        }
        
        const now = new Date();
        switch (selectedPeriod) {
            case 'Day':
                return records.filter(record => {
                    if (!record.startTime) return false;
                    try {
                        const recordDate = new Date(record.startTime);
                        if (isNaN(recordDate.getTime())) return false;
                        return recordDate.toDateString() === now.toDateString();
                    } catch (error) {
                        return false;
                    }
                });
            case 'Week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return records.filter(record => {
                    if (!record.startTime) return false;
                    try {
                        const recordDate = new Date(record.startTime);
                        if (isNaN(recordDate.getTime())) return false;
                        return recordDate >= weekAgo;
                    } catch (error) {
                        return false;
                    }
                });
            case 'Month':
                return getRecordsForMonth(records, now.getFullYear(), now.getMonth());
            case 'Year':
                return records.filter(record => {
                    if (!record.startTime) return false;
                    try {
                        const recordDate = new Date(record.startTime);
                        if (isNaN(recordDate.getTime())) return false;
                        return recordDate.getFullYear() === now.getFullYear();
                    } catch (error) {
                        return false;
                    }
                });
            default:
                return records;
        }
    }, [records, selectedPeriod, startDate, endDate]);

    // Calculate totals for filtered records
    const totalEarnings = calculateTotalEarnings(filteredRecords || []);
    const totalHours = calculateTotalHours(filteredRecords || []);

    // Get current record for display (most recent)
    const currentRecord = filteredRecords[0] || records[0];

    const handleCalendarDayPress = (day: any) => {
        const dateString = day.dateString;
        const selectedDate = new Date(dateString);

        console.log('Calendar day pressed:', {
            dateString,
            selectedDate: selectedDate.toISOString(),
            isSelectingEndDate,
            currentStartDate: startDate.toISOString()
        });

        if (!isSelectingEndDate) {
            // Selecting start date
            setStartDate(selectedDate);
            setSelectedDates({
                [dateString]: {
                    selected: true,
                    startingDay: true,
                    color: '#8CC044',
                }
            });
            setIsSelectingEndDate(true);
        } else {
            // Selecting end date
            if (selectedDate >= startDate) {
                setEndDate(selectedDate);

                // Create range marking for all dates in between
                const newSelectedDates: { [key: string]: any } = {};
                const currentDate = new Date(startDate);
                const startDateString = startDate.toISOString().split('T')[0];

                while (currentDate <= selectedDate) {
                    const currentDateString = currentDate.toISOString().split('T')[0];
                    const isStartDate = currentDateString === startDateString;
                    const isEndDate = currentDateString === dateString;

                    newSelectedDates[currentDateString] = {
                        selected: true,
                        color: '#8CC044',
                        startingDay: isStartDate,
                        endingDay: isEndDate,
                    };
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                setSelectedDates(newSelectedDates);
                setIsSelectingEndDate(false);
            } else {
                // If end date is before start date, show alert and reset
                Alert.alert(
                    'Invalid Date Range',
                    'End date must be after or equal to start date. Please select a valid end date.',
                    [{ text: 'OK' }]
                );
            }
        }
    };

    const handlePeriodSelect = (period: string) => {
        setSelectedPeriod(period);
        if (period !== 'Custom') {
            // Reset calendar selection for predefined periods
            setSelectedDates({});
            setIsSelectingEndDate(false);
            // Reset dates to current date for predefined periods
            const now = new Date();
            setStartDate(now);
            setEndDate(now);
        }
    };

    const resetCalendarSelection = () => {
        setSelectedDates({});
        setIsSelectingEndDate(false);
        const now = new Date();
        setStartDate(now);
        setEndDate(now);
    };

    const handleFilterApply = (selectedDates: any) => {
        setShowFilterModal(false);
        // Filter is automatically applied through useMemo
        console.log('Filter applied:', { selectedPeriod, selectedDates });
    };

    // Handle error display
    useEffect(() => {
        if (error) {
            Alert.alert('Error', error, [
                { text: 'OK', onPress: clearError }
            ]);
        }
    }, [error]);

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
                                <Text className="text-gray-900 font-medium">{selectedPeriod}</Text>
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
                            {selectedPeriod === 'Custom' 
                                ? 'No records found for the selected date range.'
                                : `No ${selectedPeriod.toLowerCase()} records found.`
                            }
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Filter Modal */}
            <FilterModal
                visible={showFilterModal}
                transparent
                animationType="slide"
                statusBarTranslucent
                onRequestClose={() => setShowFilterModal(false)}
            >
                <View className="flex-1 justify-end">
                    {/* Backdrop */}
                    <TouchableOpacity
                        onPress={() => setShowFilterModal(false)}
                        className="absolute inset-0 bg-black/50"
                        activeOpacity={1}
                    />

                    {/* Modal Content */}
                    <View className="bg-white rounded-t-3xl p-6">
                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-xl font-bold text-gray-900">Filter by</Text>
                            <TouchableOpacity
                                onPress={() => setShowFilterModal(false)}
                                className="w-8 h-8 items-center justify-center"
                            >
                                <Text className="text-gray-600 font-bold text-lg">×</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Period Selection */}
                        <View className="flex-row space-x-2 mb-6">
                            {periods.map((period) => (
                                <TouchableOpacity
                                    key={period}
                                    onPress={() => handlePeriodSelect(period)}
                                    className={`px-4 py-2 rounded-full ${selectedPeriod === period
                                        ? 'bg-[#8CC044]'
                                        : 'bg-gray-200'
                                        }`}
                                >
                                    <Text
                                        className={`font-medium ${selectedPeriod === period
                                            ? 'text-white'
                                            : 'text-gray-700'
                                            }`}
                                    >
                                        {period}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Calendar */}
                        <View className="mb-6">
                            <Calendar
                                theme={{
                                    backgroundColor: '#ffffff',
                                    calendarBackground: '#ffffff',
                                    textSectionTitleColor: '#000000',
                                    selectedDayBackgroundColor: '#8CC044',
                                    selectedDayTextColor: '#ffffff',
                                    todayTextColor: '#8CC044',
                                    dayTextColor: '#000000',
                                    textDisabledColor: '#d9e1e8',
                                    dotColor: '#8CC044',
                                    selectedDotColor: '#ffffff',
                                    arrowColor: '#8CC044',
                                    monthTextColor: '#000000',
                                    indicatorColor: '#8CC044',
                                    textDayFontFamily: 'Poppins-Regular',
                                    textMonthFontFamily: 'Poppins-Bold',
                                    textDayHeaderFontFamily: 'Poppins-Regular',
                                    textDayFontSize: 16,
                                    textMonthFontSize: 18,
                                    textDayHeaderFontSize: 14,
                                }}
                                onDayPress={handleCalendarDayPress}
                                markedDates={selectedDates}
                                enableSwipeMonths={true}
                                markingType="period"
                            />

                            {isSelectingEndDate && (
                                <View className="mt-4">
                                    <Text className="text-sm text-gray-600 text-center">
                                        Now select the end date for your filter period
                                    </Text>
                                </View>
                            )}

                            {/* Reset Button */}
                            {Object.keys(selectedDates).length > 0 && (
                                <TouchableOpacity
                                    onPress={resetCalendarSelection}
                                    className="mt-4 py-2 px-4 bg-gray-200 rounded-lg self-center"
                                >
                                    <Text className="text-gray-700 font-medium">Reset Selection</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Apply Button */}
                        <TouchableOpacity
                            onPress={handleApplyFilter}
                            className="bg-[#8CC044] py-4 rounded-xl items-center"
                        >
                            <Text className="text-white font-semibold text-lg">Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default PayrollScreen;
