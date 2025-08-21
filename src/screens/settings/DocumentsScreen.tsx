import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight2 } from 'iconsax-react-native';
import { Button } from '../../components';
import DocumentPreviewSection from '../../components/DocumentPreviewSection';
import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType, PhotoQuality } from 'react-native-image-picker';
import PhotoUpload from '../../components/PhotoUpload';
import { useAuthStore } from '../../stores/authStore';

const DocumentsScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { user, updateProfile, isLoading } = useAuthStore();

    // State for edit modal
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentEditDocument, setCurrentEditDocument] = useState<{
        title: string;
        documentType: string;
        userField: 'DriverLicense' | 'addressProof' | 'NatInsurance';
    } | null>(null);

    // Document states with photo URIs - initialize with user data
    const [documents, setDocuments] = useState({
        driverLicense: {
            uploaded: !!user?.DriverLicense,
            fileName: user?.DriverLicense ? 'Driver License' : '',
            fileSize: '',
            uri: null as string | null,
            photoUris: [] as string[]
        },
        addressProof: {
            uploaded: !!user?.addressProof,
            fileName: user?.addressProof ? 'Address Proof' : '',
            fileSize: '',
            uri: null as string | null,
            photoUris: [] as string[]
        },
        nationalInsurance: {
            uploaded: !!user?.NatInsurance,
            fileName: user?.NatInsurance ? 'National Insurance' : '',
            fileSize: '',
            uri: null as string | null,
            photoUris: [] as string[]
        }
    });



    const getDocumentKey = (documentType: string): keyof typeof documents => {
        switch (documentType) {
            case 'Driver License':
                return 'driverLicense';
            case 'Address Proof':
                return 'addressProof';
            case 'National Insurance':
                return 'nationalInsurance';
            default:
                return 'driverLicense'; // fallback
        }
    };

    const handleTakePhoto = (documentType: string) => {
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
                    const documentKey = getDocumentKey(documentType);
                    setDocuments(prev => ({
                        ...prev,
                        [documentKey]: {
                            ...prev[documentKey],
                            uploaded: true,
                            fileName: 'Photo taken',
                            fileSize: '',
                            uri: photoUri,
                            photoUris: [photoUri] // Replace with single photo instead of adding to array
                        }
                    }));
                    Alert.alert('Success', `Photo taken for ${documentType}`);
                }
            }
        });
    };

    const handleBrowse = (documentType: string) => {
        const options = {
            mediaType: 'photo' as MediaType,
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
            quality: 0.8 as PhotoQuality,
            // Removed selectionLimit to allow only single selection
        };

        launchImageLibrary(options, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                Alert.alert('Error', 'Failed to select image');
            } else if (response.assets && response.assets[0]) {
                const photoUri = response.assets[0].uri;
                if (photoUri) {
                    const documentKey = getDocumentKey(documentType);
                    setDocuments(prev => ({
                        ...prev,
                        [documentKey]: {
                            ...prev[documentKey],
                            uploaded: true,
                            fileName: 'Photo selected',
                            fileSize: '',
                            uri: photoUri,
                            photoUris: [photoUri] // Replace with single photo instead of adding to array
                        }
                    }));
                    Alert.alert('Success', `Photo selected for ${documentType}`);
                }
            }
        });
    };

    const handleUpdateDocument = (documentType: string) => {
        // Trigger the browse function to update the existing document
        handleBrowse(documentType);
    };

    const handleEditDocument = (title: string, documentType: string, userField: 'DriverLicense' | 'addressProof' | 'NatInsurance') => {
        setCurrentEditDocument({ title, documentType, userField });
        setEditModalVisible(true);
    };

    const handleCloseEditModal = () => {
        setEditModalVisible(false);
        setCurrentEditDocument(null);
    };

    const renderDocumentSection = (title: string, documentType: string, userField: 'DriverLicense' | 'addressProof' | 'NatInsurance') => {
        const hasDocument = !!user?.[userField];
        let imageUri = user?.[userField] as any;

        // Handle case where imageUri might be stored as an object with uri property
        if (typeof imageUri === 'object' && imageUri?.uri) {
            imageUri = imageUri.uri;
        } else if (typeof imageUri === 'string') {
            imageUri = imageUri;
        } else {
            imageUri = '';
        }

        console.log(`Document ${documentType}:`, { hasDocument, imageUri, userFieldValue: user?.[userField] }); // Debug log

        if (hasDocument) {
            // Show DocumentPreviewSection for existing documents
            return (
                <DocumentPreviewSection
                    title={title}
                    fileName={documentType}
                    fileSize="Uploaded"
                    imageUri={imageUri}
                    onUpdate={() => handleUpdateDocument(documentType)}
                    onEdit={() => handleEditDocument(title, documentType, userField)}
                />
            );
        } else {
            // Show PhotoUpload for documents that need to be uploaded
            const documentKey = getDocumentKey(documentType);
            return (
                <PhotoUpload
                    title={title}
                    onUpload={() => handleBrowse(documentType)}
                    onTakePhoto={() => handleTakePhoto(documentType)}
                    selectedPhotoUris={documents[documentKey].photoUris}
                    className="mb-6"
                />
            );
        }
    };

    const handleConfirmDocuments = async () => {
        // Check if any documents have been uploaded
        const hasNewDocuments = Object.values(documents).some(doc => doc.uploaded && doc.uri);

        if (!hasNewDocuments) {
            Alert.alert('No Changes', 'No new documents have been uploaded');
            return;
        }

        try {
            const updateData: any = {};

            // Add documents that have been uploaded
            if (documents.driverLicense.uploaded && documents.driverLicense.uri) {
                const fileName = documents.driverLicense.fileName || 'driver_license';
                const fileExtension = fileName.split('.').pop()?.toLowerCase();
                const mimeType = fileExtension === 'pdf' ? 'application/pdf' : 'image/jpeg';

                updateData.DriverLicense = {
                    uri: documents.driverLicense.uri,
                    type: mimeType,
                    name: documents.driverLicense.fileName || 'driver_license'
                };
            }

            if (documents.addressProof.uploaded && documents.addressProof.uri) {
                const fileName = documents.addressProof.fileName || 'address_proof';
                const fileExtension = fileName.split('.').pop()?.toLowerCase();
                const mimeType = fileExtension === 'pdf' ? 'application/pdf' : 'image/jpeg';

                updateData.addressProof = {
                    uri: documents.addressProof.uri,
                    type: mimeType,
                    name: documents.addressProof.fileName || 'address_proof'
                };
            }

            if (documents.nationalInsurance.uploaded && documents.nationalInsurance.uri) {
                const fileName = documents.nationalInsurance.fileName || 'national_insurance';
                const fileExtension = fileName.split('.').pop()?.toLowerCase();
                const mimeType = fileExtension === 'pdf' ? 'application/pdf' : 'image/jpeg';

                updateData.NatInsurance = {
                    uri: documents.nationalInsurance.uri,
                    type: mimeType,
                    name: documents.nationalInsurance.fileName || 'national_insurance'
                };
            }

            const success = await updateProfile(updateData);
            if (success) {
                Alert.alert('Success', 'Documents uploaded successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error: any) {
            Alert.alert('Upload Error', error.message || 'Failed to upload documents');
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
                    <Text className="text-xl font-bold text-gray-900">Documents</Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Driver License Section */}
                {renderDocumentSection("Your driver Licence", "Driver License", "DriverLicense")}

                {/* Address Proof Section */}
                {renderDocumentSection("Your address Proof", "Address Proof", "addressProof")}

                {/* National Insurance Section */}
                {renderDocumentSection("Your National Insurance Number", "National Insurance", "NatInsurance")}

                {/* Action Buttons */}
                <View className="px-5 pb-8 mt-7">
                    <View className="flex-row justify-between gap-2">
                        <Button
                            title="Cancel"
                            onPress={() => navigation.goBack()}
                            variant="transparent"
                            className="flex-1 mr-2"
                            textClassName="text-black font-poppins-semibold text-base"
                        />
                        <Button
                            title={isLoading ? "Uploading..." : "Confirm"}
                            onPress={handleConfirmDocuments}
                            variant="primary"
                            className="flex-1 ml-2"
                            textClassName="text-white font-poppins-semibold text-base"
                            disabled={isLoading}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Edit Document Modal */}
            <Modal
                visible={editModalVisible}
                transparent
                animationType="fade"
                statusBarTranslucent
                onRequestClose={handleCloseEditModal}
            >
                <View className="flex-1 justify-center items-center p-4">
                    {/* Backdrop */}
                    <TouchableOpacity
                        onPress={handleCloseEditModal}
                        className="absolute inset-0 bg-black/50"
                        activeOpacity={1}
                    />

                    {/* Dialog */}
                    <View className="bg-white rounded-2xl p-4 w-full max-w-sm shadow-lg">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-semibold text-gray-900">
                                Update {currentEditDocument?.title}
                            </Text>
                            <TouchableOpacity
                                onPress={handleCloseEditModal}
                                className="w-6 h-6 items-center justify-center"
                            >
                                <Text className="text-gray-600 font-bold text-lg">×</Text>
                            </TouchableOpacity>
                        </View>

                        {currentEditDocument && (
                            <PhotoUpload
                                title={currentEditDocument.title}
                                onUpload={() => {
                                    handleBrowse(currentEditDocument.documentType);
                                    handleCloseEditModal();
                                }}
                                onTakePhoto={() => {
                                    handleTakePhoto(currentEditDocument.documentType);
                                    handleCloseEditModal();
                                }}
                                selectedPhotoUris={[]}
                                className="mb-0"
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DocumentsScreen;
