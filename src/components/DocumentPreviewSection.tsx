import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Document, Edit2 } from 'iconsax-react-native';

interface DocumentPreviewSectionProps {
    title: string;
    fileName: string;
    fileSize: string;
    onUpdate: () => void;
}

const DocumentPreviewSection: React.FC<DocumentPreviewSectionProps> = ({
    title,
    fileName,
    fileSize,
    onUpdate,
}) => {
    return (
        <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-3">{title}</Text>
            <View className="bg-white rounded-2xl p-4 border border-gray-200">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <View className="w-12 h-12 rounded-xl bg-[#8CC044] bg-opacity-10 items-center justify-center mr-3">
                            <Document size={24} color="#8CC044" variant="Linear" />
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
                        onPress={onUpdate}
                        className="w-8 h-8 rounded-lg bg-gray-100 items-center justify-center ml-2"
                    >
                        <Edit2 size={16} color="#6B7280" variant="Outline" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default DocumentPreviewSection;
