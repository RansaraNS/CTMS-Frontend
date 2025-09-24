import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../context/auth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;