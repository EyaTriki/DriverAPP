import { create } from 'zustand';
import axios from 'axios';
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

interface User {
  id: string;
  username: string;
  email: string;
  picture?: string;
  roleType: string;
}

interface MessagesStore {
  // State
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  assignedHelper: User | null;
  assignedDriver: User | null;
  adminId: string | null;
  
  // Actions
  fetchMessagesWithHelper: () => Promise<void>;
  fetchMessagesWithDriver: () => Promise<void>;
  fetchMessagesWithAdmin: () => Promise<void>;
  sendVoiceMessage: (roomId: string, audioUrl: string, audioDuration: number) => Promise<Message | null>;
  getVoiceMessages: (roomId: string) => Promise<Message[]>;
  deleteVoiceMessage: (messageId: string) => Promise<boolean>;
  getAssignedHelper: () => Promise<User | null>;
  getAssignedHelperByDriverId: (driverId: string) => Promise<string | null>;
  getAssignedDriver: () => Promise<User | null>;
  getAdminId: () => Promise<string | null>;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  clearError: () => void;
}

// API base URL - update this to match your backend
const API_BASE_URL = 'http://192.168.100.5:3000/api';

export const useMessagesStore = create<MessagesStore>((set, get) => ({
  // Initial state
  messages: [],
  isLoading: false,
  error: null,
  assignedHelper: null,
  assignedDriver: null,
  adminId: null,

  // Fetch messages for a driver with their helper
  fetchMessagesWithHelper: async () => {
    try {
      set({ isLoading: true, error: null });
      const { token } = useAuthStore.getState();
      
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.get(`${API_BASE_URL}/driver/messages/helper`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ messages: response.data.messages || [], isLoading: false });
    } catch (error: any) {
      console.error('Error fetching messages with helper:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch messages', 
        isLoading: false 
      });
    }
  },

  // Fetch messages for a helper with their driver
  fetchMessagesWithDriver: async () => {
    try {
      set({ isLoading: true, error: null });
      const { token } = useAuthStore.getState();
      
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.get(`${API_BASE_URL}/helper/messages/driver`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ messages: response.data.messages || [], isLoading: false });
    } catch (error: any) {
      console.error('Error fetching messages with driver:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch messages', 
        isLoading: false 
      });
    }
  },

  // Fetch messages for a user with admin
  fetchMessagesWithAdmin: async () => {
    try {
      set({ isLoading: true, error: null });
      const { token } = useAuthStore.getState();
      
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.get(`${API_BASE_URL}/messages/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ messages: response.data.messages || [], isLoading: false });
    } catch (error: any) {
      console.error('Error fetching messages with admin:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch messages', 
        isLoading: false 
      });
    }
  },

  // Send voice message
  sendVoiceMessage: async (roomId: string, audioUrl: string, audioDuration: number) => {
    try {
      set({ isLoading: true, error: null });
      const { token, user } = useAuthStore.getState();
      
      if (!token || !user) {
        throw new Error('No authentication token or user');
      }

      const response = await axios.post(`${API_BASE_URL}/voice`, {
        roomId,
        senderId: user.id,
        messageText: '',
        audioUrl,
        audioDuration,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newMessage = response.data.message;
      set(state => ({ 
        messages: [...state.messages, newMessage], 
        isLoading: false 
      }));

      return newMessage;
    } catch (error: any) {
      console.error('Error sending voice message:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to send voice message', 
        isLoading: false 
      });
      return null;
    }
  },

  // Get voice messages for a room
  getVoiceMessages: async (roomId: string) => {
    try {
      set({ isLoading: true, error: null });
      const { token } = useAuthStore.getState();
      
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.get(`${API_BASE_URL}/voice/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ isLoading: false });
      return response.data.messages || [];
    } catch (error: any) {
      console.error('Error fetching voice messages:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch voice messages', 
        isLoading: false 
      });
      return [];
    }
  },

  // Delete voice message
  deleteVoiceMessage: async (messageId: string) => {
    try {
      set({ isLoading: true, error: null });
      const { token } = useAuthStore.getState();
      
      if (!token) {
        throw new Error('No authentication token');
      }

      await axios.delete(`${API_BASE_URL}/voice/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove message from local state
      set(state => ({ 
        messages: state.messages.filter(msg => msg._id !== messageId), 
        isLoading: false 
      }));

      return true;
    } catch (error: any) {
      console.error('Error deleting voice message:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to delete voice message', 
        isLoading: false 
      });
      return false;
    }
  },

  // Get assigned helper for current driver
  getAssignedHelper: async () => {
    try {
      set({ isLoading: true, error: null });
      const { token } = useAuthStore.getState();
      
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.get(`${API_BASE_URL}/messages/assigned-helper`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const helper = response.data.user;
      set({ assignedHelper: helper, isLoading: false });
      return helper;
    } catch (error: any) {
      console.error('Error fetching assigned helper:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch assigned helper', 
        isLoading: false 
      });
      return null;
    }
  },

  // Get assigned helper by driver ID
  getAssignedHelperByDriverId: async (driverId: string) => {
    try {
      set({ isLoading: true, error: null });
      const { token } = useAuthStore.getState();
      
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.get(`${API_BASE_URL}/messages/assignedHelper/${driverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching assigned helper by driver ID:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch assigned helper', 
        isLoading: false 
      });
      return null;
    }
  },

  // Get assigned driver for current helper
  getAssignedDriver: async () => {
    try {
      set({ isLoading: true, error: null });
      const { token } = useAuthStore.getState();
      
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.get(`${API_BASE_URL}/messages/assigned-driver`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const driver = response.data.user;
      set({ assignedDriver: driver, isLoading: false });
      return driver;
    } catch (error: any) {
      console.error('Error fetching assigned driver:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch assigned driver', 
        isLoading: false 
      });
      return null;
    }
  },

  // Get admin ID
  getAdminId: async () => {
    try {
      set({ isLoading: true, error: null });
      const { token } = useAuthStore.getState();
      
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.get(`${API_BASE_URL}/messages/assigned-admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const adminId = response.data.adminId;
      set({ adminId, isLoading: false });
      return adminId;
    } catch (error: any) {
      console.error('Error fetching admin ID:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch admin ID', 
        isLoading: false 
      });
      return null;
    }
  },

  // Add a new message to the local state
  addMessage: (message: Message) => {
    set(state => ({ 
      messages: [...state.messages, message] 
    }));
  },

  // Clear all messages
  clearMessages: () => {
    set({ messages: [] });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

// Export types for use in components
export type { Message, User };
