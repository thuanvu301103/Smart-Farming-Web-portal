import { Navigate } from "react-router-dom";

export const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
};

export const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/login" />;
};