import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    className = '',
}) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'primary':
                return 'bg-green-600 text-white';
            case 'secondary':
                return 'bg-gray-600 text-white';
            case 'danger':
                return 'bg-red-500 text-white';
            case 'outline':
                return 'border border-green-600 text-green-600 bg-transparent';
            default:
                return 'bg-green-600 text-white';
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return 'py-2 px-4';
            case 'medium':
                return 'py-4 px-6';
            case 'large':
                return 'py-5 px-8';
            default:
                return 'py-4 px-6';
        }
    };

    const getTextSizeClasses = () => {
        switch (size) {
            case 'small':
                return 'text-sm';
            case 'medium':
                return 'text-base';
            case 'large':
                return 'text-lg';
            default:
                return 'text-base';
        }
    };

    const baseClasses = 'rounded-xl items-center justify-center';
    const variantClasses = getVariantClasses();
    const sizeClasses = getSizeClasses();
    const textSizeClasses = getTextSizeClasses();
    const disabledClasses = disabled || loading ? 'opacity-50' : '';

    return (
        <TouchableOpacity
            className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'outline' ? '#8CC044' : '#FFFFFF'}
                />
            ) : (
                <Text className={`font-semibold ${textSizeClasses}`}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

export default Button;
