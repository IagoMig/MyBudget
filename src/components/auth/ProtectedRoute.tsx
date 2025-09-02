import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
interface ProtectedRouteProps {
  children?: React.ReactNode;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children
}) => {
  const {
    session,
    loading
  } = useAuth();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>;
  }
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
};
export default ProtectedRoute;