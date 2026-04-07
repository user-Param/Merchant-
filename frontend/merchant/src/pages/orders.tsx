"use client";

import { useOrders } from "@/hooks/use-api";

const Orders = () => {
  const { orders, loading, error, updateStatus } = useOrders();

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  if (error) {
    return <div className="p-6">Error loading orders</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "shipped": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const cycleStatus = (current: string) => {
    if (current === "pending") return "shipped";
    if (current === "shipped") return "delivered";
    return "delivered";
  };

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={String(o.id)} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 font-medium">{String(o.order_id)}</td>
                <td>{String(o.customer_name || o.customer_id)}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(o.status)}`}>
                    {o.status.toUpperCase()}
                  </span>
                </td>
                <td>₹{Number(o.total)}</td>
                <td>{String(o.created_at).split('T')[0]}</td>
                <td>
                  {o.status !== "delivered" && (
                    <button
                      onClick={() => updateStatus(String(o.order_id), cycleStatus(String(o.status)))}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Mark as {cycleStatus(o.status)}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;