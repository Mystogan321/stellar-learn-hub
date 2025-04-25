
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { initMockData } from '../mockData';

// Initialize mock data (remove in production)
initMockData();

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

      // Login function
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would make an API call
          // For demo, accept any email/password combo with "demo" in it
          if (email.includes('demo') || password.includes('demo')) {
            const mockUser = {
              id: 'user-1',
              name: 'Demo User',
              email: email,
              role: 'admin' as Role
            };
            
            const mockToken = 'mock-jwt-token';
            
            // Set data in store
            set({ 
              user: mockUser, 
              token: mockToken, 
              isLoading: false 
            });
            
            // Set in localStorage for persistence
            localStorage.setItem('token', mockToken);
            localStorage.setItem('user', JSON.stringify(mockUser));
          } else {
            // Simulate API error for wrong credentials
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
