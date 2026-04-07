"use client";

import { useState } from "react";
import { 
  Package, 
  Eye, 
  ShoppingCart, 
  MousePointerClick, 
  MoreHorizontal, 
  ExternalLink 
} from "lucide-react";
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

const timeRanges = ["1d", "7d", "15d", "1m", "3m", "6m", "12m"];

const ProductCard = () => {
  const [selectedRange, setSelectedRange] = useState("1m");
  const { data: topProducts, loading } = useAnalytics<unknown[]>("top-products");

  // Prepare chart data from top products
  const chartData = Array.isArray(topProducts)
    ? topProducts.slice(0, 6).map((p: unknown) => ({
        name: String((p as any)?.product_id || "Unknown").replace("prod_", "P"),
        revenue: Number((p as any)?.revenue || 0),
      }))
    : [];

  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      {/* Header with Product Info */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
            <Package size={32} />
          </div>
          <div>
            <h3 className="text-gray-900 font-bold text-lg">Top Products</h3>
            <p className="text-gray-500 text-sm">Revenue by product • Last 30 days</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase">Revenue: ₹{totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal size={20} />
        </button>
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

      {/* Top Products Bar Chart */}
      <div className="h-44 w-full mb-8">
        {chartData.length > 0 && !loading ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={30} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "8px" }}
                formatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Bar dataKey="revenue" fill="#10b981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Loading chart...</p>
          </div>
        )}
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