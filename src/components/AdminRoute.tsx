import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        <p className="mt-4 text-gray-600">Checking permissions...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800">Access Denied</h2>
          <p className="mt-2 text-sm text-red-700">
            You do not have permission to access this page. This area is restricted to administrators only.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;