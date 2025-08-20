// ChatScreen.tsx
import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Modal } from 'react-native';
import { ArrowRight2 } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';

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
    const [_endDate, setEndDate] = useState<Date>(new Date());

    const periods = ['Day', 'Week', 'Month', 'Year', 'Custom'];

    const handleCalendarDayPress = (day: any) => {
        const dateString = day.dateString;
        const selectedDate = new Date(dateString);

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
            }
        }
    };

    const handlePeriodSelect = (period: string) => {
        setSelectedPeriod(period);
        if (period !== 'Custom') {
            // Reset calendar selection for predefined periods
            setSelectedDates({});
            setIsSelectingEndDate(false);
        }
    };

    const handleApplyFilter = () => {
        setShowFilterModal(false);
        // Handle filter application here
        console.log('Filter applied:', { selectedPeriod, selectedDates });
    };

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
                            <Text className="text-xl font-bold text-gray-900">Documents</Text>
                            <Text className="text-sm text-gray-600">Payroll</Text>
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

            {/* Payroll Card */}
            <View className="px-5">
                <View className="bg-white rounded-2xl p-6 shadow-sm">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Payroll Details</Text>

                    <View className="space-y-3">
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Date:</Text>
                            <Text className="text-gray-900 font-medium">2025-05-01</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Total Hours:</Text>
                            <Text className="text-gray-900 font-medium">13.25</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Regular Hours:</Text>
                            <Text className="text-gray-900 font-medium">8</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Extra Hours:</Text>
                            <Text className="text-gray-900 font-medium">5.25</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Status:</Text>
                            <Text className="text-[#8CC044] font-medium">Paid</Text>
                        </View>
                    </View>

                    <View className="border-t border-gray-200 my-4" />

                    <View className="flex-row justify-between">
                        <Text className="text-lg font-bold text-gray-900">Total Salary:</Text>
                        <Text className="text-blue-600 text-lg font-bold">$50</Text>
                    </View>
                </View>

                {/* Pagination Dots */}
                <View className="flex-row justify-center mt-6 space-x-2">
                    {[1, 2, 3, 4, 5].map((dot) => (
                        <View
                            key={dot}
                            className={`w-2 h-2 rounded-full ${dot === 2 ? 'bg-[#8CC044]' : 'bg-gray-300'
                                }`}
                        />
                    ))}
                </View>
            </View>

            {/* Filter Modal */}
            <Modal
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
