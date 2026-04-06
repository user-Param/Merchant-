"use client";

import { useState } from "react";
import { Users, TrendingUp, TrendingDown, MoreHorizontal, ExternalLink } from "lucide-react";

const timeRanges = ["1d", "7d", "15d", "1m", "3m", "6m", "12m"];

const VisitorsCard = () => {
  const [selectedRange, setSelectedRange] = useState("1m");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Total Online Store Visitors</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold">45,231</span>
            <span className="text-green-500 text-sm font-semibold flex items-center gap-0.5">
              <TrendingUp size={14} /> +8.4%
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

      {/* Visitors Over Time Chart (SVG) */}
      <div className="relative h-48 w-full mb-8">
        <div className="absolute top-0 left-0 text-[10px] text-gray-400 font-medium">Visitors over time</div>
        <svg viewBox="0 0 400 150" className="w-full h-full mt-4">
          <defs>
            <linearGradient id="visitorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,130 Q40,140 80,100 T160,80 T240,60 T320,90 T400,40"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M0,130 Q40,140 80,100 T160,80 T240,60 T320,90 T400,40 V150 H0 Z"
            fill="url(#visitorGradient)"
          />
          {/* Grid lines */}
          <line x1="0" y1="150" x2="400" y2="150" stroke="#f3f4f6" strokeWidth="1" />
          <line x1="0" y1="100" x2="400" y2="100" stroke="#f3f4f6" strokeWidth="1" />
          <line x1="0" y1="50" x2="400" y2="50" stroke="#f3f4f6" strokeWidth="1" />
        </svg>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-gray-50 rounded-xl">
          <span className="text-xs text-gray-500 block mb-1">Unique Visitors</span>
          <span className="text-lg font-bold text-gray-900">32,840</span>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl">
          <span className="text-xs text-gray-500 block mb-1">Session Duration</span>
          <span className="text-lg font-bold text-gray-900">2m 45s</span>
        </div>
      </div>

      {/* Footer Link */}
      <button className="mt-auto flex items-center gap-2 text-emerald-600 text-sm font-semibold hover:underline">
        View Detailed Report <ExternalLink size={14} />
      </button>
    </div>
  );
};

export default VisitorsCard;