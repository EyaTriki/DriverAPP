import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight2 } from 'iconsax-react-native';
import { SectionHeader, DatePicker, Selector, ItemSelector, PhotoUpload, Button } from '../../components';
import { launchCamera, ImagePickerResponse, MediaType, PhotoQuality } from 'react-native-image-picker';

interface AddItemsScreenProps {
    navigation: any;
    route: any;
}

const AddItemsScreen: React.FC<AddItemsScreenProps> = () => {
    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState<string | undefined>();
    const [selectedWarehouse, setSelectedWarehouse] = useState<string | undefined>();
    const [selectedPhotoUris, setSelectedPhotoUris] = useState<string[]>([]);
    const [items, setItems] = useState([
        { id: '1', name: 'Sofa', icon: 'sofa', quantity: 0 },
        { id: '2', name: 'Mattress', icon: 'bed', quantity: 2 },
        { id: '3', name: 'Fridge', icon: 'fridge', quantity: 0 },
        { id: '4', name: 'Paint', icon: 'paint', quantity: 1 },
        { id: '5', name: 'Rubbish', icon: 'trash', quantity: 0 },

    ]);

    // Sample warehouse options
    const warehouseOptions = [
        { label: 'Warehouse A', value: 'warehouse_a' },
        { label: 'Warehouse B', value: 'warehouse_b' },
        { label: 'Warehouse C', value: 'warehouse_c' },
        { label: 'Main Storage', value: 'main_storage' },
        { label: 'Secondary Storage', value: 'secondary_storage' },
    ];

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleTakePhoto = () => {
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
                    setSelectedPhotoUris(prev => [...prev, photoUri]);
                    Alert.alert('Success', 'Photo taken successfully!');
                }
            }
        });
    };

    const handleUpload = () => {
        // This can be used to trigger take photo
        handleTakePhoto();
    };

    const handleRemovePhoto = (index: number) => {
        setSelectedPhotoUris(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddItems = () => {
        // Validate required fields
        if (!selectedDate) {
            Alert.alert('Error', 'Please select a date.');
            return;
        }
        if (!selectedWarehouse) {
            Alert.alert('Error', 'Please select a storage place.');
            return;
        }
        if (selectedPhotoUris.length === 0) {
            Alert.alert('Error', 'Please upload at least one photo as proof.');
            return;
        }

        // Here you would typically send the data to your backend
        console.log('Adding items with data:', {
            date: selectedDate,
            warehouse: selectedWarehouse,
            items: items.filter(item => item.quantity > 0),
            photos: selectedPhotoUris
        });

        Alert.alert('Success', 'Items added successfully!', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
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
                    <Text className="text-xl font-bold text-gray-900">Add Items </Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 20 }}>
                <SectionHeader
                    title="Details"
                    iconName="information-circle"
                    iconColor="#8CC044"
                />

                <View className="mb-6">
                    <DatePicker
                        label="Date"
                        value={selectedDate}
                        onDateChange={setSelectedDate}
                        placeholder="Select Date"
                    />
                </View>

                <View className="mb-6">
                    <Selector
                        label="Storage Place"
                        value={selectedWarehouse}
                        onValueChange={setSelectedWarehouse}
                        placeholder="Select warehouse"
                        options={warehouseOptions}
                    />
                </View>

                <View className="mt-6">
                    <ItemSelector
                        title="Items"
                        items={items}
                        onQuantityChange={handleQuantityChange}
                    />
                </View>

                <View className="mt-6">
                    <PhotoUpload
                        title="Proof Upload"
                        onUpload={handleUpload}
                        onTakePhoto={handleTakePhoto}
                        onRemovePhoto={handleRemovePhoto}
                        selectedPhotoUris={selectedPhotoUris}
                    />
                </View>

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
                            title="Add Items"
                            onPress={handleAddItems}
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

AddItemsScreen.displayName = 'AddItemsScreen';

export default AddItemsScreen;

