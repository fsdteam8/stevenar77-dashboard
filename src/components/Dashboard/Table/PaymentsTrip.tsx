"use client";

import { getAllTripPayments } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"; // shadcn/ui dialog

// Types
export type Participant = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type User = {
  firstName: string;
  lastName: string;
  email: string;
};

export type TripDetails = {
  _id: string;
  title: string;
  location: string;
  images: { url: string }[];
};

export type TripPaymentDetails = {
  _id: string;
  trip: TripDetails;
  user: User;
  totalPrice: number;
  status: "paid" | "pending";
  participants: Participant[];
};

export type TripPayment = {
  id: string;
  tripTitle: string;
  totalPrice: number;
  status: "paid" | "pending";
  images: string;
  location: string;
  user: User;
  participants: Participant[];
  details: TripPaymentDetails;
};

const PaymentsTrip: React.FC = () => {
  const [payments, setPayments] = useState<TripPayment[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const data: TripPaymentDetails[] = await getAllTripPayments();
      const formattedData: TripPayment[] = data.map((p) => ({
        id: p._id,
        tripTitle: p.trip.title,
        totalPrice: p.totalPrice,
        status: p.status,
        images: p.trip.images?.[0]?.url || "/placeholder.png",
        location: p.trip.location || "N/A",
        user: p.user,
        participants: p.participants || [],
        details: p,
      }));
      setPayments(formattedData);
    };
    fetchPayments();
  }, []);

  const getPaymentStatusBadgeStyle = (status: TripPayment["status"]) =>
    status === "paid"
      ? "bg-green-100 text-green-700 border border-green-200"
      : "bg-yellow-100 text-yellow-700 border border-yellow-200";

  return (
    <div className="w-full bg-white p-4">
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Invoice
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Trip
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Total Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Location
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    #{payment.id.slice(-4)}
                  </td>
                  <td className="flex gap-2 items-center px-6 py-4 text-md text-gray-900">
                    <Image
                      src={payment.images}
                      alt={payment.tripTitle}
                      width={70}
                      height={50}
                      className="rounded object-cover"
                    />
                    {payment.tripTitle}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${payment.totalPrice}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {payment.location}
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
                  <td className="px-6 py-4 text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer">
                          <Eye className="w-5 h-5 inline-block" />
                        </button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-3xl p-6 rounded-2xl shadow-2xl bg-white border border-gray-200">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-gray-800">
                            Trip Payment Details
                          </DialogTitle>
                        </DialogHeader>

                        {/* Trip Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                          <div className="rounded-lg overflow-hidden shadow-md">
                            <Image
                              src={payment.images}
                              alt={payment.tripTitle}
                              width={400}
                              height={250}
                              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                          <div className="space-y-3 text-sm text-gray-700">
                            <p>
                              <strong>Invoice:</strong> #{payment.id.slice(-4)}
                            </p>
                            <p>
                              <strong>Trip:</strong> {payment.tripTitle}
                            </p>
                            <p>
                              <strong>Location:</strong> {payment.location}
                            </p>
                            <p>
                              <strong>Price:</strong> ${payment.totalPrice}
                            </p>
                            <p>
                              <strong>Status:</strong>{" "}
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusBadgeStyle(
                                  payment.status
                                )}`}
                              >
                                {payment.status.toUpperCase()}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            User Information
                          </h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              <strong>Email:</strong> {payment.user.email}
                            </p>
                            <p>
                              <strong>Name:</strong> {payment.user.firstName}{" "}
                              {payment.user.lastName}
                            </p>
                          </div>
                        </div>

                        {/* Participants */}
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Participants
                          </h3>
                          {payment.participants.length > 0 ? (
                            <ul className="list-disc ml-6 text-sm text-gray-600 space-y-1">
                              {payment.participants.map((pt) => (
                                <li key={pt._id}>
                                  {pt.firstName} {pt.lastName} ({pt.email})
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500 text-sm">
                              No participants
                            </p>
                          )}
                        </div>

                        <DialogClose asChild>
                          <button className="mt-8 w-full md:w-auto px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
                            Close
                          </button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))
            ) : (
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
    </div>
  );
};

export default PaymentsTrip;
