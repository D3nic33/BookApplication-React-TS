import { Navigate } from 'react-router-dom';
import { useAuth, isTokenExpired } from '../../Context/AuthContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { isLoggedIn, token, logout } = useAuth();

    if (!isLoggedIn || (token && isTokenExpired(token))) {
        if (isLoggedIn) logout();
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;