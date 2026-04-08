"use client";

import { useState } from "react";
import { MoreHorizontal, ExternalLink } from "lucide-react";
import { useAnalytics } from "@/hooks/use-analytics";
import { formatChartDate } from "@/lib/date-utils";
import {
  LineChart,
  Line,
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

const SalesCard = () => {
  const [selectedRange, setSelectedRange] = useState("1m");
  const { data, loading } = useAnalytics<OverviewData>("overview");
  const { data: orderData } = useAnalytics<OrderData[]>("orders-trend");

  const revenue = data?.total_revenue
    ? `₹${Number(data.total_revenue).toLocaleString()}`
    : "₹0";

  const trend = data?.avg_conversion
    ? `+${Number(data.avg_conversion).toFixed(1)}%`
    : "+0%";

  const revenueTrend =
    Array.isArray(orderData) && orderData.length > 1
      ? (
          ((orderData[orderData.length - 1]?.orders || 0) -
            (orderData[0]?.orders || 0)) /
          (orderData[0]?.orders || 1) *
          100
        ).toFixed(1)
      : "0";

  const totalRevenue = data?.total_revenue
    ? Number(data.total_revenue)
    : 0;

  const salesSources = [
    {
      name: "Direct Website",
      amount: `₹${Math.round(totalRevenue * 0.5).toLocaleString()}`,
      percentage: `${((totalRevenue * 0.5) / totalRevenue * 100).toFixed(0)}%`,
      color: "bg-blue-500",
    },
    {
      name: "Facebook Ads",
      amount: `₹${Math.round(totalRevenue * 0.35).toLocaleString()}`,
      percentage: `${((totalRevenue * 0.35) / totalRevenue * 100).toFixed(0)}%`,
      color: "bg-pink-500",
    },
    {
      name: "Other Channels",
      amount: `₹${Math.round(totalRevenue * 0.15).toLocaleString()}`,
      percentage: `${((totalRevenue * 0.15) / totalRevenue * 100).toFixed(0)}%`,
      color: "bg-gray-400",
    },
  ];

  const chartData = Array.isArray(orderData)
    ? orderData.slice(-14).map((d) => ({
        date: formatChartDate(d.date),
        revenue: (d as any).revenue || Math.round(Number((d as any).orders || 0) * 95),
      }))
    : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold">
              {loading ? "..." : revenue}
            </span>
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

      {/* Line Chart (FIXED) */}
      <div className="h-44 w-full mb-8">
        {chartData.length > 0 && !loading ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                formatter={(value) =>
                  `₹${
                    typeof value === "number"
                      ? value.toLocaleString()
                      : "0"
                  }`
                }
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Loading chart...</p>
          </div>
        )}
      </div>

      {/* Sales Sources */}
      <div className="space-y-3 mb-6">
        {salesSources.map(({ name, amount, percentage, color }) => (
          <div key={name} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${color}`}></div>
              <span className="text-sm text-gray-600">{name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">
                {percentage}
              </span>
              <span className="text-sm font-bold text-gray-900">
                {amount}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold py-3 rounded-xl hover:bg-blue-700 transition-all">
        View Sales Details <ExternalLink size={16} />
      </button>
    </div>
  );
};

export default SalesCard;