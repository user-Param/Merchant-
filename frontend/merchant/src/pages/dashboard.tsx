"use client";

import { useEffect, useState } from "react";

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
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Revenue" value={`₹${data?.revenue}`} />
        <Card title="Orders" value={data?.orders} />
        <Card title="Users" value={data?.users} />
        <Card title="Conversion Rate" value={`${data?.conversionRate}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-2">Revenue Trend</h2>
          <div className="h-40 flex items-center justify-center text-gray-400">
            Chart here
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-2">Orders Trend</h2>
          <div className="h-40 flex items-center justify-center text-gray-400">
            Chart here
          </div>
        </div>

      </div>

      

    </div>
  );
};

export default Dashboard;



const Card = ({ title, value }: { title: string; value: any }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-xl font-bold mt-2">{value}</p>
    </div>
  );
};