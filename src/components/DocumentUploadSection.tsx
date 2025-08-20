import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Folder, Add } from 'iconsax-react-native';

interface DocumentUploadSectionProps {
    title: string;
    onPress: () => void;
    supportedFormats?: string[];
}

const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
    title,
    onPress,
    supportedFormats = ['PNG', 'JPG', 'PDF'],
}) => {
    return (
        <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-3">{title}</Text>
            <View className="border-2 border-dashed border-[#8CC044] rounded-2xl p-8 items-center bg-white">
                <View className="relative mb-4">
                    <Folder size={48} color="#8CC044" variant="Linear" />
                    <View className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#8CC044] items-center justify-center">
                        <Add size={16} color="#FFFFFF" variant="Linear" />
                    </View>
                </View>
                <Text className="text-sm text-gray-500 text-center mb-4">
                    Formats supported: {supportedFormats.join(', ')}
                </Text>
                <TouchableOpacity
                    onPress={onPress}
                    className="border border-[#8CC044] rounded-xl px-6 py-3"
                >
                    <Text className="text-[#8CC044] font-semibold">Browse</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DocumentUploadSection;
