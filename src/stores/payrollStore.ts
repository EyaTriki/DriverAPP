import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Import auth store
import {useAuthStore} from './authStore';

// API Base URL
const API_BASE_URL = 'http://192.168.100.2:3000';

// Types
export interface PayrollRecord {
  _id: string;
  userId: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  hourlyRate: number;
  totalAmount: number;
  status: 'Pending' | 'Paid' | 'Processing';
  createdAt: string;
  updatedAt: string;
}

// State interface
interface PayrollState {
  records: PayrollRecord[];
  isLoading: boolean;
  error: string | null;
}

// Actions interface
interface PayrollActions {
  // Fetch all payroll records for the current user
  fetchPayrollRecords: () => Promise<boolean>;

  // Clear error
  clearError: () => void;

  // Reset store
  reset: () => void;
}

// Store type
type PayrollStore = PayrollState & PayrollActions;

// Initial state
const initialState: PayrollState = {
  records: [],
  isLoading: false,
  error: null,
};

// Create the store
export const usePayrollStore = create<PayrollStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchPayrollRecords: async (): Promise<boolean> => {
        try {
          set({isLoading: true, error: null});

          // Get token from auth store
          const authStore = useAuthStore.getState();
          const token = authStore.token;

          if (!token) {
            throw new Error('No authentication token found');
          }

          const response = await axios.get(`${API_BASE_URL}/api/payroll`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data) {
            set({
              records: response.data || [],
              isLoading: false,
              error: null,
            });
            return true;
          }

          set({isLoading: false});
          return false;
        } catch (error: any) {
          console.error('Error fetching payroll records:', error);
          set({
            isLoading: false,
            error:
              error.response?.data?.message ||
              error.message ||
              'Failed to fetch payroll records',
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
      name: 'payroll-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        records: state.records,
      }),
    },
  ),
);

// Helper functions
export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) {
    return 'Invalid Date';
  }
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatDateTime = (
  dateString: string | undefined | null,
): string => {
  if (!dateString) {
    return 'Invalid Date';
  }
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatCurrency = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatHours = (hours: number | undefined | null): string => {
  if (hours === undefined || hours === null || isNaN(hours)) {
    return '0.00 hrs';
  }
  return `${hours.toFixed(2)} hrs`;
};

export const getStatusColor = (status: string | undefined | null): string => {
  if (!status) {
    return '#F59E0B'; // Default to yellow for unknown status
  }
  switch (status) {
    case 'Paid':
      return '#10B981'; // Green
    case 'Processing':
      return '#3B82F6'; // Blue
    case 'Pending':
    default:
      return '#F59E0B'; // Yellow
  }
};

export const getStatusText = (status: string | undefined | null): string => {
  if (!status) {
    return 'Unknown';
  }
  switch (status) {
    case 'Paid':
      return 'Paid';
    case 'Processing':
      return 'Processing';
    case 'Pending':
    default:
      return 'Pending';
  }
};

// Calculate total earnings from records
export const calculateTotalEarnings = (records: PayrollRecord[]): number => {
  if (!records || records.length === 0) {
    return 0;
  }
  return records.reduce((total, record) => {
    const amount = record.totalAmount || 0;
    return total + amount;
  }, 0);
};

// Calculate total hours from records
export const calculateTotalHours = (records: PayrollRecord[]): number => {
  if (!records || records.length === 0) {
    return 0;
  }
  return records.reduce((total, record) => {
    const hours = record.totalHours || 0;
    return total + hours;
  }, 0);
};

// Get records for a specific month
export const getRecordsForMonth = (
  records: PayrollRecord[],
  year: number,
  month: number,
): PayrollRecord[] => {
  if (!records || records.length === 0) {
    return [];
  }
  return records.filter(record => {
    if (!record.startTime) {
      return false;
    }
    try {
      const recordDate = new Date(record.startTime);
      if (isNaN(recordDate.getTime())) {
        return false;
      }
      return (
        recordDate.getFullYear() === year && recordDate.getMonth() === month
      );
    } catch (error) {
      return false;
    }
  });
};
