"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="w-full border-b bg-white px-6 py-4 flex justify-between items-center">
      
      <h1 className="text-xl font-bold">Merchant</h1>
      <div className="flex items-center gap-4 relative" ref={ref}>
        
        <button onClick={() => setOpen(!open)} className="relative">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </button>

        {open && (
          <div className="absolute right-0 top-10 w-80 bg-white shadow-lg rounded-xl p-4 z-50">
            <h2 className="font-semibold mb-3">Recent Activity</h2>

            <ul className="space-y-2 text-sm text-gray-600 max-h-60 overflow-y-auto">
              <li>🟢 User purchased Product A — ₹120</li>
              <li>🔵 User viewed Product B</li>
              <li>🟢 User purchased Product C — ₹250</li>
            </ul>
          </div>
        )}
        <div className="font-medium cursor-pointer">Profile</div>
      </div>
    </nav>
  );
};

export default Navbar;