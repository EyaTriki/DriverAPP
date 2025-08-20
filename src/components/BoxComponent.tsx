import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowRight2 } from 'iconsax-react-native';

type IconType = React.ComponentType<any>;

/**
 * BoxComponent - A reusable box component for navigation items
 * 
 * This component is used in both Profile and Settings screens to display
 * navigation items with icons, titles, and optional subtitles.
 * 
 * @param title - The main text to display
 * @param icon - The icon component to display
 * @param onPress - Optional callback when the box is pressed
 * @param danger - Whether to show danger styling (red colors)
 * @param variant - The visual variant ('default', 'profile', 'settings')
 * @param subtitle - Optional subtitle text
 * @param showArrow - Whether to show the right arrow icon
 * @param disabled - Whether the box is disabled
 */
interface BoxComponentProps {
    title: string;
    icon: IconType;
    onPress?: () => void;
    danger?: boolean;
    variant?: 'default' | 'profile' | 'settings';
    subtitle?: string;
    showArrow?: boolean;
    disabled?: boolean;
    textClass?: string;
}

const BoxComponent: React.FC<BoxComponentProps> = ({
    title,
    icon: Icon,
    onPress,
    danger = false,
    subtitle,
    showArrow = true,
    disabled = false,
    textClass,
}) => {
    const getIconColor = () => {
        if (danger) return '#E53935';
        return '#111827';
    };

    const getTextColor = () => {
        if (danger) return 'text-red-500';
        return 'text-gray-900';
    };

    const getArrowColor = () => {
        if (danger) return '#EF4444';
        return '#9CA3AF';
    };

    const getIconContainerStyle = () => {
        const baseStyle = 'w-11 h-11 items-center justify-center mr-3';
        return baseStyle;
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            disabled={disabled}
            className="bg-white rounded-3xl px-4 py-4 mb-4"
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                    <View className={getIconContainerStyle()}>
                        <Icon size={24} color={getIconColor()} variant="Outline" />
                    </View>
                    <View className="flex-1">
                        <Text className={`${textClass || 'text-base font-semibold'} ${getTextColor()}`}>
                            {title}
                        </Text>
                        {subtitle && (
                            <Text className="text-sm text-gray-500 mt-1">
                                {subtitle}
                            </Text>
                        )}
                    </View>
                </View>
                {showArrow && (
                    <ArrowRight2 size={22} color={getArrowColor()} variant="Outline" />
                )}
            </View>
        </TouchableOpacity>
    );
};

export default BoxComponent;
