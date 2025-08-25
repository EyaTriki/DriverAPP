// ChatScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
    SafeAreaView, 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    ScrollView, 
    StatusBar,
    Image,
    Alert,
    Animated,
    Dimensions,
    RefreshControl,
    Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSocketStore } from '../stores/socket';
import { useAuthStore } from '../stores/authStore';
import { useMessagesStore } from '../stores/messages';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import { Recording } from '@react-native-community/audio-toolkit';

interface ChatScreenProps {
    navigation: any;
    route: any;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    // Get roomId from route params - use a valid MongoDB ObjectId format
    const roomId = route.params?.roomId || '67cb6812c9e768ec25d39561'; // Default MongoDB ObjectId
    const isDriver = route.params?.isDriver || false;

    // Socket store
    const {
        messages: socketMessages,
        chatHistory,
        isTyping: socketTyping,
        isConnected,
        joinRoom,
        leaveRoom,
        getMessagesByRoomId,
        refreshMessages,
        sendMessage,
        sendAudioMessage,
        markAllAsSeen,
        startTyping,
        stopTyping,
    } = useSocketStore();

    // Messages store for API integration
    const {
        messages: apiMessages,
        isLoading: messagesLoading,
        error: messagesError,
        fetchMessagesWithHelper,
        fetchMessagesWithDriver,
        fetchMessagesWithAdmin,
        sendVoiceMessage: sendVoiceMessageAPI,
        addMessage,
    } = useMessagesStore();

    // Auth store for user info
    const { user } = useAuthStore();

    // Use socket messages (they now include room-specific messages)
    const messages = socketMessages;

    const recordingTimer = useRef<NodeJS.Timeout | null>(null);
    const pulseAnimation = useRef(new Animated.Value(1)).current;
    const scrollViewRef = useRef<ScrollView>(null);
    const recordingRef = useRef<Recording | null>(null);
    // Audio recording state
    const [audioRecordingPath, setAudioRecordingPath] = useState<string | null>(null);

    // Join room when component mounts and fetch messages
    useEffect(() => {
        if (isConnected && roomId) {
            joinRoom(roomId);
            // Mark all messages as seen when entering the room
            if (user?.id) {
                markAllAsSeen(roomId, user.id);
            }
        }

        return () => {
            if (roomId) {
                leaveRoom(roomId);
            }
        };
    }, [isConnected, roomId, user?.id]);

    // Fetch messages when room changes (handled by socket joinRoom)
    useEffect(() => {
        if (isConnected && roomId && user?.id) {
            // Messages will be fetched automatically when joining the room
            console.log('🔄 Room changed, messages will be fetched via socket');
        }
    }, [roomId, isConnected, user?.id]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const startPulseAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnimation, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnimation, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const stopPulseAnimation = () => {
        pulseAnimation.setValue(1);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        if (isConnected && roomId) {
            refreshMessages(roomId);
        }
        setTimeout(() => setRefreshing(false), 1000);
    };

    // File upload functions
    const uploadFile = async (file: any, messageText: string = '') => {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                type: file.type,
                name: file.name || 'file',
            });
            formData.append('roomId', roomId);
            formData.append('senderId', user?.id || '');
            formData.append('messageText', messageText);

            const response = await fetch('http://192.168.100.5:3000/api/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${useAuthStore.getState().token}`,
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log('File uploaded successfully:', result);
            } else {
                console.error('Upload failed:', response.status);
                Alert.alert('Error', 'Failed to upload file');
            }
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Error', 'Failed to upload file');
        }
    };

    const uploadAudio = async (audioFile: any, audioDuration: number) => {
        try {
            const formData = new FormData();
            formData.append('audio', {
                uri: audioFile.uri,
                type: audioFile.type,
                name: audioFile.name || 'audio.m4a',
            });
            formData.append('roomId', roomId);
            formData.append('senderId', user?.id || '');
            formData.append('messageText', '');
            formData.append('audioDuration', audioDuration.toString());

            const response = await fetch('http://192.168.100.5:3000/api/upload/audio', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${useAuthStore.getState().token}`,
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Audio uploaded successfully:', result);
                
                // Create audio message with the uploaded file URL
                if (result.audioUrl && isConnected && user?.id) {
                    const audioMessage = {
                        _id: `temp_audio_${Date.now()}`,
                        roomId,
                        senderId: user.id,
                        messageText: result.audioUrl, // Use the uploaded audio URL
                        image: user.picture || undefined,
                        audioUrl: result.audioUrl,
                        audioDuration: recordingDuration,
                        messageType: 'audio' as const,
                        seen: false,
                        createdAt: new Date(),
                    };

                    // Add to local messages immediately
                    const { messages } = useSocketStore.getState();
                    useSocketStore.setState({ 
                        messages: [...messages, audioMessage] 
                    });

                    // Send via socket to create the message in the database
                    const { socket } = useSocketStore.getState();
                    if (socket) {
                        socket.emit('sendMessage', {
                            roomId,
                            senderId: user.id,
                            messageText: result.audioUrl,
                            isDriver,
                            messageType: 'audio' as const,
                            audioUrl: result.audioUrl,
                            audioDuration: recordingDuration,
                        });
                    }
                }
            } else {
                console.error('Audio upload failed:', response.status);
                Alert.alert('Error', 'Failed to upload audio');
            }
        } catch (error) {
            console.error('Audio upload error:', error);
            Alert.alert('Error', 'Failed to upload audio');
        }
    };

    const handleImagePicker = () => {
        Alert.alert(
            'Select Image',
            'Choose an option',
            [
                {
                    text: 'Camera',
                    onPress: () => launchCamera({
                        mediaType: 'photo',
                        quality: 0.8,
                    }, (response) => {
                        if (response.assets && response.assets[0]) {
                            uploadFile(response.assets[0]);
                        }
                    }),
                },
                {
                    text: 'Gallery',
                    onPress: () => launchImageLibrary({
                        mediaType: 'photo',
                        quality: 0.8,
                    }, (response) => {
                        if (response.assets && response.assets[0]) {
                            uploadFile(response.assets[0]);
                        }
                    }),
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]
        );
    };

    const handleDocumentPicker = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            
            if (result[0]) {
                uploadFile(result[0]);
            }
        } catch (err) {
            if (!DocumentPicker.isCancel(err)) {
                console.error('Document picker error:', err);
                Alert.alert('Error', 'Failed to pick document');
            }
        }
    };

    const onStartRecord = async () => {
        try {
            setIsRecording(true);
            startPulseAnimation();
            setRecordingTime(0);
            setRecordingDuration(0);
            
            // Start real audio recording
            const recording = new Recording();
            const audioPath = `audio_${Date.now()}.m4a`;
            
            await recording.prepare((err, fsPath) => {
                if (err) {
                    console.error('Recording prepare error:', err);
                    Alert.alert('Error', 'Failed to prepare recording');
                    setIsRecording(false);
                    stopPulseAnimation();
                    return;
                }
                
                setAudioRecordingPath(fsPath);
                console.log('Audio recording prepared:', fsPath);
                
                // Start recording
                recording.record((err) => {
                    if (err) {
                        console.error('Recording error:', err);
                        Alert.alert('Error', 'Failed to start recording');
                        setIsRecording(false);
                        stopPulseAnimation();
                    }
                });
            });
            
            // Start recording timer
            recordingTimer.current = setInterval(() => {
                setRecordingTime(prev => prev + 1000);
                setRecordingDuration(prev => prev + 1000);
            }, 1000);
            
            console.log('Real audio recording started');
            
        } catch (error) {
            console.error('Error starting recording:', error);
            Alert.alert('Error', 'Failed to start recording');
            setIsRecording(false);
            stopPulseAnimation();
        }
    };

    const onStopRecord = async () => {
        try {
            if (recordingTimer.current) {
                clearInterval(recordingTimer.current);
                recordingTimer.current = null;
            }
            
            setIsRecording(false);
            stopPulseAnimation();
            
            // Stop audio recording and get the file
            if (audioRecordingPath) {
                const recording = new Recording();
                
                recording.stop((err, fsPath) => {
                    if (err) {
                        console.error('Stop recording error:', err);
                        Alert.alert('Error', 'Failed to stop recording');
                        return;
                    }
                    
                    console.log('Recording stopped, file saved at:', fsPath);
                    
                    // Create audio file object for upload
                    const audioFile = {
                        uri: fsPath,
                        type: 'audio/m4a',
                        name: `audio_${Date.now()}.m4a`,
                    };
                    
                    // Upload the real audio file
                    if (isConnected && user?.id && recordingDuration > 0) {
                        uploadAudio(audioFile, recordingDuration);
                    }
                });
            }
            
            setRecordingTime(0);
            setRecordingDuration(0);
            setAudioRecordingPath(null);
        } catch (error) {
            console.error('Error stopping recording:', error);
            Alert.alert('Error', 'Failed to stop recording');
        }
    };

    const onStartPlay = async (audioUrl: string, messageId: string) => {
        try {
            setIsPlaying(true);
            setCurrentPlayingId(messageId);
            
            // For now, simulate audio playback since the library doesn't have play method
            // In a real implementation, you would use a proper audio player library
            console.log('Playing started:', audioUrl);
            
            // Simulate playback duration based on the message's audioDuration
            const message = messages.find(m => m._id === messageId);
            const duration = message?.audioDuration || 3000;
            setTimeout(() => {
                setIsPlaying(false);
                setCurrentPlayingId(null);
            }, duration);
            
        } catch (error) {
            console.error('Error starting playback:', error);
            Alert.alert('Error', 'Failed to play audio');
            setIsPlaying(false);
            setCurrentPlayingId(null);
        }
    };

    const onStopPlay = async () => {
        try {
            setIsPlaying(false);
            setCurrentPlayingId(null);
            console.log('Playing stopped');
        } catch (error) {
            console.error('Error stopping playback:', error);
            setIsPlaying(false);
            setCurrentPlayingId(null);
        }
    };

    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSend = () => {
        if (message.trim() && isConnected && user?.id) {
            sendMessage(roomId, message.trim(), isDriver);
            setMessage('');
        }
    };

    const handleVoicePress = () => {
        if (isRecording) {
            onStopRecord();
        } else {
            onStartRecord();
        }
    };

    const handleTextChange = (text: string) => {
        setMessage(text);
        
        // Handle typing indicators
        if (isConnected && user?.id) {
            if (text.length > 0 && !isTyping) {
                setIsTyping(true);
                startTyping(roomId, user.id, isDriver);
            } else if (text.length === 0 && isTyping) {
                setIsTyping(false);
                stopTyping(roomId, user.id, isDriver);
            }
        }
    };

    const renderAudioMessage = (msg: any) => (
        <View 
            className={`flex-row items-center px-4 py-3 rounded-2xl ${
                msg.senderId === user?.id
                    ? 'bg-green-500 rounded-br-md' 
                    : 'bg-white rounded-bl-md'
            }`}
        >
            <TouchableOpacity
                onPress={() => {
                    if (currentPlayingId === msg._id) {
                        onStopPlay();
                    } else {
                        if (msg.audioUrl) {
                            onStartPlay(msg.audioUrl, msg._id);
                        }
                    }
                }}
                className="flex-row items-center"
            >
                <Ionicons 
                    name={currentPlayingId === msg._id ? "pause" : "play"} 
                    size={20} 
                    color={msg.senderId === user?.id ? 'white' : '#10B981'} 
                />
                <View className="ml-2">
                    <View className="w-32 h-1 bg-gray-300 rounded-full">
                        <View 
                            className="h-1 bg-green-500 rounded-full"
                            style={{ width: currentPlayingId === msg._id ? '60%' : '30%' }}
                        />
                    </View>
                    <Text 
                        className={`text-xs mt-1 ${
                            msg.senderId === user?.id ? 'text-white' : 'text-gray-500'
                        }`}
                    >
                        {formatTime(msg.audioDuration || 0)}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    const renderImageMessage = (msg: any) => (
        <View 
            className={`px-2 py-2 rounded-2xl ${
                msg.senderId === user?.id
                    ? 'bg-green-500 rounded-br-md' 
                    : 'bg-white rounded-bl-md'
            }`}
        >
            <Image 
                source={{ uri: msg.fileUrl || msg.image }}
                className="w-48 h-48 rounded-lg"
                resizeMode="cover"
            />
            {msg.messageText && (
                <Text 
                    className={`text-sm mt-2 ${
                        msg.senderId === user?.id ? 'text-white' : 'text-gray-800'
                    }`}
                >
                    {msg.messageText}
                </Text>
            )}
        </View>
    );

    const renderFileMessage = (msg: any) => (
        <View 
            className={`px-4 py-3 rounded-2xl ${
                msg.senderId === user?.id
                    ? 'bg-green-500 rounded-br-md' 
                    : 'bg-white rounded-bl-md'
            }`}
        >
            <TouchableOpacity className="flex-row items-center">
                <Ionicons 
                    name="document" 
                    size={24} 
                    color={msg.senderId === user?.id ? 'white' : '#10B981'} 
                />
                <View className="ml-3 flex-1">
                    <Text 
                        className={`text-sm font-medium ${
                            msg.senderId === user?.id ? 'text-white' : 'text-gray-800'
                        }`}
                    >
                        {msg.fileUrl ? msg.fileUrl.split('/').pop() : 'Document'}
                    </Text>
                    <Text 
                        className={`text-xs ${
                            msg.senderId === user?.id ? 'text-white opacity-80' : 'text-gray-500'
                        }`}
                    >
                        {msg.fileType || 'File'}
                    </Text>
                </View>
                <Ionicons 
                    name="download" 
                    size={20} 
                    color={msg.senderId === user?.id ? 'white' : '#10B981'} 
                />
            </TouchableOpacity>
            {msg.messageText && (
                <Text 
                    className={`text-sm mt-2 ${
                        msg.senderId === user?.id ? 'text-white' : 'text-gray-800'
                    }`}
                >
                    {msg.messageText}
                </Text>
            )}
        </View>
    );

    const renderMessage = (msg: any) => (
        <View 
            key={msg._id} 
            className={`flex-row items-end mb-3 ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
        >
            {msg.senderId !== user?.id && (
                <View className="w-8 h-8 rounded-full bg-gray-300 mr-2 mb-1">
                    <Image 
                        source={require('../assets/images/avatar-placeholder.png')}
                        className="w-full h-full rounded-full"
                    />
                </View>
            )}
            
            <View className={`max-w-[70%] ${msg.senderId === user?.id ? 'items-end' : 'items-start'}`}>
                {msg.messageType === 'audio' ? (
                    renderAudioMessage(msg)
                ) : msg.messageType === 'image' ? (
                    renderImageMessage(msg)
                ) : msg.messageType === 'file' ? (
                    renderFileMessage(msg)
                ) : (
                    <View 
                        className={`px-4 py-3 rounded-2xl ${
                            msg.senderId === user?.id
                                ? 'bg-green-500 rounded-br-md' 
                                : 'bg-white rounded-bl-md'
                        }`}
                    >
                        <Text 
                            className={`text-base ${
                                msg.senderId === user?.id ? 'text-white' : 'text-gray-800'
                            }`}
                        >
                            {msg.messageText}
                        </Text>
                    </View>
                )}
                
                <View className="flex-row items-center mt-1">
                    <Text className="text-xs text-gray-500 mr-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    {msg.senderId === user?.id && msg.seen && (
                        <Ionicons name="checkmark-done" size={14} color="#10B981" />
                    )}
                </View>
            </View>
        </View>
    );

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (recordingTimer.current) {
                clearInterval(recordingTimer.current);
            }
        };
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            
            {/* Header */}
            <View className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-200">
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 bg-green-500 rounded-full items-center justify-center"
                >
                    <Ionicons name="chevron-back" size={20} color="white" />
                </TouchableOpacity>
                
                <View className="flex-1 items-center">
                    <Text className="text-lg font-bold text-gray-900">Chat</Text>
                    <Text className="text-sm text-gray-500">
                        {isConnected ? 'Connected' : 'Connecting...'}
                    </Text>
                </View>
                
                <TouchableOpacity 
                    onPress={onRefresh}
                    className="w-10 h-10 bg-green-500 rounded-full items-center justify-center"
                    disabled={refreshing}
                >
                    <Ionicons 
                        name="refresh" 
                        size={20} 
                        color="white"
                        style={{ transform: [{ rotate: refreshing ? '180deg' : '0deg' }] }}
                    />
                </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView 
                ref={scrollViewRef}
                className="flex-1 px-4 pt-4"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#10B981']}
                        tintColor="#10B981"
                    />
                }
            >
                {messages.map(renderMessage)}
                
                {/* Typing indicator */}
                {socketTyping[roomId] && (
                    <View className="flex-row items-end mb-3">
                        <View className="w-8 h-8 rounded-full bg-gray-300 mr-2 mb-1">
                            <Image 
                                source={require('../assets/images/avatar-placeholder.png')}
                                className="w-full h-full rounded-full"
                            />
                        </View>
                        <View className="bg-white px-4 py-3 rounded-2xl rounded-bl-md">
                            <Text className="text-base text-gray-800">Writing ...</Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Recording Indicator */}
            {isRecording && (
                <View className="absolute bottom-24 left-0 right-0 bg-red-500 mx-4 rounded-lg p-4">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Animated.View 
                                style={{ 
                                    transform: [{ scale: pulseAnimation }],
                                    backgroundColor: 'white',
                                    width: 12,
                                    height: 12,
                                    borderRadius: 6,
                                }}
                            />
                            <Text className="text-white ml-3 font-semibold">
                                Recording... {formatTime(recordingTime)}
                            </Text>
                        </View>
                        <TouchableOpacity 
                            onPress={onStopRecord}
                            className="bg-white rounded-full p-2"
                        >
                            <Ionicons name="stop" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Input Area */}
            <View className="bg-white px-4 py-3 border-t border-gray-200 mb-20">
                <View className="flex-row items-center">
                    <TouchableOpacity 
                        onPress={handleImagePicker}
                        className="mr-3"
                    >
                        <Ionicons name="camera" size={24} color="#374151" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        onPress={handleDocumentPicker}
                        className="mr-3"
                    >
                        <Ionicons name="document" size={24} color="#374151" />
                    </TouchableOpacity>
                    
                    <View className="flex-1 bg-gray-100 rounded-full px-4 py-2">
                        <TextInput
                            value={message}
                            onChangeText={handleTextChange}
                            placeholder="Enter your message ..."
                            placeholderTextColor="#9CA3AF"
                            className="text-base text-gray-800"
                            multiline
                            editable={isConnected}
                        />
                    </View>
                    
                    {message.trim() ? (
                        <TouchableOpacity 
                            onPress={handleSend}
                            className="ml-3 w-10 h-10 bg-green-500 rounded-full items-center justify-center"
                            disabled={!isConnected}
                        >
                            <Ionicons 
                                name="send" 
                                size={18} 
                                color="white"
                            />
                        </TouchableOpacity>
                    ) : (
                                                 <TouchableOpacity 
                             onPress={handleVoicePress}
                             className={`ml-3 w-10 h-10 rounded-full items-center justify-center ${
                                 isRecording ? 'bg-red-500' : 'bg-green-500'
                             }`}
                             disabled={!isConnected}
                         >
                            <Ionicons 
                                name={isRecording ? "stop" : "mic"} 
                                size={18} 
                                color="white"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ChatScreen;
