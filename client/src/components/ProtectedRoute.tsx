import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isOpenFin, subscribeToAuthStatus } from '@/utils/openfin';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const openFin = isOpenFin();

  useEffect(() => {
    // Check if user is already authenticated
    const user = localStorage.getItem('ag-grid-demo-user');
    if (user) {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else if (!openFin) {
      // If not in OpenFin and not authenticated, redirect to login
      setIsLoading(false);
    } else {
      // In OpenFin, subscribe to auth status broadcasts
      const unsubscribe = subscribeToAuthStatus((authenticated, userData) => {
        if (authenticated && userData) {
          // Store user data in localStorage
          localStorage.setItem('ag-grid-demo-user', JSON.stringify(userData));
          setIsAuthenticated(true);
        }
        setIsLoading(false);
      });

      // Cleanup subscription on unmount
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [openFin]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 