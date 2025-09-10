"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function DashboardSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname(); // 👉 বর্তমান path ধরার জন্য

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { name: "Users", icon: <Users size={20} />, href: "/users" },
    { name: "Settings", icon: <Settings size={20} />, href: "/settings" },
    { name: "Logout", icon: <LogOut size={20} />, href: "/logout" },
  ];

  return (
    <div className="flex">
      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden p-2 m-2 rounded-md border"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full bg-gray-900 text-white w-64 p-4 transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <h2 className="text-xl font-bold mb-6">My Dashboard</h2>
        <nav className="space-y-2">
          {menuItems.map((item, i) => {
            const isActive = pathname === item.href; // 👉 active check

            return (
              <a
                key={i}
                href={item.href}
                className={`flex items-center gap-3 p-2 rounded-md transition 
                  ${isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700"}
                `}
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
