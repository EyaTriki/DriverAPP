import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'black' | 'white' | 'transparent';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    className?: string;       // container overrides
    textClassName?: string;   // ✅ text overrides (e.g. 'text-white')
    leftIcon?: React.ReactNode;   // ✅ optional icon
    rightIcon?: React.ReactNode;  // ✅ optional icon
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    className = '',
    textClassName = '',
    leftIcon,
    rightIcon,
}) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'primary': return 'bg-primaryGreen';
            case 'secondary': return 'bg-gray-600';
            case 'danger': return 'bg-red-500';
            case 'outline': return 'border border-green-600 bg-transparent';
            case 'black': return 'bg-black';
            case 'white': return 'bg-white';
            case 'transparent': return 'bg-transparent';
            default: return 'bg-black';
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'small': return 'py-2 px-4';
            case 'medium': return 'py-4 px-6';
            case 'large': return 'py-5 px-8';
            default: return 'py-4 px-6';
        }
    };

    const getTextSizeClasses = () => {
        switch (size) {
            case 'small': return 'text-sm';
            case 'medium': return 'text-base';
            case 'large': return 'text-lg';
            default: return 'text-base';
        }
    };

    const baseClasses = 'rounded-xl items-center justify-center flex-row gap-1.5'; // gap ≈ 6px
    const variantClasses = getVariantClasses();
    const sizeClasses = getSizeClasses();
    const textSizeClasses = getTextSizeClasses();
    const disabledClasses = disabled || loading ? 'opacity-50' : '';

    return (
        <TouchableOpacity
            className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.9}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'outline' ? '#8CC044' : '#FFFFFF'}
                />
            ) : (
                <>
                    {leftIcon}
                    <Text className={`font-semibold ${textSizeClasses} ${textClassName}`}>
                        {title}
                    </Text>
                    {rightIcon}
                </>
            )}
        </TouchableOpacity>
    );
};

export default Button;
