"use client";

import { useState } from "react";
import { TrendingUp, MoreHorizontal, ExternalLink, Package, Clock, CheckCircle } from "lucide-react";
import { useAnalytics } from "@/hooks/use-analytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface OrderData {
  date: string;
  orders: number;
}

const timeRanges = ["1d", "7d", "15d", "1m", "3m", "6m", "12m"];

const orderStatus = [
  { label: "Delivered", value: "284", color: "text-green-500", icon: CheckCircle },
  { label: "Shipped", value: "45", color: "text-blue-500", icon: Package },
  { label: "Pending", value: "12", color: "text-yellow-500", icon: Clock },
];

const OrdersCard = () => {
  const [selectedRange, setSelectedRange] = useState("1m");
  const { data: orderData, loading } = useAnalytics<OrderData[]>("orders-trend");

  const totalOrders = Array.isArray(orderData)
    ? orderData.reduce((sum, row) => sum + Number(row?.orders ?? 0), 0)
    : 0;

  // Prepare chart data (last 14 days)
  const chartData = Array.isArray(orderData)
    ? orderData.slice(-14).map((d) => ({
        date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        orders: Number(d.orders || 0),
      }))
    : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold">{loading ? "..." : totalOrders}</span>
            <span className="text-green-500 text-sm font-semibold flex items-center gap-0.5">
              <TrendingUp size={14} /> +15.2%
            </span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Time Range Selector */}
      <div className="flex flex-wrap gap-1 mb-8 bg-gray-50 p-1 rounded-lg w-fit">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              selectedRange === range
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Orders Bar Chart */}
      <div className="h-48 w-full mb-8">
        {chartData.length > 0 && !loading ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "8px" }}
                formatter={(value) => [`${value} orders`, "Orders"]}
              />
              <Bar dataKey="orders" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Loading chart...</p>
          </div>
        )}
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {orderStatus.map((status) => {
          const Icon = status.icon;
          return (
            <div key={status.label} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
              <Icon size={18} className={`${status.color} mb-2`} />
              <span className="text-lg font-bold text-gray-900">{status.value}</span>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">{status.label}</span>
            </div>
          );
        })}
      </div>

      {/* Footer Link */}
      <div className="mt-auto flex justify-between items-center border-t border-gray-50 pt-4">
        <div className="text-xs text-gray-400">Avg. Order Value: <span className="font-bold text-gray-700">₹366</span></div>
        <button className="flex items-center gap-2 text-violet-600 text-sm font-semibold hover:underline">
          View All Orders <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};

export default OrdersCard;