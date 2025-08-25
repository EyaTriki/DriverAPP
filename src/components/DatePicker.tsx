import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import { Calendar } from 'iconsax-react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';

interface DatePickerProps {
    label?: string;
    value?: string; // Date in 'YYYY-MM-DD' format
    onDateChange: (date: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    minimumDate?: string;
    maximumDate?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
    label,
    value,
    onDateChange,
    placeholder = 'Select Date',
    disabled = false,
    className = '',
    minimumDate,
    maximumDate,
}) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;

    const formatDateForDisplay = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    useEffect(() => {
        if (showCalendar && !isClosing) {
            // Opening animation
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [showCalendar, isClosing, slideAnim]);

    const openCalendar = () => {
        if (!disabled) {
            setShowCalendar(true);
            setIsClosing(false);
        }
    };

    const handleDateSelect = (day: any) => {
        onDateChange(day.dateString);
        closeCalendar();
    };

    const closeCalendar = () => {
        setIsClosing(true);
        setShowCalendar(false);
        slideAnim.setValue(0);
    };

    return (
        <View className={`${className}`}>
            {label && (
                <Text className="text-sm font-poppins-medium text-[#374151] mb-2 ">{label}</Text>
            )}

            <TouchableOpacity
                onPress={openCalendar}
                disabled={disabled}
                className={`flex-row items-center justify-between rounded-xl px-4 py-3 bg-white ${disabled ? 'opacity-50' : ''
                    }`}
            >
                <Text className={`flex-1 ${value ? 'text-gray-900' : 'text-gray-500'}`}>
                    {value ? formatDateForDisplay(value) : placeholder}
                </Text>
                <Calendar size={20} color="#6B7280" variant="Outline" />
            </TouchableOpacity>

            <Modal
                transparent={true}
                animationType="none"
                visible={showCalendar}
                onRequestClose={closeCalendar}
            >
                <View className="flex-1 justify-end bg-black bg-black/50">
                    <Animated.View
                        className="bg-white rounded-t-3xl max-h-96"
                        style={{
                            transform: [{
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [400, 0],
                                })
                            }]
                        }}
                    >
                        <View className="flex-row justify-between items-center p-6 border-b border-gray-200">
                            <Text className="text-sm font-poppins-semibold text-[#000] ">
                                {label || 'Select Date'}
                            </Text>
                            <TouchableOpacity
                                onPress={closeCalendar}
                                className="p-2"
                            >
                                <Text className="text-primaryGreen font-semibold">Cancel</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="p-4">
                            <RNCalendar
                                onDayPress={handleDateSelect}
                                markedDates={value ? { [value]: { selected: true, selectedColor: '#8CC044' } } : {}}
                                minDate={minimumDate}
                                maxDate={maximumDate}
                                theme={{
                                    selectedDayBackgroundColor: '#8CC044',
                                    selectedDayTextColor: '#ffffff',
                                    todayTextColor: '#8CC044',
                                    dayTextColor: '#2d3748',
                                    textDisabledColor: '#d1d5db',
                                    arrowColor: '#8CC044',
                                    monthTextColor: '#2d3748',
                                    indicatorColor: '#8CC044',
                                    textDayFontFamily: 'Poppins-Regular',
                                    textMonthFontFamily: 'Poppins-Medium',
                                    textDayHeaderFontFamily: 'Poppins-Medium',
                                    textDayFontSize: 16,
                                    textMonthFontSize: 16,
                                    textDayHeaderFontSize: 13
                                }}
                            />
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
};

export default DatePicker;
