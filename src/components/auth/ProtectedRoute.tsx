
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, Role } from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const { isAuthenticated, hasRole } = useAuthStore();
  const location = useLocation();
  
  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Check if user has required role (if specified)
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    // Redirect to dashboard if user doesn't have required role
    return <Navigate to="/dashboard" replace />;
  }
  
  // User is authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
