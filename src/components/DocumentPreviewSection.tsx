import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import { Eye } from 'iconsax-react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface DocumentPreviewSectionProps {
    title: string;
    fileName: string;
    fileSize: string;
    imageUri?: string;
    onUpdate: () => void;
}

const DocumentPreviewSection: React.FC<DocumentPreviewSectionProps> = ({
    title,
    fileName,
    fileSize,
    imageUri,
    onUpdate: _onUpdate,
}) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleViewImage = () => {
        console.log('Image URI:', imageUri); // Debug log
        if (imageUri && imageUri.trim() !== '') {
            setModalVisible(true);
        } else {
            Alert.alert('No Image', 'No image available to view');
        }
    };
    return (
        <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-3">{title}</Text>
            <View className="bg-white rounded-2xl p-4  border-gray-200">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <View className="w-12 h-12 rounded-xl bg-[#8CC044] bg-opacity-10 items-center justify-center mr-3">
                            <FontAwesome name="file-photo-o" size={24} color="white" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-medium text-gray-900 mb-1" numberOfLines={1}>
                                {fileName}
                            </Text>
                            <Text className="text-xs text-gray-500">
                                {fileSize}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={handleViewImage}
                        className="w-8 h-8 rounded-lg bg-gray-100 items-center justify-center ml-2"
                    >
                        <Eye size={22} color="#6B7280" variant="Outline" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Image Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                statusBarTranslucent
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center p-4">
                    {/* Backdrop */}
                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        className="absolute inset-0 bg-black/50"
                        activeOpacity={1}
                    />

                    {/* Dialog */}
                    <View className="bg-white rounded-2xl p-4 w-full max-w-sm shadow-lg">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-semibold text-gray-900">{fileName}</Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                className="w-6 h-6 items-center justify-center"
                            >
                                <Text className="text-gray-600 font-bold text-lg">×</Text>
                            </TouchableOpacity>
                        </View>
                        {imageUri && (
                            <Image
                                source={{ uri: imageUri }}
                                className="w-full h-64 rounded-xl"
                                resizeMode="cover"
                                onError={() => {
                                    console.log('Image load error for URI:', imageUri);
                                    Alert.alert('Error', 'Failed to load image');
                                }}
                                onLoad={() => console.log('Image loaded successfully:', imageUri)}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DocumentPreviewSection;
