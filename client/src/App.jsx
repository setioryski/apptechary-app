import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import POSPage from './pages/POSPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import InventoryPage from './pages/InventoryPage';
import UsersPage from './pages/UsersPage';
import ExpensesPage from './pages/ExpensesPage';
import SalesReportsPage from './pages/SalesReportsPage';


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
                <Route path="/admin/inventory" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <InventoryPage />
                    </ProtectedRoute>
                } />
                 <Route path="/admin/users" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <UsersPage />
                    </ProtectedRoute>
                } />
                 <Route path="/admin/expenses" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <ExpensesPage />
                    </ProtectedRoute>
                } />
                 <Route path="/admin/sales" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <SalesReportsPage />
                    </ProtectedRoute>
                } />
            </Route>
            
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
    );
}

export default App;