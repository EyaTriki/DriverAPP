// PayrollScreen.tsx
import React, { useRef, useState } from 'react';
import { TouchableOpacity, View, Text, ScrollView, Dimensions } from 'react-native';
import { ArrowRight2 } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { PayrollCard, FilterModal } from '../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants';

interface PayrollScreenProps {
    navigation: any;
    route: any;
}

const PayrollScreen: React.FC<PayrollScreenProps> = () => {
    const navigation = useNavigation<any>();
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [currentPayrollIndex, setCurrentPayrollIndex] = useState(1);
    const scrollRef = useRef<ScrollView>(null);

    // Sample payroll data
    const payrollData = [
        {
            id: '1',
            date: '2025-05-01',
            totalHours: 13.25,
            regularHours: 8,
            extraHours: 5.25,
            status: 'paid' as const,
            totalSalary: 50,
            currency: '$'
        },
        {
            id: '2',
            date: '2025-04-24',
            totalHours: 10.5,
            regularHours: 8,
            extraHours: 2.5,
            status: 'paid' as const,
            totalSalary: 42,
            currency: '$'
        },
        {
            id: '3',
            date: '2025-04-17',
            totalHours: 12,
            regularHours: 8,
            extraHours: 4,
            status: 'processing' as const,
            totalSalary: 48,
            currency: '$'
        },
        {
            id: '4',
            date: '2025-04-10',
            totalHours: 9.75,
            regularHours: 8,
            extraHours: 1.75,
            status: 'pending' as const,
            totalSalary: 39,
            currency: '$'
        },
        {
            id: '5',
            date: '2025-04-03',
            totalHours: 11.5,
            regularHours: 8,
            extraHours: 3.5,
            status: 'paid' as const,
            totalSalary: 46,
            currency: '$'
        }
    ];

    const handleFilterClose = () => {
        setShowFilterModal(false);
    };

    const handleFilterApply = (selectedDates: any) => {
        setShowFilterModal(false);
        // Handle filter application here
        console.log('Filter applied:', { selectedDates });
    };

    return (
        <View className="flex-1 bg-backgroundScreen">
            {/* Header */}

            <View className="pt-12 pb-8 px-5">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 rounded-full bg-[#8CC044] items-center justify-center mr-4"
                    >
                        <ArrowRight2 size={20} color="#FFFFFF" variant="Outline" style={{ transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-900">Payroll</Text>
                </View>
            </View>



            {/* Payroll Cards - Horizontal */}
            <View className="px-5 ">
                <View className="flex-row items-center justify-between px-5">
                    <Text className="text-xl font-bold text-gray-900">Payrolls</Text>

                    <TouchableOpacity onPress={() => setShowFilterModal(true)}>
                        <Ionicons name="filter-circle-outline" size={35} color={COLORS.primaryGreen} />
                    </TouchableOpacity>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, gap: 4 }}
                    className="mt-4"
                    onScroll={(event) => {
                        const scrollX = event.nativeEvent.contentOffset.x;
                        const screenWidth = Dimensions.get('window').width;
                        const cardWidth = screenWidth * 0.8 + 16; // 80% + gap
                        const newIndex = Math.round(scrollX / cardWidth);
                        if (newIndex !== currentPayrollIndex - 1) {
                            setCurrentPayrollIndex(newIndex + 1);
                        }
                    }}
                    scrollEventThrottle={16}
                >
                    {payrollData.map((item, _index) => (
                        <View key={item.id} style={{ width: '80%' }}>
                            <PayrollCard
                                item={item}
                                onPress={() => {
                                    console.log('Payroll card pressed:', item);
                                }}
                            />
                        </View>
                    ))}
                </ScrollView>

                {/* Pagination Dots */}
                <View className="flex-row justify-center mt-6 space-x-2 gap-2" >
                    {payrollData.map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                if (scrollRef.current) {
                                    scrollRef.current.scrollTo({ x: index * 316, animated: true });
                                }
                                setCurrentPayrollIndex(index + 1);
                            }}
                            className={`w-2 h-2 rounded-full ${currentPayrollIndex === index + 1 ? 'bg-[#8CC044]' : 'bg-white'}`}
                        />
                    ))}
                </View>
            </View>

            {/* Filter Modal */}
            <FilterModal
                visible={showFilterModal}
                onClose={handleFilterClose}
                onApply={handleFilterApply}
            />
        </View>
    );
};

export default PayrollScreen;
