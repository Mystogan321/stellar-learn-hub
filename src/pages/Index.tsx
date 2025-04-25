
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LoginPage from './LoginPage';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  // Redirect based on auth status
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <LoginPage />;
  }
};

export default Index;
