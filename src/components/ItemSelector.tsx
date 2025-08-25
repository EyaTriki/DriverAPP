import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Item {
    id: string;
    name: string;
    icon: string; // Icon name for iconsax
    quantity: number;
}

interface ItemSelectorProps {
    title?: string;
    items: Item[];
    onQuantityChange: (itemId: string, newQuantity: number) => void;
    className?: string;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({
    title = 'Items',
    items,
    onQuantityChange,
    className = '',
}) => {
    const handleIncrement = (itemId: string, currentQuantity: number) => {
        onQuantityChange(itemId, currentQuantity + 1);
    };

    const handleDecrement = (itemId: string, currentQuantity: number) => {
        if (currentQuantity > 0) {
            onQuantityChange(itemId, currentQuantity - 1);
        }
    };

    const renderItemIcon = (itemName: string) => {
        const iconSize = 20;
        const iconColor = "#6B7280";

        switch (itemName.toLowerCase()) {
            case 'sofa':
                return <FontAwesome5 name="couch" size={iconSize} color={iconColor} />;
            case 'mattress':
                return <FontAwesome5 name="bed" size={iconSize} color={iconColor} />;
            case 'fridge':
                return <FontAwesome5 name="snowflake" size={iconSize} color={iconColor} />;
            case 'paint':
                return <FontAwesome5 name="paint-roller" size={iconSize} color={iconColor} />;
            case 'rubbish':
                return <Ionicons name="trash-outline" size={iconSize} color={iconColor} />;
            case 'boxes':
                return <FontAwesome5 name="box" size={iconSize} color={iconColor} />;
            default:
                return <FontAwesome5 name="box" size={iconSize} color={iconColor} />;
        }
    };

    const renderItemCard = (item: Item) => (
        <View className="bg-white rounded-xl p-4">
            {/* Item Icon and Name */}
            <View className="items-center mb-4">
                <View className="w-8 h-8 mb-3 items-center justify-center">
                    {renderItemIcon(item.name)}
                </View>
                <Text className="text-sm font-medium text-gray-900 text-center">
                    {item.name}
                </Text>
            </View>

            {/* Quantity Selector */}
            <View className="flex-row items-center justify-center mt-2">
                <TouchableOpacity
                    onPress={() => handleDecrement(item.id, item.quantity)}
                    className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${item.quantity > 0 ? 'bg-gray-200' : 'bg-gray-100'
                        }`}
                    disabled={item.quantity === 0}
                >
                    <Text className={`text-lg font-bold ${item.quantity > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                        -
                    </Text>
                </TouchableOpacity>

                <Text className="text-lg font-bold text-gray-900 min-w-[20px] text-center">
                    {item.quantity}
                </Text>

                <TouchableOpacity
                    onPress={() => handleIncrement(item.id, item.quantity)}
                    className="w-8 h-8 rounded-full bg-[#8CC044] items-center justify-center ml-3"
                >
                    <Text className="text-lg font-bold text-white">
                        +
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View className={`${className}`}>
            {/* Section Header */}
            <View className="flex-row items-center mb-4">
                <View className="w-5 h-7  rounded-sm mr-2 items-center justify-center">
                    <FontAwesome5 name="boxes" size={16} color="#8CC044" />
                </View>
                <Text className="text-lg font-semibold text-gray-900">{title}</Text>
            </View>

            {/* Items Grid */}
            <View>
                {Array.from({ length: Math.ceil(items.length / 2) }, (_, rowIndex) => (
                    <View key={rowIndex} className="flex-row mb-4">
                        {items.slice(rowIndex * 2, rowIndex * 2 + 2).map((item) => (
                            <View key={item.id} className="flex-1 px-3">
                                {renderItemCard(item)}
                            </View>
                        ))}
                        {/* Fill empty space if odd number of items */}
                        {items.slice(rowIndex * 2, rowIndex * 2 + 2).length === 1 && (
                            <View className="flex-1 mx-3" />
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
};

ItemSelector.displayName = 'ItemSelector';

export default ItemSelector;
