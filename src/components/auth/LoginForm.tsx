
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiAlertCircle } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    
    // If login was successful, redirect to dashboard
    if (useAuthStore.getState().isAuthenticated()) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="w-full max-w-md">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white/5 backdrop-blur-lg rounded-lg shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Sign In</h2>
        
        {/* Show error message if there is one */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-md flex items-center mb-4">
            <FiAlertCircle className="mr-2" />
            <span>{error}</span>
            <button 
              type="button"
              onClick={clearError}
              className="ml-auto text-red-100 hover:text-white"
            >
              &times;
            </button>
          </div>
        )}
        
        {/* Email input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-gray-900/50 placeholder-gray-500 text-white focus:outline-none focus:ring-primary focus:border-primary focus:placeholder-gray-400 transition duration-150 ease-in-out"
              required
            />
          </div>
        </div>
        
        {/* Password input */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-gray-900/50 placeholder-gray-500 text-white focus:outline-none focus:ring-primary focus:border-primary focus:placeholder-gray-400 transition duration-150 ease-in-out"
              required
            />
          </div>
        </div>
        
        {/* Submit button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
