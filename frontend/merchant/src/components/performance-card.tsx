"use client";

import { Eye, ShoppingCart, CreditCard } from "lucide-react";
import { useAnalytics } from "@/hooks/use-analytics";

interface FunnelData {
  views?: number;
  cart_adds?: number;
  purchases?: number;
}

interface StatItemProps {
  label: string;
  value: string;
  loading: boolean;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const PerformanceCard = () => {
  const { data, loading } = useAnalytics<FunnelData>("funnel");

  const views = data?.views ? Number(data.views).toLocaleString() : "0";
  const cartAdds = data?.cart_adds ? Number(data.cart_adds).toLocaleString() : "0";
  const purchases = data?.purchases ? Number(data.purchases).toLocaleString() : "0";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-900 font-bold">Conversion Performance</h3>
        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded font-bold uppercase tracking-wider">Real-time</span>
      </div>

      <div className="space-y-6">
        <StatItem label="Product Views" value={views} loading={loading} icon={Eye} color="text-blue-500" bgColor="bg-blue-50" />
        <StatItem label="Added to Cart" value={cartAdds} loading={loading} icon={ShoppingCart} color="text-orange-500" bgColor="bg-orange-50" />
        <StatItem label="Purchased" value={purchases} loading={loading} icon={CreditCard} color="text-green-500" bgColor="bg-green-50" />
      </div>

      <div className="mt-8 pt-6 border-t border-gray-50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Overall Conversion Rate</span>
          <span className="font-bold text-gray-900">2.7%</span>
        </div>
        <div className="mt-3 w-full bg-gray-100 h-2 rounded-full overflow-hidden flex">
          <div className="bg-blue-500 h-full w-[100%]" title="Views"></div>
          <div className="bg-orange-500 h-full w-[15%]" title="Cart"></div>
          <div className="bg-green-500 h-full w-[5%]" title="Purchased"></div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value, loading, icon: Icon, color, bgColor }: StatItemProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className={`p-3 ${bgColor} ${color} rounded-xl`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <h4 className="text-xl font-bold text-gray-900">{loading ? "..." : value}</h4>
      </div>
    </div>
    <div className="text-right">
      <span className="text-green-500 text-xs font-bold flex items-center justify-end gap-0.5">
        +12%
      </span>
    </div>
  </div>
);

export default PerformanceCard;