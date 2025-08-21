import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Eye, EyeSlash } from 'iconsax-react-native';
import { COLORS } from '../constants';

interface InputFieldProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    type?: 'text' | 'email' | 'password' | 'number';
    error?: string;
    disabled?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    className?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    inputStyle?: 'default' | 'email' | 'password';
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    type = 'text',
    error,
    disabled = false,
    multiline = false,
    numberOfLines = 1,
    className = '',
    leftIcon,
    rightIcon,
    inputStyle = 'default',
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const getKeyboardType = () => {
        switch (type) {
            case 'email':
                return 'email-address';
            case 'number':
                return 'numeric';
            default:
                return 'default';
        }
    };

    const getAutoCapitalize = () => {
        switch (type) {
            case 'email':
                return 'none';
            default:
                return 'sentences';
        }
    };

    const renderRightIcon = () => {
        if (type === 'password') {
            return (
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="p-2"
                >
                    {showPassword ? (
                        <Eye size={20} color="#999999" variant="Outline" />
                    ) : (
                        <EyeSlash size={20} color="#999999" variant="Outline" />
                    )}
                </TouchableOpacity>
            );
        }
        return rightIcon;
    };

    const getInputStyleClasses = () => {
        if (error) {
            return {
                borderColor: COLORS.error,
                backgroundColor: 'rgba(255, 59, 48, 0.1)'
            };
        }

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

    const baseClasses = 'flex-row items-center border rounded-xl px-4';
    const inputStyles = getInputStyleClasses();
    const disabledClasses = disabled ? 'opacity-50' : '';

    return (
        <View className={`${className}`}>
            {label && (
                <Text className="text-gray-800 font-semibold mb-2 text-sm">
                    {label}
                </Text>
            )}

            <View
                className={`${baseClasses} ${disabledClasses}`}
                style={{
                    borderWidth: 1,
                    borderColor: inputStyles.borderColor,
                    backgroundColor: inputStyles.backgroundColor
                }}
            >
                {leftIcon && (
                    <View className="mr-3">
                        {leftIcon}
                    </View>
                )}

                <TextInput
                    className={`flex-1 py-4 text-black text-base ${multiline ? 'text-top' : ''}`}
                    placeholder={placeholder}
                    placeholderTextColor="#999999"
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={getKeyboardType()}
                    autoCapitalize={getAutoCapitalize()}
                    secureTextEntry={type === 'password' && !showPassword}
                    editable={!disabled}
                    multiline={multiline}
                    numberOfLines={multiline ? numberOfLines : 1}
                    textAlignVertical={multiline ? 'top' : 'center'}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />

                {renderRightIcon()}
            </View>

            {error && (
                <Text className="text-red-500 text-sm mt-1">
                    {error}
                </Text>
            )}
        </View>
    );
};

export default InputField;
