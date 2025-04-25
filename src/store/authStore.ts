
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
          // Simulate API call to login endpoint
          const response = await api.post('/api/auth/login', { email, password });
          
          // In a real app, this would come from the API
          // For mock implementation, we'll simulate a successful response with JWT token
          if (response.status === 200 || (email.includes('demo') || password.includes('demo'))) {
            const mockUserRole: Role = email.includes('admin') ? 'admin' : 'learner';
            
            const mockUser = {
              id: 'user-' + Math.floor(Math.random() * 1000),
              name: email.split('@')[0],
              email: email,
              role: mockUserRole
            };
            
            const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1vY2sgVXNlciIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
            
            // Set data in store
            set({ 
              user: mockUser, 
              token: mockToken, 
              isLoading: false 
            });
            
            // Configure API interceptor with new token
            api.interceptors.request.use(
              (config) => {
                config.headers.Authorization = `Bearer ${mockToken}`;
                return config;
              },
              (error) => Promise.reject(error)
            );
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Login failed. Please try again.',
          });
        }
      },

      // Logout function
      logout: () => {
        // Clear token from API interceptors
        api.interceptors.request.use(
          (config) => {
            delete config.headers.Authorization;
            return config;
          }
        );
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null });
      },

      // Clear error message
      clearError: () => set({ error: null }),
      
      // Check if user is authenticated
      isAuthenticated: () => {
        return !!get().token || !!localStorage.getItem('token');
      },
      
      // Check if user has required role
      hasRole: (requiredRoles: Role[]) => {
        const { user } = get();
        if (!user) {
          // Try to get user from localStorage if not in state
          const storedUser = localStorage.getItem('user');
          if (!storedUser) return false;
          
          try {
            const parsedUser = JSON.parse(storedUser) as User;
            return requiredRoles.includes(parsedUser.role);
          } catch {
            return false;
          }
        }
        
        return requiredRoles.includes(user.role);
      }
    }),
    {
      name: 'auth-storage', // name for localStorage key
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
