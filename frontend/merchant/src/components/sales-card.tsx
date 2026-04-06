"use client";

import { useState } from "react";
import { TrendingUp, MoreHorizontal, ExternalLink } from "lucide-react";

const timeRanges = ["1d", "7d", "15d", "1m", "3m", "6m", "12m"];

const salesSources = [
  { name: "Direct Website", amount: "₹85,000", percentage: "68%", color: "bg-blue-500" },
  { name: "Facebook Ads", amount: "₹32,500", percentage: "26%", color: "bg-pink-500" },
  { name: "Other Channels", amount: "₹7,500", percentage: "6%", color: "bg-gray-400" },
];

const SalesCard = () => {
  const [selectedRange, setSelectedRange] = useState("1m");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold">₹1,25,000</span>
            <span className="text-green-500 text-sm font-semibold flex items-center gap-0.5">
              <TrendingUp size={14} /> +12.5%
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

      {/* Simplified Chart Area (SVG) */}
      <div className="relative h-48 w-full mb-8">
        <svg viewBox="0 0 400 150" className="w-full h-full">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,120 Q50,110 80,90 T160,70 T240,100 T320,50 T400,30"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M0,120 Q50,110 80,90 T160,70 T240,100 T320,50 T400,30 V150 H0 Z"
            fill="url(#gradient)"
          />
        </svg>
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