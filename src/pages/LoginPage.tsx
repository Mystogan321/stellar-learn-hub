
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  // Redirect if user is already logged in
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="https://www.kombee.com/_next/static/media/logo-loader.34d8b33b.svg"
            alt="Logo"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-white">
            Learning Platform
          </h1>
          <p className="mt-2 text-gray-400">
            Sign in to access your training courses
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
