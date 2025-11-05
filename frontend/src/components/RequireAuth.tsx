import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
interface RequireAuthProps {
	children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
	const location = useLocation();
	const token = localStorage.getItem("token"); // Récupérer le token depuis le stockage local

	if (!token) {
		return <Navigate to="/se-connecter" state={{ from: location }} replace />;
	}

	return children;
};

export default RequireAuth;