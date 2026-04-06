"use client";

import { useEffect, useState } from "react";
import SalesCard from "@/components/sales-card";
import VisitorsCard from "@/components/visitors-card";
import OrdersCard from "@/components/orders-card";
import ProductCard from "@/components/product-card";
import ReturningCard from "@/components/returning-card";
import PerformanceCard from "@/components/performance-card";
import CampaignCard from "@/components/campaign-card";

type Overview = {
  revenue: number;
  orders: number;
  users: number;
  conversionRate: number;
};

const Dashboard = () => {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData({
        revenue: 125000,
        orders: 320,
        users: 2100,
        conversionRate: 3.2,
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen space-y-6">
      
      {/* 🔥 Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
          Last Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* 📊 Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Detailed Analytics */}
        <div className="xl:col-span-2 space-y-6">
          <SalesCard />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VisitorsCard />
            <OrdersCard />
          </div>
          
          {/* Product & Retention Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Top Product</h2>
              <ProductCard />
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Customer Retention</h2>
              <ReturningCard />
            </div>
          </div>

          {/* Marketing & Campaigns Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Marketing Performance</h2>
            <CampaignCard />
          </div>
        </div>

        {/* Right Column: Other Metrics & Activity */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card title="Revenue" value={`₹${data?.revenue}`} />
            <Card title="Users" value={data?.users} />
            <Card title="Conversion" value={`${data?.conversionRate}%`} />
            <Card title="Avg Session" value="4m 32s" />
          </div>

          <PerformanceCard />

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h2 className="font-semibold mb-4 text-gray-900">Recent Activity</h2>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>User purchased Headphones — ₹2,500</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>User viewed Product B</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>User purchased Wallet — ₹450</span>
              </li>
            </ul>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Grow your sales</h3>
            <p className="text-blue-100 text-sm mb-4">You've reached 80% of your monthly goal. Keep it up!</p>
            <div className="w-full bg-blue-500/30 rounded-full h-2 mb-4">
              <div className="bg-white h-full rounded-full w-[80%]"></div>
            </div>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold w-full hover:bg-blue-50 transition-colors">
              Optimize Store
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;


// 🔥 Reusable Card Component
const Card = ({ title, value }: { title: string; value: any }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-xs text-gray-500 font-medium uppercase tracking-wider">{title}</h3>
      <p className="text-xl font-bold mt-2 text-gray-900">{value}</p>
    </div>
  );
};