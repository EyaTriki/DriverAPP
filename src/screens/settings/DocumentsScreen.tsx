import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight2 } from 'iconsax-react-native';
import { Button } from '../../components';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentSection from '../../components/DocumentSection';
import { useAuthStore } from '../../stores/authStore';

const DocumentsScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { user, updateProfile, isLoading } = useAuthStore();

    // Document states with proper file information - initialize with user data
    const [documents, setDocuments] = useState({
        driverLicense: {
            uploaded: !!user?.DriverLicense,
            fileName: user?.DriverLicense ? 'Driver License' : '',
            fileSize: '',
            uri: null as string | null
        },
        addressProof: {
            uploaded: !!user?.addressProof,
            fileName: user?.addressProof ? 'Address Proof' : '',
            fileSize: '',
            uri: null as string | null
        },
        nationalInsurance: {
            uploaded: !!user?.NatInsurance,
            fileName: user?.NatInsurance ? 'National Insurance' : '',
            fileSize: '',
            uri: null as string | null
        }
    });

    // Simple file size formatter
    const formatFileSize = (bytes?: number | null) => {
        if (!bytes) return 'Unknown size';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleDocumentUpload = async (documentType: string) => {
        try {
            console.log('Opening image picker for:', documentType);

            const result = await launchImageLibrary({
                mediaType: 'mixed',
                includeBase64: false,
                quality: 0.8,
                selectionLimit: 1,
            });

            if (result.didCancel) {
                console.log('User cancelled image picker');
                return;
            }

            if (result.errorCode) {
                console.error('Image picker error:', result.errorMessage);
                Alert.alert('Error', result.errorMessage || 'Failed to pick file');
                return;
            }

            const asset = result.assets?.[0];
            if (!asset || !asset.uri) {
                console.log('No file selected');
                return;
            }

            console.log('Image picker result:', asset);

            // Validate file type
            const allowedTypes = ['jpg', 'jpeg', 'png', 'pdf'];
            const fileName = asset.fileName || asset.uri.split('/').pop() || '';
            const fileExtension = fileName.split('.').pop()?.toLowerCase();
            
            if (!fileExtension || !allowedTypes.includes(fileExtension)) {
                Alert.alert('Invalid File Type', 'Please select a valid file (PNG, JPG, PDF)');
                return;
            }

            // Validate file size (max 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            if (asset.fileSize && asset.fileSize > maxSize) {
                Alert.alert('File Too Large', 'Please select a file smaller than 10MB');
                return;
            }

            // Update the selected document
            const documentKey = documentType.toLowerCase().replace(' ', '') as keyof typeof documents;
            setDocuments(prev => ({
                ...prev,
                [documentKey]: {
                    uploaded: true,
                    fileName: asset.fileName || fileName || 'Document',
                    fileSize: formatFileSize(asset.fileSize),
                    uri: asset.uri
                }
            }));

            Alert.alert('Success', 'Document selected successfully!');
        } catch (error: any) {
            console.error('File picker error:', error);
            Alert.alert('Error', 'Failed to pick file. Please try again.');
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
                <DocumentSection
                    title="Your driver Licence"
                    document={documents.driverLicense}
                    onUpload={() => handleDocumentUpload('Driver License')}
                    onUpdate={() => handleDocumentUpload('Driver License')}
                />

                {/* Address Proof Section */}
                <DocumentSection
                    title="Your address Proof"
                    document={documents.addressProof}
                    onUpload={() => handleDocumentUpload('Address Proof')}
                    onUpdate={() => handleDocumentUpload('Address Proof')}
                />

                {/* National Insurance Section */}
                <DocumentSection
                    title="Your National Insurance Number"
                    document={documents.nationalInsurance}
                    onUpload={() => handleDocumentUpload('National Insurance')}
                    onUpdate={() => handleDocumentUpload('National Insurance')}
                />

                {/* Action Buttons */}
                <View className="px-5 pb-8">
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
        </View>
    );
};

export default DocumentsScreen;
