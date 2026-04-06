"use client";

import { useState } from "react";
import { 
  Package, 
  TrendingUp, 
  Eye, 
  ShoppingCart, 
  MousePointerClick, 
  MoreHorizontal, 
  ExternalLink 
} from "lucide-react";

const timeRanges = ["1d", "7d", "15d", "1m", "3m", "6m", "12m"];

const ProductCard = () => {
  const [selectedRange, setSelectedRange] = useState("1m");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      {/* Header with Product Info */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
            <Package size={32} />
          </div>
          <div>
            <h3 className="text-gray-900 font-bold text-lg">Premium Wireless Headphones</h3>
            <p className="text-gray-500 text-sm">Electronics • SKU: WH-1000XM4</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">In Stock: 42</span>
              <span className="text-gray-400 text-xs">₹2,500 / unit</span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div>
          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Total Sales</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gray-900">₹84,500</span>
          </div>
        </div>
        <div>
          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Items Sold</span>
          <span className="text-xl font-bold text-gray-900">34</span>
        </div>
        <div>
          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Conversion</span>
          <span className="text-xl font-bold text-gray-900">4.2%</span>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex flex-wrap gap-1 mb-6 bg-gray-50 p-1 rounded-lg w-fit">
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

      {/* Performance Chart (SVG) */}
      <div className="relative h-40 w-full mb-8">
        <div className="absolute top-0 left-0 text-[10px] text-gray-400 font-medium uppercase tracking-wider">Product Performance</div>
        <svg viewBox="0 0 400 150" className="w-full h-full mt-4">
          <defs>
            <linearGradient id="productGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,110 Q40,90 80,100 T160,60 T240,80 T320,40 T400,20"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M0,110 Q40,90 80,100 T160,60 T240,80 T320,40 T400,20 V150 H0 Z"
            fill="url(#productGradient)"
          />
        </svg>
      </div>

      {/* Additional Metrics */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Eye size={16} className="text-gray-400" />
            <span>Product Page Views</span>
          </div>
          <span className="font-bold text-gray-900">1,240</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MousePointerClick size={16} className="text-gray-400" />
            <span>Click-through Rate</span>
          </div>
          <span className="font-bold text-gray-900">12.5%</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <ShoppingCart size={16} className="text-gray-400" />
            <span>Add to Cart Rate</span>
          </div>
          <span className="font-bold text-gray-900">8.2%</span>
        </div>
      </div>

      {/* Footer */}
      <button className="mt-auto flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-bold py-3 rounded-xl hover:bg-gray-800 transition-all">
        Edit Product Details <ExternalLink size={16} />
      </button>
    </div>
  );
};

export default ProductCard;