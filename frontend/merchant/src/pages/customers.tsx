"use client";

import { useEffect, useState } from "react";

type Customer = {
  id: number;
  name: string;
  email: string;
  orders: number;
  spent: number;
};

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API call (replace later)
    setTimeout(() => {
      setCustomers([
        { id: 1, name: "Param", email: "param@gmail.com", orders: 5, spent: 1200 },
        { id: 2, name: "Aman", email: "aman@gmail.com", orders: 3, spent: 800 },
        { id: 3, name: "Rahul", email: "rahul@gmail.com", orders: 7, spent: 2100 },
      ]);
      setLoading(false);
    }, 700);
  }, []);

  if (loading) {
    return <div className="p-6">Loading customers...</div>;
  }

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen space-y-6">
      
      {/* 🔥 Header */}
      <h1 className="text-2xl font-bold">Customers</h1>

      {/* 📊 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Total Customers" value={customers.length} />
        <Card
          title="Total Orders"
          value={customers.reduce((sum, c) => sum + c.orders, 0)}
        />
        <Card
          title="Total Revenue"
          value={`₹${customers.reduce((sum, c) => sum + c.spent, 0)}`}
        />
      </div>

      {/* 📋 Customers Table */}
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <h2 className="font-semibold mb-4">Customer List</h2>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-500 text-sm">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Spent</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c) => (
              <tr
                key={c.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 font-medium">{c.name}</td>
                <td>{c.email}</td>
                <td>{c.orders}</td>
                <td>₹{c.spent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Customers;


// 🔥 Reusable Card Component
const Card = ({ title, value }: { title: string; value: any }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-xl font-bold mt-2">{value}</p>
    </div>
  );
};