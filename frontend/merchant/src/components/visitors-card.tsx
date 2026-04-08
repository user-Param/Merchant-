"use client";

import React, { useState } from "react";
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

interface VisitorData {
  date: string;
  visitors: number;
}

const timeRanges = ["1d", "7d", "15d", "1m", "3m", "6m", "12m"];

const VisitorsCard = () => {
  const [selectedRange, setSelectedRange] = useState("1m");
  const { data, loading } = useAnalytics<VisitorData[]>("visitors-trend");

  const totalVisitors = Array.isArray(data)
    ? data.reduce((sum, row) => sum + Number(row?.visitors ?? 0), 0).toLocaleString()
    : "0";

  // Calculate growth rate from trend data
  const visitorsGrowth = Array.isArray(data) && data.length > 1
    ? (((data[data.length - 1]?.visitors || 0) - (data[0]?.visitors || 0)) / (data[0]?.visitors || 1) * 100).toFixed(1)
    : "0";

  // Prepare chart data (last 14 days)
  const chartData = Array.isArray(data)
    ? data.slice(-14).map((d) => ({
        date: formatChartDate(d.date),
        visitors: Number(d.visitors || 0),
      }))
    : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Total Visitors</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold">{loading ? "..." : totalVisitors}</span>
            <span className="text-green-500 text-sm font-semibold flex items-center gap-0.5">
              {Number(visitorsGrowth) > 0 ? '+' : ''}{visitorsGrowth}%
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

      {/* Line Chart */}
      <div className="h-48 w-full mb-8">
        {chartData.length > 0 && !loading ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "8px" }}
                formatter={(value) => [`${typeof value === 'number' ? value.toLocaleString() : '0'} visitors`, "Visitors"]}
              />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Loading chart...</p>
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="mt-auto flex justify-between items-center border-t border-gray-50 pt-4">
        <div className="text-xs text-gray-400">Avg. Daily Visitors: <span className="font-bold text-gray-700">{loading ? "..." : totalVisitors}</span></div>
        <button className="flex items-center gap-2 text-violet-600 text-sm font-semibold hover:underline">
          View Visitor Report <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};

export default VisitorsCard;
