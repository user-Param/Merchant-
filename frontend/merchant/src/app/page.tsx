"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

const Dashboard = dynamic(() => import("@/components/pages/dashboard"), { ssr: false });
const Customers = dynamic(() => import("@/components/pages/customers"), { ssr: false });
const Orders = dynamic(() => import("@/components/pages/orders"), { ssr: false });
const Products = dynamic(() => import("@/components/pages/products"), { ssr: false });

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