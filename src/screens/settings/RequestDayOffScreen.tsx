import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight2 } from 'iconsax-react-native';
import { Button } from '../../components';

import { Calendar } from 'react-native-calendars';
import SegmentTabs, { TabKey } from '../../components/SegmentTabs';
import TippingCard, { TippingItem } from '../../components/TippingCard';
import { 
    useDayOffStore, 
    DayOffRequest, 
    validateDayOffRequest, 
    formatDateRange, 
    getStatusColor, 
    getStatusText 
} from '../../stores/dayOffStore';

const TABS = [
    { key: 'approved' as const, label: 'Approved' },
    { key: 'pending' as const, label: 'Pending' },
    { key: 'rejected' as const, label: 'Rejected' },
    { key: 'all' as const, label: 'All' },
];

const RequestDayOffScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [tab, setTab] = useState<TabKey>('approved');
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [reason, setReason] = useState('');

    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [selectedDates, setSelectedDates] = useState<{ [key: string]: any }>({});
    const [isSelectingEndDate, setIsSelectingEndDate] = useState(false);

    // Day off store
    const { 
        requests, 
        isLoading, 
        error, 
        fetchDayOffRequests, 
        createDayOffRequest, 
        clearError 
    } = useDayOffStore();

    // Fetch day off requests on component mount
    useEffect(() => {
        fetchDayOffRequests();
    }, []);

    // Convert day off requests to TippingItem format
    const convertToTippingItems = (dayOffRequests: DayOffRequest[]): TippingItem[] => {
        return dayOffRequests.map(request => ({
            id: request._id,
            status: request.status.toLowerCase() as 'approved' | 'pending' | 'rejected',
            requestLabel: `Request: ${formatDateRange(request.startDate, request.endDate)}`,
            approvedOn: request.status === 'Approved' 
                ? `Approved on ${new Date(request.updatedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}`
                : request.status === 'Rejected'
                ? `Rejected on ${new Date(request.updatedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}`
                : 'Pending approval',
            subline: request.reason,
            proofUploaded: false
        }));
    };

    const data = useMemo(() => {
        const tippingItems = convertToTippingItems(requests);
        if (tab === 'all') return tippingItems;
        return tippingItems.filter(it => it.status === tab);
    }, [requests, tab]);



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
                setShowCalendarModal(false);
                setIsSelectingEndDate(false);
            } else {
                Alert.alert('Invalid Date', 'End date must be after start date');
            }
        }
    };

    const openCalendarModal = () => {
        setShowCalendarModal(true);
        setIsSelectingEndDate(false);
        // Initialize with current start date if it exists
        if (startDate) {
            const startDateString = startDate.toISOString().split('T')[0];
            setSelectedDates({
                [startDateString]: {
                    selected: true,
                    startingDay: true,
                    color: '#8CC044',
                }
            });
        }
    };

    const formatSelectedDateRange = () => {
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

    const handleSubmit = async () => {
        // Validate the request
        const validationError = validateDayOffRequest(
            startDate.toISOString().split('T')[0],
            endDate.toISOString().split('T')[0],
            reason
        );

        if (validationError) {
            Alert.alert('Validation Error', validationError);
            return;
        }

        try {
            const success = await createDayOffRequest({
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                reason: reason.trim()
            });

            if (success) {
                Alert.alert(
                    'Request Submitted',
                    `Your time off request for ${calculateDaysOff()} day(s) has been submitted successfully.`,
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                setShowModal(false);
                                setReason('');
                                setStartDate(new Date());
                                setEndDate(new Date());
                                setSelectedDates({});
                            }
                        }
                    ]
                );
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to submit request');
        }
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
                    <Text className="text-xl font-bold text-gray-900">My Requests</Text>
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

            {/* Error Display */}
            {error && (
                <View className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <Text className="text-red-600 text-sm">{error}</Text>
                    <TouchableOpacity onPress={clearError} className="mt-2">
                        <Text className="text-red-500 text-xs">Dismiss</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Loading State */}
            {isLoading && (
                <View className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <Text className="text-gray-600 text-center">Loading requests...</Text>
                </View>
            )}

            {/* Requests List */}
            <View className="mt-5">
                {data.length === 0 && !isLoading ? (
                    <View className="p-8 bg-gray-50 rounded-lg">
                        <Text className="text-gray-500 text-center text-lg">No requests found</Text>
                        <Text className="text-gray-400 text-center text-sm mt-2">
                            {tab === 'all' 
                                ? 'You haven\'t made any day off requests yet.'
                                : `No ${tab} requests found.`
                            }
                        </Text>
                    </View>
                ) : (
                    data.map(item => (
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
                    ))
                )}
            </View>
            </ScrollView>

            {/* Request Modal */}
            <Modal
                visible={showModal}
                transparent
                animationType="fade"
                statusBarTranslucent
                presentationStyle="overFullScreen"
                onRequestClose={() => setShowModal(false)}
            >
                <View className="flex-1 justify-center items-center pt-20">
                    {/* Backdrop */}
                    <TouchableOpacity
                        onPress={() => setShowModal(false)}
                        className="absolute inset-0 bg-black/50"
                        activeOpacity={1}
                    />

                    {/* Dialog */}
                    <View className="w-[92%] max-w-[360px] bg-white rounded-2xl p-5 gap-1" style={{ minHeight: 400 }}>
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-xl font-bold text-gray-900">Request a day off</Text>
                            <TouchableOpacity
                                onPress={() => setShowModal(false)}
                                className="w-9 h-9 rounded-xl bg-gray-100 items-center justify-center"
                            >
                                <Text className="text-gray-600 font-bold text-lg">×</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Select Period */}
                        <Text className="text-sm text-gray-800 mb-2">Select Period</Text>
                        <TouchableOpacity
                            onPress={openCalendarModal}
                            className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl border border-containerGray mb-4"
                        >
                            <Text className="font-poppins-medium text-gray-900">
                                {formatSelectedDateRange()}
                            </Text>
                            <ArrowRight2 size={16} color="#6B7280" variant="Outline" style={{ transform: [{ rotate: '90deg' }] }} />
                        </TouchableOpacity>

                        {/* Reason */}
                        <Text className="text-sm text-gray-800 mb-2">Reason</Text>
                        <TextInput
                            value={reason}
                            onChangeText={setReason}
                            placeholder="Enter your reason for time off..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={50}
                            style={{ height: 250 }}
                            textAlignVertical="top"
                            className="h-40 rounded-xl border border-containerGray px-4 py-3 mb-4"
                        />

                        <View className="flex-row items-center justify-between mt-6 gap-3">
                            {/* Cancel Button */}
                            <TouchableOpacity
                                onPress={() => setShowModal(false)}
                                activeOpacity={0.9}
                                className="flex-1 py-3 rounded-xl bg-white  border-gray-300 items-center justify-center"
                            >
                                <Text className="text-lg font-semibold text-black">Cancel</Text>
                            </TouchableOpacity>

                            {/* Confirm Button */}
                            <TouchableOpacity
                                onPress={handleSubmit}
                                activeOpacity={0.9}
                                disabled={isLoading}
                                className={`flex-1 py-3 rounded-xl items-center justify-center ${
                                    isLoading ? 'bg-gray-400' : 'bg-[#8CC044]'
                                }`}
                            >
                                <Text className="text-white font-semibold text-lg">
                                    {isLoading ? 'Submitting...' : 'Confirm'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>



            </Modal>

            {/* Calendar Modal for Date Range Selection */}
            <Modal
                visible={showCalendarModal}
                transparent
                animationType="fade"
                statusBarTranslucent
                presentationStyle="overFullScreen"
                onRequestClose={() => setShowCalendarModal(false)}
            >
                <View className="flex-1 justify-center items-center pt-20">
                    {/* Backdrop */}
                    <TouchableOpacity
                        onPress={() => setShowCalendarModal(false)}
                        className="absolute inset-0 bg-black/50"
                        activeOpacity={1}
                    />

                    {/* Calendar Dialog */}
                    <View className="w-[92%] max-w-[360px] bg-white rounded-2xl p-5">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-xl font-bold text-gray-900">
                                {isSelectingEndDate ? 'Select End Date' : 'Select Start Date'}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowCalendarModal(false)}
                                className="w-9 h-9 rounded-xl bg-gray-100 items-center justify-center"
                            >
                                <Text className="text-gray-600 font-bold text-lg">×</Text>
                            </TouchableOpacity>
                        </View>

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
                                <Text className="text-sm text-gray-600 text-center mb-3">
                                    Now select the end date for your time off period
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default RequestDayOffScreen;
