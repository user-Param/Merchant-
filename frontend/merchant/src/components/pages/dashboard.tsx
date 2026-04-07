"use client";

import { useState } from "react";
import SalesCard from "@/components/sales-card";
import VisitorsCard from "@/components/visitors-card";
import OrdersCard from "@/components/orders-card";
import ProductCard from "@/components/product-card";
import ReturningCard from "@/components/returning-card";
import PerformanceCard from "@/components/performance-card";
import { useAnalytics } from "@/hooks/use-analytics";
import { useProducts } from "@/hooks/use-api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, ShoppingCart, DollarSign, Clock, AlertCircle, BarChart3, LineChart as LineChartIcon } from "lucide-react";

interface OverviewData {
  total_revenue?: number;
  total_orders?: number;
  total_views?: number;
  avg_conversion?: number;
}

interface VisitorData {
  date: string;
  visitors: number;
}

interface OrderData {
  date: string;
  orders: number;
}

const Dashboard = () => {
  const [revenueChartType, setRevenueChartType] = useState<"line" | "bar">("bar");
  const [ordersChartType, setOrdersChartType] = useState<"line" | "bar">("bar");

  const { data, loading } = useAnalytics<OverviewData>("overview");
  const { data: visitorData } = useAnalytics<VisitorData[]>("visitors-trend");
  const { data: orderData } = useAnalytics<OrderData[]>("orders-trend");
  const { data: topProducts } = useAnalytics<unknown[]>("top-products");

  const revenue = data?.total_revenue ? Number(data.total_revenue) : 0;
  const orders = data?.total_orders ? Number(data.total_orders) : 0;
  const views = data?.total_views ? Number(data.total_views) : 0;
  const conversionRate = data?.avg_conversion ? Number(data.avg_conversion) : 0;

  // Prepare chart data
  const chartVisitors = Array.isArray(visitorData) ? visitorData.slice(-30) : [];
  const chartOrders = Array.isArray(orderData) ? orderData.slice(-30) : [];
  const topProductsData = Array.isArray(topProducts)
    ? topProducts.slice(0, 5).map((p: unknown) => ({
        name: String((p as any)?.product_id || "Unknown"),
        value: Number((p as any)?.revenue || 0),
        orders: Number((p as any)?.orders || 0),
      }))
    : [];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Clock className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your store performance.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* KPI Cards - Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={`₹${revenue.toLocaleString()}`}
          change={"+12.5%"}
          icon={<DollarSign className="h-8 w-8" />}
          color="blue"
        />
        <KPICard
          title="Total Orders"
          value={String(orders)}
          change={"+8.2%"}
          icon={<ShoppingCart className="h-8 w-8" />}
          color="green"
        />
        <KPICard
          title="Page Views"
          value={views.toLocaleString()}
          change={"+15.3%"}
          icon={<TrendingUp className="h-8 w-8" />}
          color="orange"
        />
        <KPICard
          title="Conversion Rate"
          value={`${conversionRate.toFixed(1)}%`}
          change={"+2.1%"}
          icon={<Users className="h-8 w-8" />}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="xl:col-span-2 space-y-6">
          {/* Revenue Trend Chart */}
          {chartVisitors.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Revenue Trend</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRevenueChartType("bar")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      revenueChartType === "bar"
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-sm font-medium">Bar</span>
                  </button>
                  <button
                    onClick={() => setRevenueChartType("line")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      revenueChartType === "line"
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <LineChartIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Line</span>
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                {revenueChartType === "bar" ? (
                  <BarChart data={chartVisitors}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="visitors" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Page Views" />
                  </BarChart>
                ) : (
                  <LineChart data={chartVisitors}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="visitors"
                      stroke="#3b82f6"
                      dot={false}
                      strokeWidth={2}
                      name="Page Views"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          )}

          {/* Orders & Visitors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Orders Chart */}
            {chartOrders.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Orders Trend</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOrdersChartType("bar")}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all text-xs ${
                        ordersChartType === "bar"
                          ? "bg-green-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <BarChart3 className="h-3 w-3" />
                      Bar
                    </button>
                    <button
                      onClick={() => setOrdersChartType("line")}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all text-xs ${
                        ordersChartType === "line"
                          ? "bg-green-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <LineChartIcon className="h-3 w-3" />
                      Line
                    </button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  {ordersChartType === "bar" ? (
                    <BarChart data={chartOrders}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" stroke="#999" />
                      <YAxis stroke="#999" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#f9fafb",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="orders" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={chartOrders}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" stroke="#999" />
                      <YAxis stroke="#999" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#f9fafb",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#10b981"
                        dot={false}
                        strokeWidth={2}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            )}

            {/* Top Products Distribution */}
            {topProductsData.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Top Products</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={topProductsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) =>
                        `${name}: ₹${(value as number).toLocaleString()}`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {topProductsData.map((entry: unknown, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `₹${Number(value).toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Analytics Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SalesCard />
            <VisitorsCard />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OrdersCard />
            <ProductCard />
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Performance Summary */}
          <PerformanceCard />

          {/* Customer Insights */}
          <ReturningCard />

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Quick Insights
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">Avg. Order Value</span>
                <span className="font-bold text-blue-600">
                  ₹{orders > 0 ? (revenue / orders).toLocaleString() : "0"}
                </span>
              </li>
              <li className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Conversion Rate</span>
                <span className="font-bold text-green-600">
                  {conversionRate.toFixed(1)}%
                </span>
              </li>
              <li className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-700">Total Revenue</span>
                <span className="font-bold text-purple-600">
                  ₹{(revenue / 1000).toFixed(1)}K
                </span>
              </li>
            </ul>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <ActivityItem
                icon="🟢"
                label="Purchase"
                value="₹2,500"
                time="2 mins ago"
              />
              <ActivityItem
                icon="👁️"
                label="Page View"
                value="Product Page"
                time="5 mins ago"
              />
              <ActivityItem
                icon="🛒"
                label="Cart Added"
                value="₹1,250"
                time="8 mins ago"
              />
              <ActivityItem
                icon="⭐"
                label="Review Posted"
                value="5 Stars"
                time="15 mins ago"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// KPI Card Component
const KPICard = ({
  title,
  value,
  change,
  icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}) => {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 text-blue-600",
    green: "from-green-50 to-green-100 text-green-600",
    orange: "from-orange-50 to-orange-100 text-orange-600",
    purple: "from-purple-50 to-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-sm text-green-600 mt-2 font-semibold">{change}</p>
        </div>
        <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} p-3 rounded-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Activity Item Component
const ActivityItem = ({
  icon,
  label,
  value,
  time,
}: {
  icon: string;
  label: string;
  value: string;
  time: string;
}) => {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <div>
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </div>
      <span className="text-sm font-semibold text-gray-700">{value}</span>
    </div>
  );
};