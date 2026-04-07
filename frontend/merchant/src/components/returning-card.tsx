"use client";

import { useState } from "react";
import { RotateCcw, TrendingUp, ExternalLink } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const timeRanges = ["1d", "7d", "15d", "1m", "3m", "6m", "12m"];

// Sample returning customer data
const returningCustomerData = [
  { date: "Jan 1", rate: 15 },
  { date: "Jan 8", rate: 18 },
  { date: "Jan 15", rate: 22 },
  { date: "Jan 22", rate: 25 },
  { date: "Jan 29", rate: 28 },
  { date: "Feb 5", rate: 26 },
  { date: "Feb 12", rate: 32 },
  { date: "Feb 19", rate: 35 },
  { date: "Feb 26", rate: 38 },
  { date: "Mar 5", rate: 40 },
  { date: "Mar 12", rate: 42 },
  { date: "Mar 19", rate: 45 },
];

const ReturningCard = () => {
  const [selectedRange, setSelectedRange] = useState("1m");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Returning Customers</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold">12,402</span>
            <span className="text-green-500 text-sm font-semibold flex items-center gap-0.5">
              <TrendingUp size={14} /> +18.2%
            </span>
          </div>
        </div>
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <RotateCcw size={20} />
        </div>
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

      {/* Area Chart */}
      <div className="h-48 w-full mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={returningCustomerData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#999" />
            <YAxis hide />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "8px" }}
              formatter={(value) => [`${value}%`, "Retention Rate"]}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRate)"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Return Rate</span>
          <p className="text-lg font-bold text-gray-900">45%</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Avg. LTV</span>
          <p className="text-lg font-bold text-gray-900">₹4,250</p>
        </div>
      </div>

      {/* Footer */}
      <button className="mt-auto flex items-center gap-2 text-blue-600 text-sm font-semibold hover:underline">
        Analyze Retention <ExternalLink size={14} />
      </button>
    </div>
  );
};

export default ReturningCard;