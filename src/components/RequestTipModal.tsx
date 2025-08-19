// components/RequestTipModal.tsx
import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Pressable,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // or 'react-native-vector-icons/Ionicons'

type Props = {
    visible: boolean;
    onClose: () => void;
    onConfirm: (note: string) => void;
    initialNote?: string;
    title?: string;
};

const RequestTipModal: React.FC<Props> = ({
    visible,
    onClose,
    onConfirm,
    initialNote = '',
    title = 'Request tip',
}) => {
    const [note, setNote] = useState(initialNote);

    useEffect(() => {
        if (visible) setNote(initialNote);
    }, [visible, initialNote]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            presentationStyle="overFullScreen" // helps on iOS
            onRequestClose={onClose}
        // className="py-16 pt-72 pb-24"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1 justify-center items-center   pt-78"
            >

                {/* Backdrop */}
                <Pressable
                    onPress={onClose}
                    className="absolute inset-0 bg-black/50"
                />

                {/* Dialog */}
                <View className="w-[92%] max-w-[360px] bg-white rounded-2xl p-5 gap-1 " style={{ minHeight: 400 }} >
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-xl font-bold text-gray-900">{title}</Text>
                        <TouchableOpacity
                            onPress={onClose}
                            className="w-9 h-9 rounded-xl bg-gray-100 items-center justify-center"

                        >
                            <Ionicons name="close" size={22} color="#0F172A" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-sm text-gray-800 mb-2">Note</Text>
                    <TextInput
                        value={note}
                        onChangeText={setNote}
                        placeholder="Add a note…"
                        multiline
                        numberOfLines={50}
                        style={{ height: 250 }}
                        textAlignVertical="top"
                        className="h-40 rounded-xl border border-containerGray px-4 py-3"
                    />

                    <View className="flex-row items-center justify-between mt-6 gap-3">
                        {/* Cancel Button */}
                        <TouchableOpacity
                            onPress={onClose}
                            activeOpacity={0.9}
                            className="flex-1 py-3 rounded-xl bg-white  border-gray-300 items-center justify-center"
                        >
                            <Text className="text-lg font-semibold text-black">Cancel</Text>
                        </TouchableOpacity>

                        {/* Confirm Button */}
                        <TouchableOpacity
                            onPress={() => onConfirm(note)}
                            activeOpacity={0.9}
                            className="flex-1 py-3 rounded-xl bg-[#8CC044] items-center justify-center"
                        >
                            <Text className="text-white font-semibold text-lg">Confirm</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default RequestTipModal;
