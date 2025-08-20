import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType, PhotoQuality } from 'react-native-image-picker';
import InputField from './InputField';
import Button from './Button';
import PhotoUpload from './PhotoUpload';
import IconInput from './IconInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface StartTodayModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const StartTodayModal: React.FC<StartTodayModalProps> = ({ visible, onClose, onConfirm }) => {
    const [fuelLevel, setFuelLevel] = useState('');
    const [mileageStart, setMileageStart] = useState('');
    const [conditionReport, setConditionReport] = useState('');
    const [uploadedPhotos, setUploadedPhotos] = useState<{ [key: string]: string[] }>({});

    const handleUploadPhoto = (section: string) => {
        const options = {
            mediaType: 'photo' as MediaType,
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
            quality: 0.8 as PhotoQuality,
        };

        launchCamera(options, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.errorCode) {
                Alert.alert('Error', 'Failed to take photo');
            } else if (response.assets && response.assets[0]) {
                const photoUri = response.assets[0].uri;
                if (photoUri) {
                    setUploadedPhotos(prev => ({
                        ...prev,
                        [section]: [...(prev[section] || []), photoUri]
                    }));
                    Alert.alert('Success', `Photo uploaded for ${section}`);
                }
            }
        });
    };

    const handleBrowse = (section: string) => {
        const options = {
            mediaType: 'photo' as MediaType,
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
            quality: 0.8 as PhotoQuality,
            selectionLimit: 5, // Allow up to 5 photos per section
        };

        launchImageLibrary(options, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                Alert.alert('Error', 'Failed to select image');
            } else if (response.assets && response.assets.length > 0) {
                const photoUris = response.assets
                    .map(asset => asset.uri)
                    .filter(uri => uri !== undefined) as string[];

                if (photoUris.length > 0) {
                    setUploadedPhotos(prev => ({
                        ...prev,
                        [section]: [...(prev[section] || []), ...photoUris]
                    }));
                    Alert.alert('Success', `${photoUris.length} photo(s) selected for ${section}`);
                }
            }
        });
    };


    const screenHeightFull = Dimensions.get('screen').height;
    const modalHeight = screenHeightFull * 0.9;

    if (!visible) {
        return null;
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent={true}
            presentationStyle="overFullScreen"
            style={{ margin: 0, justifyContent: 'center' }}
        >
            <View className="flex-1 bg-black/50">
                <View
                    className="bg-white rounded-2xl mx-5 w-full max-w-sm pr-2 pl-2"
                    style={{
                        height: modalHeight,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        marginHorizontal: 20,
                        marginVertical: 30
                    }}
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-5  border-gray-100">
                        <Text className="text-lg font-poppins-bold text-gray-900">Daily van status!</Text>
                        <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                            <MaterialIcons name="close" size={20} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Scrollable Content */}
                    <KeyboardAwareScrollView
                        enableOnAndroid
                        enableAutomaticScroll={true}
                        extraScrollHeight={120}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ padding: 20, marginTop: -14, paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        {/* Photo Upload Sections */}
                        <PhotoUpload
                            title="Van from driver side"
                            onUpload={() => handleBrowse('driver side')}
                            onTakePhoto={() => handleUploadPhoto('driver side')}
                            selectedPhotoUris={uploadedPhotos['driver side'] || []}
                        />

                        <View style={{ height: 24 }} />

                        <PhotoUpload
                            title="Van from passenger side"
                            onUpload={() => handleBrowse('passenger side')}
                            onTakePhoto={() => handleUploadPhoto('passenger side')}
                            selectedPhotoUris={uploadedPhotos['passenger side'] || []}
                        />

                        <View style={{ height: 24 }} />

                        <PhotoUpload
                            title="REAR OF VAN"
                            onUpload={() => handleBrowse('rear')}
                            onTakePhoto={() => handleUploadPhoto('rear')}
                            selectedPhotoUris={uploadedPhotos['rear'] || []}
                        />

                        <View style={{ height: 24 }} />

                        {/* Fuel Level */}
                        <IconInput
                            label="Fuel Level"
                            placeholder="Enter fuel level"
                            value={fuelLevel}
                            onChangeText={setFuelLevel}
                            iconType="fuel"
                        />

                        <View style={{ height: 24 }} />

                        {/* Mileage Start */}
                        <IconInput
                            label="Mileage Start"
                            placeholder="Enter mileage start"
                            value={mileageStart}
                            onChangeText={setMileageStart}
                            iconType="speed"
                        />

                        <View style={{ height: 24 }} />

                        {/* Condition Report */}
                        <View>
                            <Text className="text-base font-poppins-semibold text-gray-900 mb-1">Condition Report</Text>
                            <Text className="text-xs text-red-500 mb-3">(Van Condition Before Shift)</Text>
                            <InputField
                                placeholder="Enter condition report"
                                value={conditionReport}
                                onChangeText={setConditionReport}
                                multiline
                                numberOfLines={3}
                                className="mb-0"
                            />
                        </View>

                        {/* Bottom padding for scroll */}
                        <View style={{ height: 20 }} />
                        <View className="p- flex-row  gap-2  border-gray-100">
                            <Button
                                title="Cancel"
                                onPress={onClose}
                                variant="white"
                                className="flex-1"
                                textClassName="text-gray-900 font-poppins-semibold text-base"
                            />
                            <Button
                                title="Confirm"
                                onPress={() => {
                                    console.log('Form data:', {
                                        fuelLevel,
                                        mileageStart,
                                        conditionReport,
                                        uploadedPhotos
                                    });
                                    onConfirm();
                                }}
                                variant="primary"
                                className="flex-1"
                                textClassName="text-white font-poppins-semibold text-base"
                            />
                        </View>
                    </KeyboardAwareScrollView>

                    {/* Action Buttons */}

                </View>
            </View>
        </Modal>
    );
};

export default StartTodayModal;
