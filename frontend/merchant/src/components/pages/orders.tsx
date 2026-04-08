"use client";

import { useState, useEffect } from "react";
import { useOrders } from "@/hooks/use-api";
import { useError } from "@/context/error-context";

const Orders = () => {
  const { orders, loading, error, updateStatus } = useOrders();
  const { showError } = useError();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"date" | "total">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const itemsPerPage = 10;

  
  useEffect(() => {
    setCurrentPage(1);
  }, [orders.length]);

  if (loading) return <div className="p-6">Loading orders...</div>;
  if (error) return <div className="p-6">Error loading orders</div>;

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

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateStatus(id, status);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update");
    }
  };

  // ✅ SORT FIRST (DO NOT MUTATE ORIGINAL)
  const sortedOrders = [...orders].sort((a, b) => {
    let compareVal = 0;

    if (sortBy === "date") {
      compareVal =
        new Date(String(a.created_at)).getTime() -
        new Date(String(b.created_at)).getTime();
    } else {
      compareVal = Number(a.total) - Number(b.total);
    }

    return sortOrder === "asc" ? compareVal : -compareVal;
  });

  // ✅ PAGINATION
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ✅ CLEAN PAGINATION WINDOW
  const getVisiblePages = () => {
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <div className="flex justify-between mb-4">
          <h2>Orders ({orders.length})</h2>
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages || 1}
          </p>
        </div>

        {/* TABLE */}
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/20 text-sm text-gray-500">
              <th>Order ID</th>
              <th>Customer</th>
              <th>Status</th>

              <th
                className="cursor-pointer"
                onClick={() => {
                  setSortBy("total");
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                }}
              >
                Total
              </th>

              <th
                className="cursor-pointer"
                onClick={() => {
                  setSortBy("date");
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                }}
              >
                Date
              </th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((o) => (
              <tr key={o.id} className="border-b border-black/20 hover:bg-gray-50">
                <td>{o.order_id}</td>
                <td>{o.customer_name || o.customer_id}</td>

                <td>
                  <span className={`px-2 py-1 rounded ${getStatusColor(o.status)}`}>
                    {o.status}
                  </span>
                </td>

                <td>₹{o.total}</td>
                <td>{String(o.created_at).split("T")[0]}</td>

                <td>
                  {o.status !== "delivered" && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          o.order_id,
                          cycleStatus(o.status)
                        )
                      }
                      className="text-blue-600 text-sm"
                    >
                      Mark as {cycleStatus(o.status)}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2 overflow-x-auto max-w-full px-2">

              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-2 py-1 bg-gray-100 rounded flex-shrink-0"
              >
                First
              </button>

              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1 bg-gray-100 rounded flex-shrink-0"
              >
                Prev
              </button>

              {getVisiblePages().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded flex-shrink-0 ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 bg-gray-100 rounded flex-shrink-0"
              >
                Next
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 bg-gray-100 rounded flex-shrink-0"
              >
                Last
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;