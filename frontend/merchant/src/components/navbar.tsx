"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  return (
    <nav className="w-full border-b border-black/20 bg-white px-6 py-4 flex justify-between items-center">
      
      <h1 className="text-xl font-bold">Merchant</h1>
      <div className="flex items-center gap-6">
        {/* Notifications */}
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
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="font-medium text-sm">{user?.name || 'Merchant'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-14 w-48 bg-white shadow-lg rounded-xl p-2 z-50">
              <button
                disabled
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
              >
                <User size={18} />
                Profile
              </button>
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;