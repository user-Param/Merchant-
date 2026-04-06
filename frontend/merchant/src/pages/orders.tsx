"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  customer: string;
  status: "pending" | "shipped" | "delivered";
  total: number;
  date: string;
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API call
    setTimeout(() => {
      setOrders([
        { id: "#ORD-001", customer: "Param", status: "delivered", total: 450, date: "2024-03-20" },
        { id: "#ORD-002", customer: "Aman", status: "pending", total: 120, date: "2024-03-21" },
        { id: "#ORD-003", customer: "Rahul", status: "shipped", total: 890, date: "2024-03-22" },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-500 text-sm">
              <th className="py-2">Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 font-medium">{o.id}</td>
                <td>{o.customer}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    o.status === "delivered" ? "bg-green-100 text-green-700" :
                    o.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {o.status.toUpperCase()}
                  </span>
                </td>
                <td>₹{o.total}</td>
                <td>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;