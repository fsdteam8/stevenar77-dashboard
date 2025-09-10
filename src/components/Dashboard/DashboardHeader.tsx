"use client";

import { Bell, Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function DashboardHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
      {/* Left: Logo + Sidebar Toggle */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 rounded-md border hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>

        {/* Logo / Title */}
        <h1 className="text-xl font-bold text-gray-800">My Dashboard</h1>
      </div>

      {/* Center: Search bar (hidden on mobile) */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Right: Icons + User */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <Bell size={22} />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 cursor-pointer">
          <Image
            src=""
            alt="User"
            className="h-9 w-9 rounded-full border"
          />
          <span className="hidden md:block font-medium text-gray-700">
            John Doe
          </span>
        </div>
      </div>
    </header>
  );
}
