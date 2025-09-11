"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function DashboardHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full h-[100px] bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
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
        <div className="flex flex-col ">
          <h1 className="text-xl text-primary font-bold  ">My Dashboard</h1>
          <p className="!text-sm text-gray-400">
            Welcome back! Here&apos;s what&apos;s happening with your app today.
          </p>
        </div>
      </div>

      {/* Right: Icons + User */}
      <div className="flex items-center gap-4">
        {/* User avatar */}
        <div className="flex items-center  gap-2 cursor-pointer">
          <Link href={"/"}></Link>
          <Image
            src="/images/profile-mini.jpg"
            alt="User"
            height={40}
            width={40}
            className=" rounded-full border"
          />
          {/* <span className="hidden md:block font-medium text-gray-700">
            John Doe
          </span> */}
        </div>
      </div>
    </header>
  );
}
