import React from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';

export type TabKey = 'approved' | 'pending' | 'rejected' | 'all';

type Item = { key: TabKey; label: string };

type Props = {
    value: TabKey;
    onChange: (k: TabKey) => void;
    items: Item[];
};

const SegmentTabs: React.FC<Props> = ({ value, onChange, items }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-5"
        // contentContainerStyle={{ paddingRight: 12 }}
        >
            <View className="flex-row gap-1.5 justify-center items-center px-1 py-1 ">
                {items.map(it => {
                    const active = value === it.key;
                    return (
                        <TouchableOpacity
                            key={it.key}
                            onPress={() => onChange(it.key)}
                            className={`px-4 py-2 rounded-[6px] border justify-center items-center ${active ? 'bg-primaryGreen border-GrayOpacity50' : 'bg-white border-white'
                                }`}
                        >
                            <Text
                                className={`${active ? 'text-white' : 'text-gray'} font-poppins-semibold text-base`}
                            >
                                {it.label}
                            </Text>
                        </TouchableOpacity>

                    );
                })}
            </View>
        </ScrollView >
    );
};

export default SegmentTabs;
