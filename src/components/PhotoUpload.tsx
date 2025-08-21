import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface PhotoUploadProps {
    title: string;
    onUpload: () => void;
    onBrowse?: () => void;
    onTakePhoto?: () => void;
    className?: string;
    selectedPhotoUris?: string[];
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
    title,
    onUpload,
    onBrowse,
    onTakePhoto,
    className = '',
    selectedPhotoUris = []
}) => {
    return (
        <View className={className}>
            <Text className="text-base font-poppins-semibold text-gray-900 mb-3">{title}</Text>
            <View className="border-2 border-dashed border-[#8CC044] rounded-xl p-6 items-center justify-center">
                <TouchableOpacity
                    onPress={onUpload}
                    className="items-center justify-center"
                >
                    <MaterialIcons name="add-photo-alternate" size={48} color="#8CC044" />
                    <Text className=" font-poppins-medium mt-2">Upload Photo</Text>
                </TouchableOpacity>
                <View className="flex-row space-x-3 mt-3">
                    {onTakePhoto && (
                        <TouchableOpacity
                            onPress={onTakePhoto}
                            className="flex-1 border-2 border-[#8CC044] px-4 py-2 rounded-lg items-center"
                        >
                            <Text className="text-primaryGreen font-poppins-medium">Take Photo</Text>
                        </TouchableOpacity>
                    )}
                    {onBrowse && (
                        <TouchableOpacity
                            onPress={onBrowse}
                            className="flex-1 bg-[#8CC044] px-4 py-2 rounded-lg items-center"
                        >
                            <Text className="text-white font-poppins-medium">Browse</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Show selected photos */}
            {selectedPhotoUris.length > 0 && (
                <View className="mt-3">
                    <Text className="text-sm font-poppins-medium text-gray-600 mb-2">
                        Selected Photos ({selectedPhotoUris.length}):
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 8 }}
                    >
                        {selectedPhotoUris.map((photoUri, index) => (
                            <View
                                key={index}
                                className="border border-gray-200 rounded-lg overflow-hidden"
                                style={{ width: 100, height: 100 }}
                            >
                                <Image
                                    source={{ uri: photoUri }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="cover"
                                />
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

export default PhotoUpload;
