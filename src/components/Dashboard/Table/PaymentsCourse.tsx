"use client";
import React, { useState, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";
import { getAllClassPayments } from "@/lib/api";

export type TripPayment = {
  id: string;
  tripTitle: string;
  participants: number;
  totalPrice: number;
  status: "paid" | "pending";
  date: string;
};
type Participant = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: number;
};

type TripInfo = {
  _id: string;
  title: string;
  price: number | number[]; // class API sometimes returns an array for price
};

type ClassPaymentAPI = {
  _id: string;
  trip?: TripInfo;
  classId?: TripInfo; // sometimes class payments use classId instead of trip
  user?: {
    _id: string;
    email: string;
  };
  participants?: Participant[];
  totalParticipants?: number;
  totalPrice: number;
  status: "paid" | "pending";
  createdAt: string;
};
const PaymentsTrip = () => {
  const [payments, setPayments] = useState<TripPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof TripPayment | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res: ClassPaymentAPI[] = await getAllClassPayments();

        // Map API response to TripPayment type
        const mappedData: TripPayment[] = res.map((item) => ({
          id: item._id,
          tripTitle: item.trip?.title || item.classId?.title || "Demo Trip",
          participants:
            item.participants?.length || item.totalParticipants || 1,
          totalPrice: item.totalPrice,
          status: item.status,
          date: new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
        }));

        setPayments(mappedData);
      } catch (err) {
        console.error("Error fetching trip payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleSort = (field: keyof TripPayment) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortField) return payments;
    return [...payments].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [payments, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadgeStyle = (status: TripPayment["status"]) => {
    switch (status) {
      case "paid":
        return "bg-teal-100 text-teal-800 border border-teal-200";
      case "pending":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="w-full bg-white">
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort("tripTitle")}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Trip
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Participants
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Total Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData.map((payment) => (
              <tr
                key={payment.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-900">
                  {payment.tripTitle}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {payment.participants}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ${payment.totalPrice}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(
                      payment.status
                    )}`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {payment.date}
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No payments found.
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
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentsTrip;
