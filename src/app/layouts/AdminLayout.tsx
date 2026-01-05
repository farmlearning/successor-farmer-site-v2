import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';
import AdminLoginGate from '../components/auth/AdminLoginGate';

export default function AdminLayout() {
  return (
    <AdminLoginGate>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <main className="min-h-screen">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminLoginGate>
  );
}
