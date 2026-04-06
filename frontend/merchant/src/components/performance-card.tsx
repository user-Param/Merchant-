"use client";

import { Eye, ShoppingCart, CreditCard, TrendingUp, ArrowRight } from "lucide-react";

const performanceData = [
  {
    label: "Product Views",
    value: "48,290",
    change: "+12.5%",
    icon: Eye,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    label: "Added to Cart",
    value: "3,120",
    change: "+8.2%",
    icon: ShoppingCart,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    label: "Purchased",
    value: "842",
    change: "+15.7%",
    icon: CreditCard,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
];

const PerformanceCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-900 font-bold">Conversion Performance</h3>
        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded font-bold uppercase tracking-wider">Real-time</span>
      </div>

      <div className="space-y-6">
        {performanceData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 ${item.bgColor} ${item.color} rounded-xl`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                    <h4 className="text-xl font-bold text-gray-900">{item.value}</h4>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-green-500 text-xs font-bold flex items-center justify-end gap-0.5">
                    <TrendingUp size={12} /> {item.change}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-0.5">vs last month</p>
                </div>
              </div>
              
              {/* Funnel Arrow */}
              {index < performanceData.length - 1 && (
                <div className="flex justify-center my-1 ml-6 text-gray-200">
                  <div className="h-4 w-px bg-gray-100 ml-3"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Conversion Funnel Summary */}
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
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div> Views
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div> Cart
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500"></div> Buy
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCard;