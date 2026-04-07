'use client';

import { useAuth } from '@/context/auth-context';
import { LoginPage } from '@/components/login-page';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('@/components/pages/dashboard'), { ssr: false });
const Customers = dynamic(() => import('@/components/pages/customers'), { ssr: false });
const Orders = dynamic(() => import('@/components/pages/orders'), { ssr: false });
const Products = dynamic(() => import('@/components/pages/products'), { ssr: false });

export function ProtectedDashboard() {
  const { isAuthenticated, loading } = useAuth();
  const [activePanel, setActivePanel] = useState('dashboard');

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Show dashboard if authenticated
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />
        <div className="flex-1 overflow-auto">
          {activePanel === 'dashboard' && <Dashboard />}
          {activePanel === 'customers' && <Customers />}
          {activePanel === 'orders' && <Orders />}
          {activePanel === 'products' && <Products />}
        </div>
      </div>
    </>
  );
}
