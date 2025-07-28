import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardCard = ({ to, title, description, icon }) => (
  <Link to={to} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
    <div className="flex items-center space-x-4">
      <div className="text-3xl text-sky-600">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>
  </Link>
);


const AdminDashboard = () => {
  const { user } = useAuth();
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{greeting}, {user.username}!</h1>
      <p className="text-gray-600 mb-6">Here's what's happening today. The current time is {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })} WIB.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard to="/pos" title="POS Terminal" description="Start a new sale transaction." icon="💰" />
        <DashboardCard to="/admin/inventory" title="Manage Inventory" description="Add, edit, and track products." icon="📦" />
        <DashboardCard to="/admin/sales" title="Sales Reports" description="View daily and monthly reports." icon="📊" />
        <DashboardCard to="/admin/users" title="Manage Users" description="Add or edit cashier accounts." icon="👥" />
        <DashboardCard to="/admin/expenses" title="Record Expenses" description="Track operational costs." icon="🧾" />
        <DashboardCard to="/admin/categories" title="Manage Categories" description="Add or edit product categories." icon="🏷️" />
      </div>
    </div>
  );
};

export default AdminDashboard;