import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Fuel } from 'lucide-react-native';
import { COLORS } from '../constants';

interface IconInputProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    iconType: 'fuel' | 'speed';
    className?: string;
}

const IconInput: React.FC<IconInputProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    iconType,
    className = ''
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const getInputStyleClasses = () => {
        if (isFocused) {
            return {
                borderColor: COLORS.primaryGreen,
                backgroundColor: COLORS.primaryGreenOpacity18
            };
        }

        return {
            borderColor: '#E5E7EB',
            backgroundColor: 'white'
        };
    };

    const renderIcon = () => {
        if (iconType === 'fuel') {
            return <Fuel size={20} color="white" />;
        } else if (iconType === 'speed') {
            return <MaterialIcons name="speed" size={20} color="white" />;
        }
        return null;
    };

    const inputStyles = getInputStyleClasses();

    return (
        <View className={className}>
            <Text className="text-gray-800 font-semibold mb-2 text-sm">
                {label}
            </Text>

            <View
                className="flex-row items-center border rounded-xl overflow-hidden"
                style={{
                    borderWidth: 1,
                    borderColor: inputStyles.borderColor,
                    backgroundColor: inputStyles.backgroundColor
                }}
            >
                <TextInput
                    className="flex-1 py-4 px-4 text-gray-900 text-base"
                    placeholder={placeholder}
                    placeholderTextColor="#999999"
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />

                <View
                    className="bg-[#8CC044] px-4 py-4 items-center justify-center"
                    style={{ width: 60 }}
                >
                    {renderIcon()}
                </View>
            </View>
        </View>
    );
};

export default IconInput;
