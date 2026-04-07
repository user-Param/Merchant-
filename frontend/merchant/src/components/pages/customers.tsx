"use client";

import { useState } from "react";
import { useCustomers } from "@/hooks/use-api";
import { useError } from "@/context/error-context";
import { Search, Trash2 } from "lucide-react";

const Customers = () => {
  const { customers, loading, error, createCustomer, deleteCustomer } = useCustomers();
  const { showError } = useError();
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" });

  if (loading) {
    return <div className="p-6">Loading customers...</div>;
  }

  if (error) {
    return <div className="p-6">Error loading customers</div>;
  }

  const handleAdd = async () => {
    if (!newCustomer.name.trim()) {
      showError('Name is required');
      return;
    }
    if (!newCustomer.email.trim()) {
      showError('Email is required');
      return;
    }
    if (!newCustomer.phone.trim()) {
      showError('Phone number is required');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newCustomer.email)) {
      showError('Please enter a valid email address');
      return;
    }
    
    const phoneRegex = /^[0-9\-\+\(\)\s]{10,}$/;
    if (!phoneRegex.test(newCustomer.phone.replace(/\s/g, ''))) {
      showError('Please enter a valid phone number');
      return;
    }

    try {
      await createCustomer(newCustomer);
      setIsAdding(false);
      setNewCustomer({ name: "", email: "", phone: "" });
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to create customer');
    }
  };

  const handleDelete = async (customerId: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(String(customerId));
      } catch (err) {
        showError(err instanceof Error ? err.message : 'Failed to delete customer');
      }
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(c.phone).includes(searchQuery)
  );

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {isAdding ? "Cancel" : "Add Customer"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-xl shadow p-4 space-y-4">
          <input
            type="text"
            placeholder="Name *"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email *"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Phone *"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
          />
          <button 
            onClick={handleAdd} 
            disabled={!newCustomer.name.trim() || !newCustomer.email.trim() || !newCustomer.phone.trim()}
            className={`w-full ${
              newCustomer.name.trim() && newCustomer.email.trim() && newCustomer.phone.trim()
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
            } text-white px-4 py-2 rounded transition`}
          >
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

      <div className="bg-white rounded-xl shadow p-4 space-y-4">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="w-full outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <h2 className="font-semibold mb-4">Customer List ({filteredCustomers.length})</h2>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-500 text-sm">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Orders</th>
              <th>Spent</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map((c) => (
              <tr
                key={String(c.id)}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 font-medium">{c.name}</td>
                <td>{c.email}</td>
                <td>{String(c.phone || "-")}</td>
                <td>{Number(c.total_orders) || 0}</td>
                <td>₹{Number(c.total_spent) || 0}</td>
                <td>
                  <button
                    onClick={() => handleDelete(String(c.id))}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1 transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? "No customers found matching your search" : "No customers yet"}
          </div>
        )}
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