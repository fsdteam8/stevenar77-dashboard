"use client";

import { Bell, KeyIcon, LogOut, Menu, User2Icon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { signOut, useSession } from "next-auth/react";
import { getMyProfileData, getNotifications } from "@/lib/api";
import { Skeleton } from "../ui/skeleton";

interface Notification {
  _id: string;
  message: string;
  isViewed: boolean;
  to?: {
    _id: string;
    email: string;
  };
  // Add other fields from your API if needed
}
interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  role?: string;
  isVerified?: boolean;
  street?: string;
  location?: string;
  image?: {
    url?: string;
  };
}

export default function DashboardHeader() {
  // Sidebar open state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Logout dialog open state
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session?.accessToken) return;

      const data = await getNotifications(session.accessToken);
      setNotifications(data.data);
    };

    fetchNotifications();
  }, [session]);

  // Count of unseen notifications
  const unseenCount = notifications.filter((n) => n.isViewed === false).length;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfileData();
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Dummy user data for demonstration — replace with your actual user fetching logic
  //  console.log(user)
  // Logout handler
  const handleLogout = () => {
    signOut();
    setLogoutDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-4 p-5 bg-white rounded-md">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <header className="w-full h-[100px] bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
      {/* Left: Logo + Sidebar Toggle */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-md border hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        {/* Logo / Title */}
        <div className="flex flex-col ">
          <h1 className="text-xl text-primary font-bold  ">My Dashboard</h1>
          <p className="!text-sm text-gray-400">
            Welcome back! Here&apos;s what&apos;s happening with your Website
            today.
          </p>
        </div>
      </div>

      {/* Right: User Profile Dropdown */}
      <div className="flex items-center gap-4">
        <Link href="/notification">
          <button
            className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-6 w-6 text-gray-600" />

            {/* Notification Badge */}
            {unseenCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-5 px-1 rounded-full bg-red-500 text-white text-xs font-semibold">
                {unseenCount}
              </span>
            )}
          </button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 px-3 cursor-pointer"
            >
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage
                  src={user?.image?.url || "/images/profile-mini.jpg"}
                  alt={`${user?.firstName} ${user?.lastName}`}
                  className="object-cover"
                />
                <AvatarFallback className="cursor-pointer">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left cursor-pointer">
                <p className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="cursor-pointer">
            <Link href="/profile">
              <DropdownMenuItem className="cursor-pointer">
                <User2Icon /> Profile
              </DropdownMenuItem>
            </Link>
            <Link href="/profile/changePassword">
              <DropdownMenuItem className="cursor-pointer">
                <KeyIcon /> Change Password
              </DropdownMenuItem>
            </Link>

            {/* Logout triggers dialog open */}
            <DropdownMenuItem
              className="cursor-pointer text-[#e5102e] hover:bg-[#feecee] hover:text-[#e5102e]"
              onClick={() => setLogoutDialogOpen(true)}
            >
              <LogOut /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogTrigger asChild>
          {/* Hidden button, dialog is opened from dropdown above */}
          <button style={{ display: "none" }} aria-hidden="true"></button>
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
              onClick={() => setLogoutDialogOpen(false)}
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
    </header>
  );
}
