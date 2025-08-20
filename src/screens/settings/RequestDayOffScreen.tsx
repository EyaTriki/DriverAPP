import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight2 } from 'iconsax-react-native';
import { Button } from '../../components';
import DateTimePicker from '@react-native-community/datetimepicker';
import SegmentTabs, { TabKey } from '../../components/SegmentTabs';
import TippingCard, { TippingItem } from '../../components/TippingCard';

const TABS = [
    { key: 'approved' as const, label: 'Approved' },
    { key: 'pending' as const, label: 'Pending' },
    { key: 'rejected' as const, label: 'Rejected' },
    { key: 'all' as const, label: 'All' },
];

const MOCK_REQUESTS: TippingItem[] = [
    {
        id: '1',
        status: 'approved',
        requestLabel: 'Request: August 19, 2025 - August 25, 2025',
        approvedOn: 'Approved on July 19, 2025',
        subline: 'Family vacation and personal time off',
        proofUploaded: false
    },
    {
        id: '2',
        status: 'approved',
        requestLabel: 'Request: September 5, 2025 - September 7, 2025',
        approvedOn: 'Approved on August 15, 2025',
        subline: 'Medical appointment and recovery',
        proofUploaded: false
    },
    {
        id: '3',
        status: 'pending',
        requestLabel: 'Request: October 10, 2025 - October 12, 2025',
        subline: 'Personal family event',
        proofUploaded: false
    },
];

const RequestDayOffScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [tab, setTab] = useState<TabKey>('approved');
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [reason, setReason] = useState('');
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const data = useMemo(() => {
        if (tab === 'all') return MOCK_REQUESTS;
        return MOCK_REQUESTS.filter(it => it.status === tab);
    }, [tab]);

    const handleStartDateChange = (event: any, selectedDate?: Date) => {
        setShowStartDatePicker(false);
        if (selectedDate) {
            setStartDate(selectedDate);
            if (endDate < selectedDate) {
                setEndDate(selectedDate);
            }
        }
    };

    const handleEndDateChange = (event: any, selectedDate?: Date) => {
        setShowEndDatePicker(false);
        if (selectedDate && selectedDate >= startDate) {
            setEndDate(selectedDate);
        } else if (selectedDate) {
            Alert.alert('Invalid Date', 'End date must be after start date');
        }
    };

    const formatDateRange = () => {
        const start = startDate.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: '2-digit'
        });
        const end = endDate.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: '2-digit'
        });
        return `${start} - ${end}`;
    };

    const calculateDaysOff = () => {
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    const handleSubmit = () => {
        if (!reason.trim()) {
            Alert.alert('Missing Information', 'Please provide a reason for your time off request.');
            return;
        }

        if (startDate > endDate) {
            Alert.alert('Invalid Dates', 'Start date cannot be after end date.');
            return;
        }

        Alert.alert(
            'Request Submitted',
            `Your time off request for ${calculateDaysOff()} day(s) has been submitted successfully.`,
            [
                {
                    text: 'OK',
                    onPress: () => setShowModal(false)
                }
            ]
        );
    };



    return (
        <View className="flex-1 bg-backgroundScreen">
            {/* Header */}
            <View className="pt-12 pb-8 px-5 bg-gray-800">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 rounded-full bg-[#8CC044] items-center justify-center mr-4"
                    >
                        <ArrowRight2 size={20} color="#FFFFFF" variant="Outline" style={{ transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-black">My Requests</Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Tabs */}
                <SegmentTabs value={tab} onChange={setTab} items={TABS} />

                {/* Add New Request Button */}
                <Button
                    title="Add New Request"
                    onPress={() => setShowModal(true)}
                    variant="black"
                    className="rounded-[10px] px-4 py-[10px] mt-5 self-end"
                    textClassName="text-white font-poppins-semibold text-base"
                />

                {/* Requests List */}
                <View className="mt-5">
                    {data.map(item => (
                        <TippingCard
                            key={item.id}
                            item={{
                                ...item,
                                showStatusBadge: true, // Show status badge instead of proof badge
                                onPressProof: () => {
                                    // handle open proof if needed
                                },
                            }}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Request Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
                    <View className="bg-white rounded-2xl w-full max-w-sm">
                        {/* Header */}
                        <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
                            <Text className="text-xl font-poppins-bold text-gray-900">Request a day off</Text>
                            <TouchableOpacity
                                onPress={() => setShowModal(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                            >
                                <Text className="text-gray-600 font-bold text-lg">×</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        <View className="p-6">
                            {/* Select Period */}
                            <View className="mb-6">
                                <Text className="text-base font-poppins-medium text-gray-700 mb-3">Select Period</Text>
                                <TouchableOpacity
                                    onPress={() => setShowStartDatePicker(true)}
                                    className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                                >
                                    <Text className="font-poppins-medium text-gray-900">
                                        {formatDateRange()}
                                    </Text>
                                    <ArrowRight2 size={16} color="#6B7280" variant="Outline" style={{ transform: [{ rotate: '90deg' }] }} />
                                </TouchableOpacity>
                            </View>

                            {/* Reason */}
                            <View className="mb-6">
                                <Text className="text-base font-poppins-medium text-gray-700 mb-3">Reason</Text>
                                <TextInput
                                    value={reason}
                                    onChangeText={setReason}
                                    placeholder="Enter your reason for time off..."
                                    placeholderTextColor="#9CA3AF"
                                    multiline
                                    numberOfLines={4}
                                    className="p-4 bg-gray-50 rounded-xl border border-gray-200 font-poppins-regular text-gray-900"
                                    textAlignVertical="top"
                                    style={{ minHeight: 120 }}
                                />
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="p-6 border-t border-gray-100">
                            <View className="flex-row gap-3">
                                <Button
                                    title="Cancel"
                                    onPress={() => setShowModal(false)}
                                    variant="transparent"
                                    className="flex-1 bg-white border border-gray-300"
                                    textClassName="text-gray-700 font-poppins-semibold text-base"
                                />
                                <Button
                                    title="Confirm"
                                    onPress={handleSubmit}
                                    variant="primary"
                                    className="flex-1 bg-[#8CC044]"
                                    textClassName="text-white font-poppins-semibold text-base"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Date Pickers */}
                {showStartDatePicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display="default"
                        onChange={handleStartDateChange}
                        minimumDate={new Date()}
                    />
                )}

                {showEndDatePicker && (
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={handleEndDateChange}
                        minimumDate={startDate}
                    />
                )}
            </Modal>
        </View>
    );
};

export default RequestDayOffScreen;
