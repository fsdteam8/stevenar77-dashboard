"use client";

import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import Image from "next/image";
import { getAllBookings } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export type Booking = {
  id: string;
  invoice: string;
  customerName: string;
  customerEmail: string;
  location: string;
  price: number;
  status: "Paid" | "Cancelled" | "Pending" | "Success";
  date: string;
  avatar: string;
  classImage?: string;
  participants?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
};

// Define the API response type
type BookingAPIResponse = {
  _id: string;
  userId?: { email?: string };
  totalPrice?: number;
  status?: "paid" | "success" | "cancelled" | string;
  classDate?: string[];
  classId?: { image?: { url?: string } };
  participant?: number;
};

const itemsPerPage = 10;

const BookingTable: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await getAllBookings();
        if (res?.success) {
          const mapped: Booking[] = (res.data as BookingAPIResponse[]).map(
            (item, index) => ({
              id: item._id,
              invoice: `#${1000 + index}`,
              customerName: item.userId?.email || "Demo User",
              customerEmail: item.userId?.email || "demo@example.com",
              location: "Not Provided",
              price: item.totalPrice || 0,
              status:
                item.status === "paid"
                  ? "Paid"
                  : item.status === "success"
                  ? "Success"
                  : "Pending",
              date: item.classDate?.[0]
                ? new Date(item.classDate[0]).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                : "N/A",
              avatar: item.classId?.image?.url || "/images/profile-mini.jpg",
              classImage: item.classId?.image?.url,
              participants: item.participant
                ? Array.from({ length: item.participant }).map((_, i) => ({
                    _id: `${item._id}-${i}`,
                    firstName: "Participant",
                    lastName: `${i + 1}`,
                    email: `participant${i + 1}@example.com`,
                  }))
                : [],
            })
          );
          setBookings(mapped);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusBadgeStyle = (status: Booking["status"]) => {
    switch (status) {
      case "Paid":
      case "Success":
        return "bg-teal-100 text-teal-800 border border-teal-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    }
  };

  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = bookings.slice(startIndex, startIndex + itemsPerPage);

  if (loading)
    return <div className="text-center py-10">Loading bookings...</div>;

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Invoice
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData.map((booking) => (
              <tr
                key={booking.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-600">
                  {booking.invoice}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={booking.avatar}
                      alt={booking.customerName}
                      width={30}
                      height={30}
                      className="rounded-full object-cover flex-shrink-0"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {booking.customerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.customerEmail}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ${booking.price.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {booking.date}
                </td>
                <td className="px-6 py-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        Details
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xl p-6 rounded-2xl shadow-2xl bg-white border border-gray-200">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-800">
                          Booking Details
                        </DialogTitle>
                      </DialogHeader>

                      {selectedBooking && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                          <div className="rounded-lg overflow-hidden shadow-md">
                            <Image
                              src={
                                selectedBooking.classImage ||
                                "/images/profile-mini.jpg"
                              }
                              alt={selectedBooking.customerName}
                              width={400}
                              height={250}
                              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                          <div className="space-y-3 text-sm text-gray-700">
                            <p>
                              <strong>Invoice:</strong>{" "}
                              {selectedBooking.invoice}
                            </p>
                            <p>
                              <strong>Customer:</strong>{" "}
                              {selectedBooking.customerName}
                            </p>
                            <p>
                              <strong>Email:</strong>{" "}
                              {selectedBooking.customerEmail}
                            </p>
                            <p>
                              <strong>Price:</strong> $
                              {selectedBooking.price.toLocaleString()}
                            </p>
                            <p>
                              <strong>Status:</strong>{" "}
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeStyle(
                                  selectedBooking.status
                                )}`}
                              >
                                {selectedBooking.status.toUpperCase()}
                              </span>
                            </p>
                            <p>
                              <strong>Date:</strong> {selectedBooking.date}
                            </p>
                          </div>
                        </div>
                      )}

                      <DialogClose asChild>
                        <button className="mt-8 w-full md:w-auto px-5 py-2 bg-[#0694A2] text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer">
                          Close
                        </button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}

            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 py-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingTable;
