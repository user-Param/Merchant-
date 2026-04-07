"use client";

import { useState } from "react";
import { RotateCcw, TrendingUp, ExternalLink } from "lucide-react";

const timeRanges = ["1d", "7d", "15d", "1m", "3m", "6m", "12m"];

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

      {/* Chart (SVG) */}
      <div className="relative h-48 w-full mb-8">
        <div className="absolute top-0 left-0 text-[10px] text-gray-400 font-medium uppercase tracking-wider">Retention rate</div>
        <svg viewBox="0 0 400 150" className="w-full h-full mt-4">
          <defs>
            <linearGradient id="returningGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,120 Q60,100 100,110 T180,70 T260,90 T340,40 T400,30"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M0,120 Q60,100 100,110 T180,70 T260,90 T340,40 T400,30 V150 H0 Z"
            fill="url(#returningGradient)"
          />
        </svg>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Return Rate</span>
          <p className="text-lg font-bold text-gray-900">24.5%</p>
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