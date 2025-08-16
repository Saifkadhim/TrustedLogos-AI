import React from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';

interface AdminRouteProps {
	children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
	const { isAuthenticated } = useAdminAuth();

	if (!isAuthenticated) {
		return (
			<div className="p-8">
				<div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
					<h2 className="text-lg font-semibold text-red-800">Admin Sign-In Required</h2>
					<p className="mt-2 text-sm text-red-700">
						Please sign in as an administrator to access this page.
					</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
};

export default AdminRoute;