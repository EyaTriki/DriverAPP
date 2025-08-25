import { create } from 'zustand';
import io, { Socket } from 'socket.io-client';
import { Alert } from 'react-native';
import { useAuthStore } from './authStore';

// Types
interface Message {
  _id: string;
  roomId: string;
  senderId: string;
  messageText: string;
  image?: string;
  audioUrl?: string;
  audioDuration?: number;
  messageType: 'text' | 'audio';
  seen: boolean;
  seenAt?: Date;
  createdAt: Date;
}

interface Notification {
  _id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

interface DriverLocation {
  driverId: string;
  driverName: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  picture?: string;
  currentJobAddress?: string;
  nextJobAddress?: string;
  onBreak: boolean;
  startTime?: Date;
}

interface VehicleStats {
  allVehicles: number;
  onWork: number;
  tipping: number;
  onBreak: number;
}

interface UserStatus {
  userId: string;
  status: 'online' | 'offline';
}

interface TypingStatus {
  userId: string;
  isTyping: boolean;
  roomId: string;
}

interface SocketStore {
  // Socket connection
  socket: Socket | null;
  isConnected: boolean;
  
  // Chat state
  messages: Message[];
  currentRoomId: string | null;
  chatHistory: Message[];
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Truck/Driver state
  driverLocations: DriverLocation[];
  vehicleStats: VehicleStats | null;
  onlineUsers: string[];
  
  // UI state
  isTyping: { [roomId: string]: boolean };
  userStatuses: { [userId: string]: 'online' | 'offline' };
  
  // Actions
  connect: (token: string) => void;
  disconnect: () => void;
  
  // Chat actions
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  getMessagesByRoomId: (roomId: string) => void;
  refreshMessages: (roomId: string) => void;
  sendMessage: (roomId: string, messageText: string, isDriver: boolean) => void;
  sendAudioMessage: (roomId: string, audioUrl: string, audioDuration: number, isDriver: boolean) => void;
  markMessageAsSeen: (messageId: string, roomId: string, userId: string) => void;
  markAllAsSeen: (roomId: string, userId: string) => void;
  
  // Typing indicators
  startTyping: (roomId: string, senderId: string, isDriver: boolean) => void;
  stopTyping: (roomId: string, senderId: string, isDriver: boolean) => void;
  
  // Location actions
  sendLocation: (driverId: string, coordinates: { latitude: number; longitude: number }, role: string) => void;
  getLocations: () => void;
  
  // Notifications
  updateFCMToken: (userId: string, token: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  
  // Stats
  getTruckStats: () => void;
  getOnlineUsers: () => void;
  
  // Clear state
  clearChat: () => void;
  clearNotifications: () => void;
}

const SOCKET_URL = 'http://192.168.100.5:3000'; // Replace with your actual backend URL

export const useSocketStore = create<SocketStore>((set, get) => ({
  // Initial state
  socket: null,
  isConnected: false,
  messages: [],
  currentRoomId: null,
  chatHistory: [],
  notifications: [],
  unreadCount: 0,
  driverLocations: [],
  vehicleStats: null,
  onlineUsers: [],
  isTyping: {},
  userStatuses: {},

  // Connect to socket server
  connect: (token: string) => {
    try {
      console.log('🔌 Attempting to connect to socket server...');
      console.log('🔌 Socket URL:', SOCKET_URL);
      console.log('🔌 Token available:', !!token);
      console.log('🔌 Token value:', token);
      console.log('🔌 Token length:', token?.length);
      
      // Send token in Authorization header as expected by backend middleware
      const socket = io(SOCKET_URL, {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
        transports: ['websocket'],
        timeout: 20000,
      });

      socket.on('connect', () => {
        console.log('✅ Connected to socket server successfully');
        set({ socket, isConnected: true });
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
        set({ isConnected: false });
      });

             socket.on('connect_error', (error: any) => {
         console.error('❌ Socket connection error:', error);
         console.error('❌ Error details:', error.message);
         Alert.alert('Connection Error', 'Failed to connect to server');
       });

       socket.on('error', (error: any) => {
         console.error('❌ Socket error:', error);
         Alert.alert('Socket Error', error.message || 'An error occurred');
       });

      // Chat events
             socket.on('chatHistory', (messages: Message[]) => {
         set({ chatHistory: messages });
       });

       socket.on('messagesByRoomId', ({ success, roomId, messages, count }: { success: boolean; roomId: string; messages: Message[]; count: number }) => {
         console.log('📥 Received messages for room:', roomId, 'Count:', count);
         if (success && messages) {
           set({ messages });
         } else {
           console.error('❌ Failed to get messages for room:', roomId);
         }
       });

       socket.on('newMessage', (message: Message) => {
         const { currentRoomId, messages } = get();
         if (currentRoomId === message.roomId) {
           // Check if this is a replacement for a temporary message
           const tempMessageIndex = messages.findIndex(msg => 
             msg._id.startsWith('temp_') && 
             msg.senderId === message.senderId && 
             msg.messageText === message.messageText
           );
           
           if (tempMessageIndex !== -1) {
             // Replace temporary message with real one
             const updatedMessages = [...messages];
             updatedMessages[tempMessageIndex] = message;
             set({ messages: updatedMessages });
           } else {
             // Add new message if it's not a replacement
             set({ messages: [...messages, message] });
           }
         }
       });

      socket.on('messageSeenUpdate', ({ messageId, seenBy, seenAt }: { messageId: string; seenBy: string; seenAt: Date }) => {
        const { messages } = get();
        const updatedMessages = messages.map(msg =>
          msg._id === messageId ? { ...msg, seen: true, seenAt } : msg
        );
        set({ messages: updatedMessages });
      });

      socket.on('allMessagesSeen', ({ roomId, seenBy, seenAt }: { roomId: string; seenBy: string; seenAt: Date }) => {
        const { messages } = get();
        const updatedMessages = messages.map(msg =>
          msg.roomId === roomId && msg.senderId !== seenBy
            ? { ...msg, seen: true, seenAt }
            : msg
        );
        set({ messages: updatedMessages });
      });

      // Typing indicators
      socket.on('userTyping', ({ userId, isTyping, roomId }: TypingStatus) => {
        const { isTyping: currentTyping } = get();
        set({
          isTyping: {
            ...currentTyping,
            [roomId]: isTyping,
          },
        });
      });

      // Notifications
      socket.on('notification', (notification: Notification) => {
        const { notifications, unreadCount } = get();
        const newNotification = {
          ...notification,
          _id: Date.now().toString(), // Generate temporary ID
          createdAt: new Date(),
        };
        set({
          notifications: [newNotification, ...notifications],
          unreadCount: unreadCount + 1,
        });
        
        // Show alert for new notifications
        Alert.alert(notification.type, notification.message);
      });

      // Location updates
      socket.on('driverLocationUpdate', (location: DriverLocation) => {
        const { driverLocations } = get();
        const existingIndex = driverLocations.findIndex(
          loc => loc.driverId === location.driverId
        );
        
        if (existingIndex >= 0) {
          const updatedLocations = [...driverLocations];
          updatedLocations[existingIndex] = location;
          set({ driverLocations: updatedLocations });
        } else {
          set({ driverLocations: [...driverLocations, location] });
        }
      });

      socket.on('allDriverLocations', (locations: DriverLocation[]) => {
        set({ driverLocations: locations });
      });

      // Vehicle stats
      socket.on('vehicleStats', (stats: VehicleStats) => {
        set({ vehicleStats: stats });
      });

      // User status
      socket.on('userStatus', ({ userId, status }: UserStatus) => {
        const { userStatuses } = get();
        set({
          userStatuses: {
            ...userStatuses,
            [userId]: status,
          },
        });
      });

      socket.on('onlineUsersList', (users: string[]) => {
        set({ onlineUsers: users });
      });

    } catch (error) {
      console.error('Error connecting to socket:', error);
      Alert.alert('Error', 'Failed to connect to server');
    }
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  // Chat actions
  joinRoom: (roomId: string) => {
    const { socket } = get();
    if (socket) {
      console.log('🔌 Joining room:', roomId);
      socket.emit('joinRoom', roomId);
      set({ currentRoomId: roomId, messages: [] });
      
      // Fetch messages for this room
      socket.emit('getMessagesByRoomId', { roomId });
    }
  },

  leaveRoom: (roomId: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit('leaveRoom', roomId);
      set({ currentRoomId: null, messages: [] });
    }
  },

  getMessagesByRoomId: (roomId: string) => {
    const { socket } = get();
    if (socket) {
      console.log('📤 Requesting messages for room:', roomId);
      socket.emit('getMessagesByRoomId', { roomId });
    }
  },

  refreshMessages: (roomId: string) => {
    const { socket } = get();
    if (socket) {
      console.log('🔄 Refreshing messages for room:', roomId);
      socket.emit('getMessagesByRoomId', { roomId });
    }
  },

  sendMessage: (roomId: string, messageText: string, isDriver: boolean) => {
    const { socket } = get();
    if (socket) {
      // Get user ID from auth store
      const { user } = useAuthStore.getState();
      console.log('📤 Sending message to room:', roomId, 'from user:', user?.id);
      
      // Create a temporary message to show immediately
      const tempMessage = {
        _id: `temp_${Date.now()}`,
        roomId,
        senderId: user?.id || 'unknown',
        messageText,
        messageType: 'text' as const,
        seen: false,
        createdAt: new Date(),
      };
      
      // Add to local state immediately
      const { messages } = get();
      set({ messages: [...messages, tempMessage] });
      
      // Send to server
      socket.emit('sendMessage', {
        roomId,
        senderId: user?.id || 'unknown',
        messageText,
        isDriver,
        messageType: 'text',
      });
    }
  },

  sendAudioMessage: (roomId: string, audioUrl: string, audioDuration: number, isDriver: boolean) => {
    const { socket } = get();
    if (socket) {
      // Get user ID from auth store
      const { user } = useAuthStore.getState();
      console.log('📤 Sending audio message to room:', roomId, 'from user:', user?.id);
      
      // Create a temporary audio message to show immediately
      const tempMessage = {
        _id: `temp_${Date.now()}`,
        roomId,
        senderId: user?.id || 'unknown',
        messageText: '',
        messageType: 'audio' as const,
        audioUrl,
        audioDuration,
        seen: false,
        createdAt: new Date(),
      };
      
      // Add to local state immediately
      const { messages } = get();
      set({ messages: [...messages, tempMessage] });
      
      // Send to server
      socket.emit('sendAudioMessage', {
        roomId,
        senderId: user?.id || 'unknown',
        messageText: '',
        isDriver,
        audioUrl,
        audioDuration,
      });
    }
  },

  markMessageAsSeen: (messageId: string, roomId: string, userId: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit('messageSeen', { roomId, messageId, userId });
    }
  },

  markAllAsSeen: (roomId: string, userId: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit('markAllAsSeen', { roomId, userId });
    }
  },

  // Typing indicators
  startTyping: (roomId: string, senderId: string, isDriver: boolean) => {
    const { socket } = get();
    if (socket) {
      socket.emit('typingStart', { roomId, senderId, isDriver });
    }
  },

  stopTyping: (roomId: string, senderId: string, isDriver: boolean) => {
    const { socket } = get();
    if (socket) {
      socket.emit('typingStop', { roomId, senderId, isDriver });
    }
  },

  // Location actions
  sendLocation: (driverId: string, coordinates: { latitude: number; longitude: number }, role: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit('sendLocation', { driverId, coordinates, role });
    }
  },

  getLocations: () => {
    const { socket } = get();
    if (socket) {
      socket.emit('getLocations');
    }
  },

  // Notifications
  updateFCMToken: (userId: string, token: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit('fcmToken', { userId, token });
    }
  },

  markNotificationAsRead: (notificationId: string) => {
    const { notifications, unreadCount } = get();
    const updatedNotifications = notifications.map(notif =>
      notif._id === notificationId ? { ...notif, read: true } : notif
    );
    set({
      notifications: updatedNotifications,
      unreadCount: Math.max(0, unreadCount - 1),
    });
  },

  // Stats
  getTruckStats: () => {
    const { socket } = get();
    if (socket) {
      socket.emit('trucksStats');
    }
  },

  getOnlineUsers: () => {
    const { socket } = get();
    if (socket) {
      socket.emit('getOnlineUsers');
    }
  },

  // Clear state
  clearChat: () => {
    set({ messages: [], chatHistory: [] });
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));

// Export types for use in components
export type { Message, Notification, DriverLocation, VehicleStats, UserStatus, TypingStatus };
