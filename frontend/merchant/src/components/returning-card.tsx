"use client";

import { useState, useEffect } from "react";
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
import { useAnalytics } from "@/hooks/use-analytics";
import { formatChartDate } from "@/lib/date-utils";

const timeRanges = ["1d", "7d", "15d", "1m", "3m", "6m", "12m"];

interface RetentionResponse {
  returning_customers?: number;
  retention_rate?: number;
  avg_ltv?: number;
}

interface RetentionData {
  date: string;
  retention_rate?: number;
}

const ReturningCard = () => {
  const [selectedRange, setSelectedRange] = useState("1m");
  const { data: retentionData } = useAnalytics<RetentionResponse>("retention");
  const { data: retentionTrend } = useAnalytics<RetentionData[]>("retention-trend");
  const [chartData, setChartData] = useState<RetentionData[]>([]);

  useEffect(() => {
    if (Array.isArray(retentionTrend) && retentionTrend.length > 0) {
      const processedData = retentionTrend.slice(-14).map((item) => ({
        ...item,
        retention_rate: Number(item.retention_rate || 0),
        date: formatChartDate(item.date)
      }));
      setChartData(processedData);
    }
  }, [retentionTrend]);

  const returningCustomers = retentionData?.returning_customers || 0;
  const retentionRate = retentionData?.retention_rate || 0;
  const avgLtv = retentionData?.avg_ltv || 0;
  
  const growthRate = chartData.length > 1
    ? Math.round((((chartData[chartData.length - 1]?.retention_rate || 0) - (chartData[0]?.retention_rate || 0)) / Math.max(1, chartData[0]?.retention_rate || 1)) * 100 * 10) / 10
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Returning Customers</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold">{returningCustomers.toLocaleString()}</span>
            <span className="text-green-500 text-sm font-semibold flex items-center gap-0.5">
              <TrendingUp size={14} /> +{growthRate > 0 ? growthRate : 0}%
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
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                formatter={(value) => [`${typeof value === 'number' ? value.toFixed(1) : value}%`, "Retention Rate"]}
              />
              <Area
                type="monotone"
                dataKey="retention_rate"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRate)"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">Loading chart data...</div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Retention Rate</span>
          <p className="text-lg font-bold text-gray-900">{retentionRate.toFixed(1)}%</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Avg. LTV</span>
          <p className="text-lg font-bold text-gray-900">₹{Math.round(avgLtv).toLocaleString()}</p>
        </div>
      </div>

      {/* Footer */}
      <button className="mt-auto flex items-center gap-2 text-blue-600 text-sm font-semibold hover:underline">
        View Details <ExternalLink size={14} />
      </button>
    </div>
  );
};

export default ReturningCard;