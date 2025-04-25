
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore,  Role } from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const { isAuthenticated, hasRole } = useAuthStore();
  
  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role (if specified)
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // User is authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
