import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import POSPage from './pages/POSPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout'; // We will create this

const App = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
            
            <Route element={<Layout />}>
                <Route path="/" element={
                    <ProtectedRoute>
                        {user?.role === 'Admin' ? <Navigate to="/admin" /> : <Navigate to="/pos" />}
                    </ProtectedRoute>
                } />

                <Route path="/pos" element={
                    <ProtectedRoute allowedRoles={['Admin', 'Cashier']}>
                        <POSPage />
                    </ProtectedRoute>
                } />
                
                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                {/* Add other admin routes like inventory, reports here */}
            </Route>
            
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
    );
}

export default App;