import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../constants/colors';

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (selectedDates: any) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply }) => {
    const [selectedPeriod, setSelectedPeriod] = useState('Week');
    const [selectedDates, setSelectedDates] = useState<{ [key: string]: any }>({});

    const periods = ['Day', 'Week', 'Month', 'Year', 'Custom'];

    const handleDayPress = (day: any) => {
        // For now, just mark the day as selected
        // You can implement range selection logic here
        setSelectedDates({
            [day.dateString]: {
                selected: true,
                selectedColor: COLORS.primaryGreen,
            }
        });
    };

    const handleApply = () => {
        onApply(selectedDates);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <View className="absolute inset-0 bg-black/50 justify-end">
                <TouchableOpacity className="flex-1" onPress={onClose} />
                <View className="bg-white rounded-t-2xl px-5 pb-8" style={{ maxHeight: Dimensions.get('window').height * 0.7 }}>
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-5 pt-5">
                        <Text className="text-xl font-poppins-bold text-gray-900">Filter by</Text>
                        <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                            <Ionicons name="close-circle" size={30} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Period Pills */}
                    <View className="flex-row mb-5 gap-2">
                        {periods.map((period) => (
                            <TouchableOpacity
                                key={period}
                                className={`flex-row items-center px-2 py-2 rounded-full gap-2 ${selectedPeriod === period ? 'bg-primaryGreen' : 'bg-gray-100'
                                    }`}
                                onPress={() => setSelectedPeriod(period)}
                            >
                                <FontAwesome
                                    name="check-circle"
                                    size={16}
                                    color={selectedPeriod === period ? '#000' : '#D9D9D9'}
                                />
                                <Text className={`text-sm font-medium ${selectedPeriod === period ? 'text-white' : 'text-gray-500'
                                    }`}>
                                    {period}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Calendar */}
                    <View className="mb-5">
                        <Calendar
                            theme={{
                                backgroundColor: '#ffffff',
                                calendarBackground: '#ffffff',
                                textSectionTitleColor: '#000000',
                                selectedDayBackgroundColor: COLORS.primaryGreen,
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: COLORS.primaryGreen,
                                dayTextColor: '#000000',
                                textDisabledColor: '#d9e1e8',
                                dotColor: COLORS.primaryGreen,
                                selectedDotColor: '#ffffff',
                                arrowColor: COLORS.primaryGreen,
                                monthTextColor: '#000000',
                                indicatorColor: COLORS.primaryGreen,
                                textDayFontFamily: 'Poppins-Regular',
                                textMonthFontFamily: 'Poppins-Bold',
                                textDayHeaderFontFamily: 'Poppins-Regular',
                                textDayFontSize: 16,
                                textMonthFontSize: 18,
                                textDayHeaderFontSize: 14,
                            }}
                            onDayPress={handleDayPress}
                            markedDates={selectedDates}
                            enableSwipeMonths={true}
                        />
                    </View>

                    {/* Apply Button */}
                    <View className="items-center">
                        <TouchableOpacity
                            className="bg-primaryGreen py-3 px-8 rounded-xl items-center"
                            onPress={handleApply}
                        >
                            <Text className="text-white text-sm font-poppins-bold">Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default FilterModal;
