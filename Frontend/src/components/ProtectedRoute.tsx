import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'teacher' | 'student';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();

  // Wait until the authentication check is complete
  if (isLoading) {
    return null; // or a loading spinner
  }

  // If not loading and no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a role is required and it doesn't match, redirect appropriately
  if (requiredRole && user.role !== requiredRole) {
    if (user.role === 'teacher') {
      return <Navigate to="/teacher-dashboard" replace />;
    } else {
      return <Navigate to="/student-check" replace />;
    }
  }

  // If everything is fine, render the requested component
  return <>{children}</>;
};

export default ProtectedRoute;