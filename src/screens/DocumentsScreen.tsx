import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight2, DocumentText, ArrowSwapHorizontal, Add } from 'iconsax-react-native';

const DocumentsScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [_selectedDocument, setSelectedDocument] = useState<string>('');

    const handleDocumentUpdate = (documentType: string) => {
        setSelectedDocument(documentType);
        setShowUpdateModal(true);
    };

    const handleBrowse = () => {
        // Here you would implement file picker functionality
        Alert.alert('File Picker', 'File picker functionality would be implemented here');
        setShowUpdateModal(false);
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="pt-12 pb-6 px-5">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 rounded-full bg-[#8CC044] items-center justify-center mr-4"
                    >
                        <ArrowRight2 size={20} color="#FFFFFF" variant="Outline" style={{ transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-900">Documents</Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Driver License Section */}
                <View className="mb-6">
                    <Text className="text-base font-semibold text-gray-900 mb-3">Your driver Licence ID</Text>
                    <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View className="w-12 h-12 rounded-xl bg-[#8CC044] items-center justify-center mr-3">
                                    <DocumentText size={24} color="#FFFFFF" variant="Linear" />
                                </View>
                                <View>
                                    <Text className="text-base font-semibold text-gray-900">Driver_lic.jpg</Text>
                                    <Text className="text-sm text-gray-500">500kb</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => handleDocumentUpdate('Driver License')}
                                className="w-10 h-10 rounded-xl bg-[#8CC044] items-center justify-center"
                            >
                                <ArrowSwapHorizontal size={20} color="#FFFFFF" variant="Linear" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Address Proof Section */}
                <View className="mb-6">
                    <Text className="text-base font-semibold text-gray-900 mb-3">Your address Proof</Text>
                    <View className="border-2 border-dashed border-[#8CC044] rounded-2xl p-8 items-center">
                        <View className="w-16 h-16 rounded-full bg-[#8CC044] items-center justify-center mb-4">
                            <Add size={32} color="#FFFFFF" variant="Linear" />
                        </View>
                        <Text className="text-sm text-gray-500 text-center mb-4">
                            Formats supported: PNG, JPG, Pdf
                        </Text>
                        <TouchableOpacity
                            onPress={() => handleDocumentUpdate('Address Proof')}
                            className="border border-[#8CC044] rounded-xl px-6 py-3"
                        >
                            <Text className="text-[#8CC044] font-semibold">browse</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* National Insurance Section */}
                <View className="mb-6">
                    <Text className="text-base font-semibold text-gray-900 mb-3">Your National Insurance Number</Text>
                    <View className="border-2 border-dashed border-[#8CC044] rounded-2xl p-8 items-center">
                        <View className="w-16 h-16 rounded-full bg-[#8CC044] items-center justify-center mb-4">
                            <Add size={32} color="#FFFFFF" variant="Linear" />
                        </View>
                        <Text className="text-sm text-gray-500 text-center mb-4">
                            Formats supported: PNG, JPG, PDf
                        </Text>
                        <TouchableOpacity
                            onPress={() => handleDocumentUpdate('National Insurance')}
                            className="border border-[#8CC044] rounded-xl px-6 py-3"
                        >
                            <Text className="text-[#8CC044] font-semibold">browse</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className="px-5 pb-8">
                <View className="flex-row space-x-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="flex-1 py-4 rounded-xl border border-gray-200"
                    >
                        <Text className="text-center text-base font-semibold text-gray-900">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="flex-1 py-4 rounded-xl bg-[#8CC044]"
                    >
                        <Text className="text-center text-base font-semibold text-white">Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Update Modal */}
            <Modal
                visible={showUpdateModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowUpdateModal(false)}
            >
                <View className="flex-1 bg-black/50 justify-center items-center px-5">
                    <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-xl font-bold text-gray-900">Document Update</Text>
                            <TouchableOpacity onPress={() => setShowUpdateModal(false)}>
                                <Text className="text-2xl text-gray-500">×</Text>
                            </TouchableOpacity>
                        </View>

                        <Text className="text-base text-gray-600 mb-6">
                            Are you sure you want to update this document? It will be replaced with the new file.
                        </Text>

                        <TouchableOpacity
                            onPress={handleBrowse}
                            className="border border-[#8CC044] rounded-xl p-4 items-center mb-6"
                        >
                            <Add size={32} color="#8CC044" variant="Linear" />
                            <Text className="text-[#8CC044] font-semibold mt-2">browse</Text>
                        </TouchableOpacity>

                        <View className="flex-row space-x-4">
                            <TouchableOpacity
                                onPress={() => setShowUpdateModal(false)}
                                className="flex-1 py-3 rounded-xl border border-gray-200"
                            >
                                <Text className="text-center font-semibold text-gray-900">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleBrowse}
                                className="flex-1 py-3 rounded-xl bg-[#8CC044]"
                            >
                                <Text className="text-center font-semibold text-white">Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DocumentsScreen;
