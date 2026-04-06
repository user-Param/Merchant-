"use client";

import { Megaphone, TrendingUp, Target, Zap, MoreHorizontal, ExternalLink } from "lucide-react";

const campaigns = [
  {
    name: "Summer Flash Sale",
    status: "Active",
    revenue: "₹42,500",
    roi: "4.2x",
    reach: "12.4k",
    color: "bg-blue-500",
  },
  {
    name: "Insta Influencer Pack",
    status: "Active",
    revenue: "₹18,200",
    roi: "3.1x",
    reach: "8.2k",
    color: "bg-pink-500",
  },
  {
    name: "Email Newsletter",
    status: "Paused",
    revenue: "₹5,400",
    roi: "1.8x",
    reach: "2.1k",
    color: "bg-gray-400",
  },
];

const CampaignCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Campaign Impact</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold">₹66,100</span>
            <span className="text-blue-500 text-xs font-bold px-2 py-0.5 bg-blue-50 rounded-full uppercase">
              Total Campaign Revenue
            </span>
          </div>
        </div>
        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
          <Megaphone size={20} />
        </div>
      </div>

      {/* Campaign List */}
      <div className="space-y-5">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Campaigns</h4>
        
        {campaigns.map((camp) => (
          <div key={camp.name} className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${camp.color}`}></div>
                <span className="text-sm font-bold text-gray-900">{camp.name}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                camp.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
                {camp.status}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="text-[9px] text-gray-400 uppercase font-bold block">Revenue</span>
                <span className="text-xs font-bold text-gray-900">{camp.revenue}</span>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="text-[9px] text-gray-400 uppercase font-bold block">ROI</span>
                <span className="text-xs font-bold text-blue-600">{camp.roi}</span>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="text-[9px] text-gray-400 uppercase font-bold block">Reach</span>
                <span className="text-xs font-bold text-gray-900">{camp.reach}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
            <Zap size={14} />
          </div>
          <span className="text-xs font-medium text-gray-600">Avg. ROI: <span className="font-bold text-gray-900">3.4x</span></span>
        </div>
        <button className="flex items-center gap-1.5 text-orange-600 text-sm font-semibold hover:underline">
          Manage Campaigns <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};

export default CampaignCard;