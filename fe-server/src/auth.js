import { Navigate, useLocation } from "react-router-dom";

export const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
};

export const ProtectedRoute = ({ element }) => {
    const location = useLocation();
    return isAuthenticated() ? element : <Navigate to="/login" state={{ from: location.pathname }} replace />;
};