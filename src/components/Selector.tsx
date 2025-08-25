import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, ScrollView } from 'react-native';
import { ArrowDown2 } from 'iconsax-react-native';

interface SelectorOption {
    label: string;
    value: string;
}

interface SelectorProps {
    label?: string;
    value?: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    options: SelectorOption[];
}

const Selector: React.FC<SelectorProps> = ({
    label,
    value,
    onValueChange,
    placeholder = 'Select Option',
    disabled = false,
    className = '',
    options,
}) => {
    const [showSelector, setShowSelector] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (showSelector && !isClosing) {
            // Opening animation
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [showSelector, isClosing, slideAnim]);

    const openSelector = () => {
        if (!disabled) {
            setShowSelector(true);
            setIsClosing(false);
        }
    };

    const handleOptionSelect = (optionValue: string) => {
        onValueChange(optionValue);
        closeSelector();
    };

    const closeSelector = () => {
        setIsClosing(true);
        setShowSelector(false);
        slideAnim.setValue(0);
    };

    const getSelectedLabel = () => {
        const selectedOption = options.find(option => option.value === value);
        return selectedOption ? selectedOption.label : '';
    };

    return (
        <View className={`${className}`}>
            {label && (
                <Text className="text-sm font-poppins-medium text-[#374151] mb-2">{label}</Text>
            )}

            <TouchableOpacity
                onPress={openSelector}
                disabled={disabled}
                className={`flex-row items-center justify-between rounded-xl px-4 py-3 bg-white ${disabled ? 'opacity-50' : ''
                    }`}
            >
                <Text className={`flex-1 ${value ? 'text-gray-900' : 'text-gray-500'}`}>
                    {value ? getSelectedLabel() : placeholder}
                </Text>
                <ArrowDown2 size={20} color="#6B7280" variant="Outline" />
            </TouchableOpacity>

            <Modal
                transparent={true}
                animationType="none"
                visible={showSelector}
                onRequestClose={closeSelector}
            >
                <View className="flex-1 justify-end bg-black bg-black/50">
                    <Animated.View
                        className="bg-white rounded-t-3xl max-h-96"
                        style={{
                            transform: [{
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [400, 0],
                                })
                            }]
                        }}
                    >
                        <View className="flex-row justify-between items-center p-6 border-b border-gray-200">
                            <Text className="text-sm font-poppins-semibold text-[#000] ">
                                {label || 'Select Option'}
                            </Text>
                            <TouchableOpacity
                                onPress={closeSelector}
                                className="p-2"
                            >
                                <Text className="text-primaryGreen font-semibold">Cancel</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="max-h-64">
                            {options.map((option, index) => (
                                <TouchableOpacity
                                    key={option.value}
                                    onPress={() => handleOptionSelect(option.value)}
                                    className={`px-6 py-4 border-b border-gray-100 ${value === option.value ? 'bg-green-50' : ''}`}
                                >
                                    <Text className={`text-base ${value === option.value ? 'text-primaryGreen font-medium' : 'text-gray-900'}`}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
};

export default Selector;
