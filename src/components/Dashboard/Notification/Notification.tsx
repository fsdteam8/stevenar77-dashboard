"use client";

import React, { useEffect, useState } from "react";
import { Bell, CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import io, { Socket } from "socket.io-client";

interface Notification {
  _id: string;
  message: string;
  isViewed: boolean;
  type: string;
  createdAt: string;
}

let socket: Socket | null = null;

export default function Notification() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mark all notifications as read
  const markAllAsRead = React.useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/read/all`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({ isViewed: true }),
        }
      );

      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isViewed: true })));
      } else {
        console.error("Failed to mark notifications as read");
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  }, [session?.user?.id, session?.accessToken]);

  // Fetch old notifications from API
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          setNotifications(json.data);

          // Automatically mark all as read when page loads
          if (json.data.length > 0) {
            markAllAsRead();
          }
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [session, markAllAsRead]);

  // Connect to socket.io + join room
  useEffect(() => {
    if (!session?.user?.id) return;

    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ["websocket"],
    });

    socket.emit("joinRoom", session.user.id);

    socket.on("newNotification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);

      // Automatically mark the new notification as read
      markAllAsRead();
    });

    return () => {
      socket?.disconnect();
    };
  }, [session?.user?.id, markAllAsRead]);

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bell className="h-6 w-6 text-primary" /> Notifications
      </h1>

      <div className="space-y-4">
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
            <svg
              className="w-12 h-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m4 0h-1v4h-1m-6 4h6m6-4v6H5v-6h16zM4 7h16M4 7V5a2 2 0 012-2h12a2 2 0 012 2v2"
              />
            </svg>
            <p className="text-gray-500 text-sm sm:text-base">
              No notifications found
            </p>
          </div>
        )}

        {notifications.slice(0, 15).map((n) => (
          <div
            key={n._id}
            className={`p-4 rounded-xl border shadow-sm flex items-start gap-4 justify-between ${
              n.isViewed ? "bg-gray-50" : "bg-white"
            }`}
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 mt-1">
                {n.isViewed ? (
                  <CheckCircle className="h-6 w-6 text-gray-400" />
                ) : (
                  <Bell className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <h2 className="text-sm font-semibold capitalize">{n.type}</h2>
                <p className="text-gray-600 text-sm">{n.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
