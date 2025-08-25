import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface PhotoUploadProps {
    title: string;
    onUpload: () => void;
    onBrowse?: () => void;
    onTakePhoto?: () => void;
    onRemovePhoto?: (index: number) => void;
    className?: string;
    selectedPhotoUris?: string[];
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
    title,
    onUpload,
    onBrowse,
    onTakePhoto,
    onRemovePhoto,
    className = '',
    selectedPhotoUris = []
}) => {
    return (
        <View className={className}>
            <View className="flex-row items-center mb-4">
                <View className="w-7 h-7 rounded-sm mr-2 items-center justify-center">
                    <FontAwesome5 name="camera" size={22} color="#8CC044" />
                </View>
                <Text className="text-lg font-semibold text-gray-900">{title}</Text>
            </View>
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
                                className="border border-gray-200 rounded-lg overflow-hidden relative"
                                style={{ width: 100, height: 100 }}
                            >
                                <Image
                                    source={{ uri: photoUri }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="cover"
                                />
                                {onRemovePhoto && (
                                    <TouchableOpacity
                                        onPress={() => onRemovePhoto(index)}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full items-center justify-center"
                                    >
                                        <MaterialIcons name="close" size={16} color="white" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

export default PhotoUpload;
