import React from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/colors';

interface PickupModalProps {
    visible: boolean;
    onClose: () => void;
    onNext: () => void;
}

const PickupModal: React.FC<PickupModalProps> = ({ visible, onClose, onNext }) => {

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <View className="absolute inset-0 bg-black/50 justify-center items-center">
                <View className="bg-white rounded-2xl mx-5 w-full max-w-sm" style={{ maxHeight: Dimensions.get('window').height * 0.8 }}>
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-5 border-gray-100">
                        <Text className="text-lg font-poppins-bold text-gray-900">Helper is ready for pickup!</Text>
                        <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                            <Ionicons name="close" size={20} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Map Container */}
                    <View className="p-5">
                        <View className="w-full h-64 rounded-xl overflow-hidden bg-gray-200 items-center justify-center">
                            <View className="items-center">
                                <Ionicons name="location" size={48} color={COLORS.primaryGreen} />
                                <Text className="text-gray-600 mt-2 font-poppins-medium">Map View</Text>
                                <Text className="text-gray-500 text-sm mt-1">Helper location will be shown here</Text>
                            </View>
                        </View>
                    </View>

                    {/* Next Button */}
                    <View className="p-5">
                        <TouchableOpacity
                            className="bg-primaryGreen py-4 rounded-xl items-center"
                            onPress={onNext}
                        >
                            <Text className="text-white text-base font-poppins-bold">Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default PickupModal;
