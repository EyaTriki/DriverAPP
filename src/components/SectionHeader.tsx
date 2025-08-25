import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SectionHeaderProps {
    title: string;
    iconName?: string;
    iconColor?: string;
    iconSize?: number;
    className?: string;
    titleClassName?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    iconName = 'information-circle',
    iconColor = '#8CC044',
    iconSize = 23,
    className = '',
    titleClassName = '',
}) => {
    return (
        <View className={`flex-row items-center mb-4 ${className}`}>
            <View className="mr-3">
                <Ionicons name={iconName as any} size={iconSize} color={iconColor} />
            </View>
            <Text className={`text-base font-poppins-medium text-[#374151] mt-1 ${titleClassName}`}>
                {title}
            </Text>
        </View>
    );
};

export default SectionHeader;
