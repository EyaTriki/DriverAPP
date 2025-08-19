// components/ActionPill.tsx
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Size = 'sm' | 'md' | 'lg';

type Props = {
    label: string;
    onPress: () => void;
    disabled?: boolean;

    /** size of the pill + text + icon bubble */
    size?: Size;

    /** put the icon on the left or right (default: right) */
    iconPosition?: 'left' | 'right';

    /** pass your own icon node if you want full control */
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;

    /** convenience: use Ionicons by name (only used if leftIcon/rightIcon not provided) */
    ionIconName?: string;           // e.g., "arrow-forward"
    ionIconSize?: number;           // overrides the size mapping
    ionIconColor?: string;          // default "#fff"

    /** style overrides */
    className?: string;             // container
    textClassName?: string;         // text
    bubbleClassName?: string;       // rounded white/20 bubble
};

const sizeMap: Record<Size, { h: string; text: string; bubble: string; ion: number }> = {
    sm: { h: 'h-10', text: 'text-sm', bubble: 'w-6 h-6', ion: 16 },
    md: { h: 'h-12', text: 'text-base', bubble: 'w-7 h-7', ion: 18 },
    lg: { h: 'h-14', text: 'text-lg', bubble: 'w-8 h-8', ion: 20 },
};

const ActionPill: React.FC<Props> = ({
    label,
    onPress,
    disabled = false,
    size = 'md',
    iconPosition = 'right',
    leftIcon,
    rightIcon,
    ionIconName = 'arrow-forward',
    ionIconSize,
    ionIconColor = '#fff',
    className = '',
    textClassName = '',
    bubbleClassName = '',
}) => {
    const s = sizeMap[size];

    const DefaultIon = (
        <Ionicons
            name={ionIconName}
            size={ionIconSize ?? s.ion}
            color={ionIconColor}
        />
    );

    const Bubble = ({ children }: { children: React.ReactNode }) => (
        <View className={`rounded-full bg-white/20 items-center justify-center ${s.bubble} ${bubbleClassName}`}>
            {children}
        </View>
    );

    const Left = leftIcon ? <Bubble>{leftIcon}</Bubble> : <Bubble>{DefaultIon}</Bubble>;
    const Right = rightIcon ? <Bubble>{rightIcon}</Bubble> : <Bubble>{DefaultIon}</Bubble>;

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            disabled={disabled}
            className={`w-full ${s.h} rounded-xl flex-row items-center justify-center gap-2
                  ${disabled ? 'bg-gray-300' : 'bg-primaryGreen'} ${className}`}
        >
            {iconPosition === 'left' ? Left : null}

            <Text className={`text-white font-poppins-bold ${s.text} ${textClassName}`}>
                {label}
            </Text>

            {iconPosition === 'right' ? Right : null}
        </TouchableOpacity>
    );
};

export default ActionPill;
