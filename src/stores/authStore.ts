import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// API Configuration
const API_BASE_URL = 'http://192.168.100.5:3000';

interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string | null;
  startTime?: string;
  truckId?: string;
  permissions?: any;
  role: string;
  // Additional profile fields
  officialEmail?: string;
  phoneNumber?: string | string[];
  username?: string;
  gender?: string;
  designation?: string;
  dateOfBirth?: string;
  address?: string;
  CIN?: string;
  DriverLicense?: string;
  addressProof?: string;
  NatInsurance?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  demoLogin: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  checkAuthStatus: () => Promise<void>;
  updateProfile: (profileData: UpdateProfileData) => Promise<boolean>;
}

interface UpdateProfileData {
  email?: string;
  officialEmail?: string;
  phoneNumber?: string | string[];
  username?: string;
  gender?: string;
  designation?: string;
  dateOfBirth?: string;
  address?: string;
  CIN?: string;
  password?: string;
  picture?: any;
  DriverLicense?: any;
  addressProof?: any;
  NatInsurance?: any;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // État initial
      user: null,
      token: null,
      refreshToken: null,
      isLoading: true,
      isAuthenticated: false,

      // Actions
      setLoading: (loading: boolean) => set({isLoading: loading}),

      checkAuthStatus: async () => {
        try {
          set({isLoading: true});
          // La persistance est gérée automatiquement par Zustand
          // On vérifie juste si l'utilisateur existe dans le store
          const {user, token} = get();
          if (user && token) {
            set({isAuthenticated: true});
          }
        } catch (error) {
          console.error(
            "Erreur lors de la vérification du statut d'authentification:",
            error,
          );
        } finally {
          set({isLoading: false});
        }
      },

      login: async (email: string, password: string): Promise<boolean> => {
        try {
          set({isLoading: true});

          // Call the backend API directly
          const response = await axios.post(`${API_BASE_URL}/api/driver-sign-in`, {
            email,
            password
          });

          const data = response.data;

          if (data.success) {
            set({
              user: data.driver,
              token: data.token,
              refreshToken: data.refreshToken,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }

          set({isLoading: false});
          return false;
        } catch (error: any) {
          set({isLoading: false});
          
          // Handle different types of errors
          if (error.response) {
            // Server responded with error status
            const errorMessage = error.response.data.message || 'Authentication failed';
            throw new Error(errorMessage);
          } else if (error.request) {
            // Network error
            throw new Error('Network error. Please check your connection.');
          } else {
            // Other error
            throw new Error('An unexpected error occurred');
          }
        }
      },

      logout: async (): Promise<void> => {
        try {
          set({isLoading: true});
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          console.error('Erreur lors de la déconnexion:', error);
          set({isLoading: false});
        }
      },

      demoLogin: async (): Promise<void> => {
        try {
          set({isLoading: true});

          const demoUser: User = {
            id: 'demo',
            email: 'demo@example.com',
            name: 'Utilisateur Démo',
            role: 'Driver',
          };

          set({
            user: demoUser,
            token: 'demo-token',
            refreshToken: 'demo-refresh-token',
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Erreur lors de la connexion en mode démo:', error);
          set({isLoading: false});
        }
      },

      updateProfile: async (profileData: UpdateProfileData): Promise<boolean> => {
        try {
          set({isLoading: true});

          const token = get().token;
          if (!token) {
            throw new Error('No authentication token found');
          }

          // Create FormData for file uploads
          const formData = new FormData();
          
          // Add text fields
          Object.keys(profileData).forEach(key => {
            if (key !== 'picture' && key !== 'DriverLicense' && key !== 'addressProof' && key !== 'NatInsurance') {
              const value = profileData[key as keyof UpdateProfileData];
              if (value !== undefined) {
                formData.append(key, value as string);
              }
            }
          });

          // Add files if they exist
          if (profileData.picture) {
            formData.append('picture', profileData.picture);
          }
          if (profileData.DriverLicense) {
            formData.append('DriverLicense', profileData.DriverLicense);
          }
          if (profileData.addressProof) {
            formData.append('addressProof', profileData.addressProof);
          }
          if (profileData.NatInsurance) {
            formData.append('NatInsurance', profileData.NatInsurance);
          }

          // Call the backend API
          const response = await axios.put(
            `${API_BASE_URL}/api/driver`,
            formData,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          if (response.data.message) {
            // Update the user data in the store
            const currentUser = get().user;
            if (currentUser && response.data.user) {
              set({
                user: {
                  ...currentUser,
                  ...response.data.user,
                },
                isLoading: false,
              });
            }
            return true;
          }

          set({isLoading: false});
          return false;
        } catch (error: any) {
          set({isLoading: false});
          
          // Handle different types of errors
          if (error.response) {
            // Server responded with error status
            const errorMessage = error.response.data.message || 'Failed to update profile';
            throw new Error(errorMessage);
          } else if (error.request) {
            // Network error
            throw new Error('Network error. Please check your connection.');
          } else {
            // Other error
            throw new Error('An unexpected error occurred');
          }
        }
      },
    }),
    {
      name: 'auth-storage', // nom de la clé dans AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }), // On persiste l'utilisateur, les tokens et l'état d'authentification
    },
  ),
);
