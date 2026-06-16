import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomNav } from './BottomNav';

export function MainLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-brand-cyan">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-brand-darker flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col min-w-0 w-full">
        <Topbar />
        <main className="flex-1 mt-16 p-4 md:p-6 pb-24 md:pb-6 overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
