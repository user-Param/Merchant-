"use client";

import { useState } from "react";
import { MoreHorizontal, ExternalLink } from "lucide-react";
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

interface OverviewData {
  total_revenue?: number;
  avg_conversion?: number;
}

interface OrderData {
  date: string;
  orders: number;
}

const timeRanges = ["1d", "7d", "15d", "1m", "3m", "6m", "12m"];

const salesSources = [
  { name: "Direct Website", amount: "₹85,000", percentage: "68%", color: "bg-blue-500" },
  { name: "Facebook Ads", amount: "₹32,500", percentage: "26%", color: "bg-pink-500" },
  { name: "Other Channels", amount: "₹7,500", percentage: "6%", color: "bg-gray-400" },
];

const SalesCard = () => {
  const [selectedRange, setSelectedRange] = useState("1m");
  const { data, loading } = useAnalytics<OverviewData>("overview");
  const { data: orderData } = useAnalytics<OrderData[]>("orders-trend");

  const revenue = data?.total_revenue ? `₹${Number(data.total_revenue).toLocaleString()}` : "₹0";
  const trend = data?.avg_conversion ? `+${Number(data.avg_conversion).toFixed(1)}%` : "+0%";

  // Prepare chart data from orders trend (last 14 days)
  const chartData = Array.isArray(orderData)
    ? orderData.slice(-14).map((d) => ({
        date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: Math.round(Number((d as any).orders || 0) * 1500),
      }))
    : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold">{loading ? "..." : revenue}</span>
            <span className="text-green-500 text-sm font-semibold flex items-center gap-0.5">
              {loading ? "" : trend}
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

      {/* Bar Chart */}
      <div className="h-48 w-full mb-8">
        {chartData.length > 0 && !loading ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "8px" }}
                formatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Loading chart...</p>
          </div>
        )}
      </div>

      {/* Sales Sources */}
      <div className="space-y-4 mb-6">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Sales Sources
        </h4>
        {salesSources.map((source) => (
          <div key={source.name} className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{source.name}</span>
              <span className="font-semibold text-gray-900">{source.amount}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${source.color} rounded-full`}
                style={{ width: source.percentage }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Link */}
      <button className="mt-auto flex items-center gap-2 text-blue-600 text-sm font-semibold hover:underline">
        View Full Report <ExternalLink size={14} />
      </button>
    </div>
  );
};

export default SalesCard;