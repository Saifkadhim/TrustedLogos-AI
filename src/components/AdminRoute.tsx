import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

interface AdminRouteProps {
	children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
	const { isAuthenticated } = useAdminAuth();
	const location = useLocation();

	if (!isAuthenticated) {
		return <Navigate to="/console-setup" state={{ from: location }} replace />;
	}

	return <>{children}</>;
};

export default AdminRoute;