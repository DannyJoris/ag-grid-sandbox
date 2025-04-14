import React from 'react';
import { Navigate } from 'react-router-dom';
import { isOpenFin } from '@/utils/openfin';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = localStorage.getItem('ag-grid-demo-user');
  const openFin = isOpenFin();

  if (!user && !openFin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 