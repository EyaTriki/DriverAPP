import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  demoLogin: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  checkAuthStatus: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // État initial
      user: null,
      isLoading: true,
      isAuthenticated: false,

      // Actions
      setLoading: (loading: boolean) => set({isLoading: loading}),

      checkAuthStatus: async () => {
        try {
          set({isLoading: true});
          // La persistance est gérée automatiquement par Zustand
          // On vérifie juste si l'utilisateur existe dans le store
          const {user} = get();
          if (user) {
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

          // Simulation d'une API de connexion
          // Remplacez ceci par votre vraie logique d'authentification
          if (email === 'driver@gmail.com' && password === 'password') {
            const userData: User = {
              id: '1',
              email: email,
              name: 'Driver',
            };

            set({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }

          set({isLoading: false});
          return false;
        } catch (error) {
          console.error('Erreur lors de la connexion:', error);
          set({isLoading: false});
          return false;
        }
      },

      logout: async (): Promise<void> => {
        try {
          set({isLoading: true});
          set({
            user: null,
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
          };

          set({
            user: demoUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Erreur lors de la connexion en mode démo:', error);
          set({isLoading: false});
        }
      },
    }),
    {
      name: 'auth-storage', // nom de la clé dans AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // On ne persiste que l'utilisateur et l'état d'authentification
    },
  ),
);
