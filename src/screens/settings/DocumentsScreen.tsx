import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight2 } from 'iconsax-react-native';
import { Button, pickDocument, FilePickerResult, formatFileSize } from '../../components';
import DocumentSection from '../../components/DocumentSection';

const DocumentsScreen: React.FC = () => {
    const navigation = useNavigation<any>();

    // Document states with proper file information - all start as not uploaded
    const [documents, setDocuments] = useState({
        driverLicense: {
            uploaded: false,
            fileName: '',
            fileSize: '',
            uri: null as string | null
        },
        addressProof: {
            uploaded: false,
            fileName: '',
            fileSize: '',
            uri: null as string | null
        },
        nationalInsurance: {
            uploaded: false,
            fileName: '',
            fileSize: '',
            uri: null as string | null
        }
    });

    const handleDocumentUpload = async (documentType: string) => {
        try {
            console.log('Calling pickDocument...');

            // Try direct DocumentPicker first for testing
            try {
                const pickerResult = await DocumentPicker.pickSingle({
                    type: DocumentPicker.types.allFiles,
                    copyTo: 'cachesDirectory',
                });
                console.log('Direct DocumentPicker result:', pickerResult);

                // Convert to our format
                const result: FilePickerResult = {
                    uri: pickerResult.fileCopyUri || pickerResult.uri || '',
                    fileName: pickerResult.name || undefined,
                    fileSize: pickerResult.size || undefined,
                    type: pickerResult.type || undefined,
                };

                console.log('Converted result:', result);

                if (result) {
                    // Validate file type
                    const allowedTypes = ['jpg', 'jpeg', 'png', 'pdf'];
                    const fileName = result.fileName || '';
                    const fileExtension = fileName.split('.').pop()?.toLowerCase();
                    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
                        Alert.alert('Invalid File Type', 'Please select a valid file (PNG, JPG, PDF)');
                        return;
                    }

                    // Validate file size (max 10MB)
                    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
                    if (result.fileSize && result.fileSize > maxSize) {
                        Alert.alert('File Too Large', 'Please select a file smaller than 10MB');
                        return;
                    }

                    // Update the selected document
                    const documentKey = documentType.toLowerCase().replace(' ', '') as keyof typeof documents;
                    setDocuments(prev => ({
                        ...prev,
                        [documentKey]: {
                            uploaded: true,
                            fileName: result.fileName || 'Document',
                            fileSize: formatFileSize(result.fileSize),
                            uri: result.uri || null
                        }
                    }));

                    Alert.alert('Success', 'Document uploaded successfully!');
                }
            } catch (pickerError) {
                console.log('Direct DocumentPicker error:', pickerError);
                if (DocumentPicker.isCancel(pickerError)) {
                    console.log('User cancelled file picker');
                    return;
                }
                throw pickerError;
            }

        } catch (error) {
            console.error('File picker error:', error);
            Alert.alert('Error', 'Failed to pick file. Please try again.');
        }
    };

    return (
        <View className="flex-1 bg-backgroundScreen">
            {/* Header */}
            <View className="pt-12 pb-8 px-5 bg-gray-800">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 rounded-full bg-[#8CC044] items-center justify-center mr-4"
                    >
                        <ArrowRight2 size={20} color="#FFFFFF" variant="Outline" style={{ transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-black">Documents</Text>
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
                            title="Confirm"
                            onPress={() => navigation.goBack()}
                            variant="primary"
                            className="flex-1 ml-2"
                            textClassName="text-white font-poppins-semibold text-base"
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default DocumentsScreen;
