
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

// Define user type
export type Role = 'learner' | 'hr' | 'mentor' | 'lead' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

// Define auth store state
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  isAuthenticated: () => boolean;
  hasRole: (requiredRoles: Role[]) => boolean;
}

// Create auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Login function with JWT authentication
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Use the mockRequest to simulate API call
          const response = await api.mockRequest('post', '/api/auth/login', { email, password });
          
          // Set data in store
          set({ 
            user: response.data.user, 
            token: response.data.token, 
            isLoading: false 
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Login failed. Please try again.',
          });
        }
      },

      // Logout function
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null });
      },

      // Clear error message
      clearError: () => set({ error: null }),
      
      // Check if user is authenticated - simplified to just check for token
      isAuthenticated: () => {
        const { token } = get();
        return !!token;
      },
      
      // Check if user has required role
      hasRole: (requiredRoles: Role[]) => {
        const { user } = get();
        if (!user) return false;
        return requiredRoles.includes(user.role);
      }
    }),
    {
      name: 'auth-storage', // name for localStorage key
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
