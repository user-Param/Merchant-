"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Dashboard from "@/pages/dashboard";
import Customers from "@/pages/customers";
import Orders from "@/pages/orders";
import Products from "@/pages/products";

export default function Home() {
  const [activePanel, setActivePanel] = useState("dashboard");

  return (
    <>
      <Navbar />

      <div className="flex">
        <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />

        <div className="flex-1 overflow-auto">
          {activePanel === "dashboard" && <Dashboard />}
          {activePanel === "customers" && <Customers />}
          {activePanel === "orders" && <Orders />}
          {activePanel === "products" && <Products />}
        </div>
      </div>
    </>
  );
}