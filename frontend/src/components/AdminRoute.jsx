import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    let user = null;
    try { user = JSON.parse(localStorage.getItem('user')); } catch { }
    if (!user || !(user.role === 'admin' || user.role === 'Admin')) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default AdminRoute;