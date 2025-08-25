import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Import auth store
import {useAuthStore} from './authStore';

// API Base URL
const API_BASE_URL = 'http://192.168.100.2:3000';

// Types
export interface DayOffRequest {
  _id: string;
  userId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CreateDayOffRequest {
  startDate: string;
  endDate: string;
  reason: string;
}

// State interface
interface DayOffState {
  requests: DayOffRequest[];
  isLoading: boolean;
  error: string | null;
}

// Actions interface
interface DayOffActions {
  // Fetch all day off requests for the current user
  fetchDayOffRequests: () => Promise<boolean>;

  // Create a new day off request
  createDayOffRequest: (requestData: CreateDayOffRequest) => Promise<boolean>;

  // Clear error
  clearError: () => void;

  // Reset store
  reset: () => void;
}

// Store type
type DayOffStore = DayOffState & DayOffActions;

// Initial state
const initialState: DayOffState = {
  requests: [],
  isLoading: false,
  error: null,
};

// Create the store
export const useDayOffStore = create<DayOffStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchDayOffRequests: async (): Promise<boolean> => {
        try {
          set({isLoading: true, error: null});

          // Get token from auth store
          const authStore = useAuthStore.getState();
          const token = authStore.token;

          if (!token) {
            throw new Error('No authentication token found');
          }

          const response = await axios.get(`${API_BASE_URL}/api/userDayOff`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.message) {
            set({
              requests: response.data.requests || [],
              isLoading: false,
              error: null,
            });
            return true;
          }

          set({isLoading: false});
          return false;
        } catch (error: any) {
          console.error('Error fetching day off requests:', error);
          set({
            isLoading: false,
            error:
              error.response?.data?.message ||
              error.message ||
              'Failed to fetch day off requests',
          });
          return false;
        }
      },

      createDayOffRequest: async (
        requestData: CreateDayOffRequest,
      ): Promise<boolean> => {
        try {
          set({isLoading: true, error: null});

          // Get token from auth store
          const authStore = useAuthStore.getState();
          const token = authStore.token;

          if (!token) {
            throw new Error('No authentication token found');
          }

          const response = await axios.post(
            `${API_BASE_URL}/api/dayOff`,
            requestData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            },
          );

          if (response.data.message) {
            // Add the new request to the list
            const newRequest = response.data.request;
            set(prev => ({
              requests: [newRequest, ...prev.requests],
              isLoading: false,
              error: null,
            }));
            return true;
          }

          set({isLoading: false});
          return false;
        } catch (error: any) {
          console.error('Error creating day off request:', error);
          set({
            isLoading: false,
            error:
              error.response?.data?.message ||
              error.message ||
              'Failed to create day off request',
          });
          return false;
        }
      },

      clearError: () => {
        set({error: null});
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'day-off-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        requests: state.requests,
      }),
    },
  ),
);

// Helper functions
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start.toDateString() === end.toDateString()) {
    return formatDate(startDate);
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Approved':
      return '#10B981'; // Green
    case 'Rejected':
      return '#EF4444'; // Red
    case 'Pending':
    default:
      return '#F59E0B'; // Yellow
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'Approved':
      return 'Approved';
    case 'Rejected':
      return 'Rejected';
    case 'Pending':
    default:
      return 'Pending';
  }
};

// Validation functions
export const validateDayOffRequest = (
  startDate: string,
  endDate: string,
  reason: string,
): string | null => {
  if (!startDate || !endDate || !reason.trim()) {
    return 'Please fill in all fields';
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  // Check if dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Please enter valid dates';
  }

  // Check if start date is before end date
  if (start > end) {
    return 'Start date must be before end date';
  }

  // Check if start date is in the past
  if (start < today) {
    return 'Start date cannot be in the past';
  }

  // Check if reason is too short
  if (reason.trim().length < 10) {
    return 'Reason must be at least 10 characters long';
  }

  // Check 10-day notice requirement
  const tenDaysFromNow = new Date();
  tenDaysFromNow.setDate(today.getDate() + 10);

  if (start < tenDaysFromNow) {
    return 'You must give at least 10 days notice';
  }

  return null;
};
