"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
} from "lucide-react";

const menuItems = [
  { name: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { name: "orders", label: "Orders", icon: ShoppingCart },
  { name: "products", label: "Products", icon: Package },
  { name: "customers", label: "Customers", icon: Users },
];

const Sidebar = ({ activePanel, setActivePanel }: { activePanel: string, setActivePanel: (panel: string) => void }) => {
  return (
    <aside className="h-screen w-64 bg-white border-r p-4">
      <h2 className="text-xl font-bold mb-6">Control Panel</h2>

      <div className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePanel === item.name;

          return (
            <div
              key={item.name}
              onClick={() => setActivePanel(item.name)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all 
                ${
                  isActive
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;