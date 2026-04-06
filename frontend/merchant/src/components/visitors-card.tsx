"use client";

import { useState } from "react";
import { TrendingUp, MoreHorizontal, ExternalLink } from "lucide-react";
import { useAnalytics } from "@/hooks/use-analytics";

const timeRanges = ["1d", "7d", "15d", "1m", "3m", "6m", "12m"];

const VisitorsCard = () => {
  const [selectedRange, setSelectedRange] = useState("1m");
  const { data, loading } = useAnalytics<any>("visitors-trend");

  const totalVisitors = Array.isArray(data)
    ? data.reduce((sum, row) => sum + Number(row?.visitors ?? 0), 0).toLocaleString()
    : "0";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Total Visitors</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold">{loading ? "..." : totalVisitors}</span>
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

      {/* Visitors Trend Chart (SVG) */}
      <div className="relative h-48 w-full mb-8">
        <svg viewBox="0 0 400 150" className="w-full h-full mt-4">
          <defs>
            <linearGradient id="orderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,100 Q40,80 80,120 T160,90 T240,110 T320,70 T400,50"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M0,100 Q40,80 80,120 T160,90 T240,110 T320,70 T400,50 V150 H0 Z"
            fill="url(#orderGradient)"
          />
        </svg>
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
