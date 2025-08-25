import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { COLORS } from '../constants/colors';

export type IconType =
    | 'ionicons'
    | 'material'
    | 'fontawesome'
    | 'fontawesome5'
    | 'svg';

export type StorageCardProps = {
    title: string;
    subtitle: string;
    iconName: string;
    iconType?: IconType;
    iconColor: string;
    backgroundColor: string;
    onPress?: () => void;
    // For custom SVG icons or other icon components
    CustomIcon?: React.ComponentType<any>;
};

const StorageCard: React.FC<StorageCardProps> = ({
    title,
    subtitle,
    iconName,
    iconType = 'ionicons',
    iconColor,
    backgroundColor,
    onPress,
    CustomIcon,
}) => {
    const shadow = {
        // elevation: 2,
        shadowColor: '#000',
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // shadowOffset: { width: 0, height: 2 },
    };

    const renderIcon = () => {
        const iconSize = 26;

        // If a custom icon is provided, use it
        if (CustomIcon) {
            return <CustomIcon size={iconSize} color={iconColor} />;
        }

        switch (iconType) {
            case 'material':
                return <MaterialIcons name={iconName as any} size={iconSize} color={iconColor} />;
            case 'fontawesome':
                return <FontAwesome name={iconName as any} size={iconSize} color={iconColor} />;
            case 'fontawesome5':
                return <FontAwesome5 name={iconName as any} size={iconSize} color={iconColor} />;
            case 'svg':
                // For SVG icons, you would typically pass the icon component as CustomIcon
                return null;
            case 'ionicons':
            default:
                return <Ionicons name={iconName as any} size={iconSize} color={iconColor} />;
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            className="mb-4"
        >
            <View
                className="w-full rounded-xl bg-white p-4 flex-row items-center"
                style={shadow}
            >
                {/* Left Icon */}
                <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor }}
                >
                    {renderIcon()}
                </View>

                {/* Text Content */}
                <View className="flex-1">
                    <Text className="font-poppins-semibold text-base text-gray-900 mb-1">
                        {title}
                    </Text>
                    <Text className="font-poppins-regular text-sm text-gray-600">
                        {subtitle}
                    </Text>
                </View>

                {/* Right Chevron */}
                <Ionicons name="chevron-forward" size={20} color={iconColor} />
            </View>
        </TouchableOpacity>
    );
};

export default StorageCard;
