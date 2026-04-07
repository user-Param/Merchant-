"use client";

import { useState } from "react";
import { useCustomers } from "@/hooks/use-api";
import { useError } from "@/context/error-context";

const Customers = () => {
  const { customers, loading, error, createCustomer } = useCustomers();
  const { showError } = useError();
  const [isAdding, setIsAdding] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" });

  if (loading) {
    return <div className="p-6">Loading customers...</div>;
  }

  if (error) {
    return <div className="p-6">Error loading customers</div>;
  }

  const handleAdd = async () => {
    try {
      await createCustomer(newCustomer);
      setIsAdding(false);
      setNewCustomer({ name: "", email: "", phone: "" });
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to create customer');
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {isAdding ? "Cancel" : "Add Customer"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-xl shadow p-4 space-y-4">
          <input
            placeholder="Name"
            className="w-full border p-2 rounded"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
          />
          <input
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
          />
          <input
            placeholder="Phone"
            className="w-full border p-2 rounded"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
          />
          <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Save Customer
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Total Customers" value={customers.length} />
        <Card
          title="Total Orders"
          value={customers.reduce((sum, c) => sum + (Number(c.total_orders) || 0), 0)}
        />
        <Card
          title="Total Revenue"
          value={`₹${customers.reduce((sum, c) => sum + Number(c.total_spent || 0), 0)}`}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <h2 className="font-semibold mb-4">Customer List</h2>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-500 text-sm">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Orders</th>
              <th>Spent</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c) => (
              <tr
                key={String(c.id)}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 font-medium">{c.name}</td>
                <td>{c.email}</td>
                <td>{String(c.phone || "-")}</td>
                <td>{Number(c.total_orders) || 0}</td>
                <td>₹{Number(c.total_spent) || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;

const Card = ({ title, value }: { title: string; value: unknown }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-xl font-bold mt-2">{String(value)}</p>
    </div>
  );
};