"use client";
import { getAllTripPayments } from "@/lib/api";
import React, { useState, useEffect } from "react";
export type TripPayment = {
  id: string;
  tripTitle: string;
  userEmail: string;
  participantsCount: number;
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

type TripPaymentAPI = {
  _id: string;
  trip: {
    _id: string;
    title: string;
    price: number;
  };
  user: {
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPayments = async () => {
      const data: TripPaymentAPI[] = await getAllTripPayments();
      const formattedData: TripPayment[] = data.map((p) => ({
        id: p._id,
        tripTitle: p.trip.title,
        userEmail: p.user.email,
        participantsCount: p.participants?.length || p.totalParticipants || 0,
        totalPrice: p.totalPrice,
        status: p.status,
        date: new Date(p.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      }));
      setPayments(formattedData);
    };
    fetchPayments();
  }, []);

  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = payments.slice(startIndex, startIndex + itemsPerPage);

  const getPaymentStatusBadgeStyle = (status: TripPayment["status"]) =>
    status === "paid"
      ? "bg-teal-100 text-teal-800 border border-teal-200"
      : "bg-purple-100 text-purple-800 border border-purple-200";

  return (
    <div className="w-full bg-white">
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Trip
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                User Email
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
                  {payment.userEmail}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {payment.participantsCount}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ${payment.totalPrice}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadgeStyle(
                      payment.status
                    )}`}
                  >
                    {payment.status.toUpperCase()}
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
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No trip payments found.
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
