"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  NotebookText,
  CircleDollarSign,
  Ship,
  // ShoppingCart,
  LogOut,
  HardDrive,
  MessageCircleMore,
  BadgeInfo,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

import { signOut } from "next-auth/react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import logo from "../../../public/images/logo.png";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Courses", href: "/courses-management", icon: HardDrive },
  { name: "Trips", href: "/trips", icon: Ship },
  { name: "Products", href: "/products", icon: NotebookText },
  { name: "Bookings", href: "/bookings", icon: NotebookText },
  // { name: "Order", href: "/order", icon: ShoppingBag },
  { name: "Messaging", href: "/messaging", icon: MessageCircleMore },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Payments", href: "/payments", icon: CircleDollarSign },
  { name: "About Us", href: "/abouts", icon: BadgeInfo },
  { name: "Social", href: "/social", icon: ExternalLink },

  // { name: "Shop", href: "/shop", icon: ShoppingCart },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    // NextAuth signOut with redirect to login page
    signOut({ callbackUrl: "/login" });
    setOpen(false);
  };

  return (
    <div className="flex min-h-screen w-64 flex-col   bg-white border-r border-gray-200 fixed">
      {/* Logo */}
      <div className="flex  items-center py-5 justify-center px-6">
        <Link href="/" className="flex items-center ">
          <Image
            src={logo}
            alt="This is Stevenarr Logo"
            width={68}
            height={68}
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 px-3 py-4">
        {navigation.map((item) => {
          // Active logic
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg p-3 text-base leading-[150%] tracking-[0%] font-semibold transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 p-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12 px-4 cursor-pointer rounded-lg font-medium text-[#e5102e] hover:bg-[#feecee] hover:text-[#e5102e] transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              Log Out
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
              <DialogDescription>
                Are you sure you want to log out?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2">
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="cursor-pointer"
                variant="destructive"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
