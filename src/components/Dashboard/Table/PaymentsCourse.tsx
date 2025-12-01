"use client";

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
} from "@/components/ui/dialog";
import { getAllClassPayments } from "@/lib/api";

// Types
type PaymentAPI = {
  _id: string;
  classId?: {
    _id: string;
    title: string;
    image?: { url: string; public_id: string };
    description?: string;
    price?: number | number[];
    courseIncludes?: string[];
    duration?: string;
  } | null;
  userId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  participant: number;
  totalPrice: number;
  status: "paid" | "pending";
  classDate?: string[];
  medicalHistory?: string[];
  canSwim?: string;
  divingExperience?: string;
  lastPhysicalExamination?: string;
  fitnessLevel?: string;
  activityLevelSpecificQuestions?: string[];
  medicalDocuments?: string;
  createdAt: string;
};

type Payment = {
  id: string;
  title: string;
  image: string;
  participant: number;
  totalPrice: number;
  status: "paid" | "pending";
  details: PaymentAPI;
};

const PaymentsClass = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res: PaymentAPI[] = await getAllClassPayments();
        const formatted: Payment[] = (res || []).map((p) => ({
          id: p._id,
          title: p.classId?.title || "N/A",
          image: p.classId?.image?.url || "/placeholder.jpg",
          participant: p.participant,
          totalPrice: p.totalPrice,
          status: p.status,
          details: p,
        }));
        setPayments(formatted);
      } catch (err) {
        console.error("Error fetching class payments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const getStatusBadgeStyle = (status: "paid" | "pending") =>
    status === "paid"
      ? "bg-teal-100 text-teal-800 border border-teal-200"
      : "bg-purple-100 text-purple-800 border border-purple-200";

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString("en-US") : "N/A";

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="w-full bg-white p-4">
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Invoice</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Class</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Participants</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total Price</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {payments.length ? (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">#{payment.id.slice(-4)}</td>
                  <td className="flex gap-2 items-center px-6 py-4 text-sm text-gray-900">
                    <Image
                      src={payment.image}
                      alt={payment.title}
                      width={70}
                      height={50}
                      className="rounded object-cover"
                    />
                    {payment.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.participant}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${payment.totalPrice}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(
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
                      <DialogContent className="sm:max-w-3xl p-6 rounded-2xl shadow-2xl bg-white border border-gray-200 max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-gray-800">Class Payment Details</DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                          <div className="rounded-lg overflow-hidden shadow-md">
                            <Image
                              src={payment.image}
                              alt={payment.title}
                              width={400}
                              height={250}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="space-y-2 text-sm text-gray-700">
                            <p><strong>Invoice:</strong> #{payment.id.slice(-4)}</p>
                            <p><strong>Class:</strong> {payment.title}</p>
                            <p><strong>Price:</strong> ${payment.totalPrice}</p>
                            <p>
                              <strong>Status:</strong>{" "}
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeStyle(payment.status)}`}>
                                {payment.status.toUpperCase()}
                              </span>
                            </p>
                            <p><strong>Description:</strong> {payment.details.classId?.description || "N/A"}</p>
                            <p><strong>Duration:</strong> {payment.details.classId?.duration || "N/A"}</p>
                            <p><strong>Class Dates:</strong> {payment.details.classDate?.map(formatDate).join(", ") || "N/A"}</p>
                            {payment.details.medicalHistory?.length && (
                              <p><strong>Medical History:</strong> {payment.details.medicalHistory.join(", ")}</p>
                            )}
                            {payment.details.canSwim && <p><strong>Can Swim:</strong> {payment.details.canSwim}</p>}
                            {payment.details.divingExperience && <p><strong>Diving Experience:</strong> {payment.details.divingExperience}</p>}
                            {payment.details.lastPhysicalExamination && (
                              <p><strong>Last Physical Exam:</strong> {formatDate(payment.details.lastPhysicalExamination)}</p>
                            )}
                            {payment.details.fitnessLevel && <p><strong>Fitness Level:</strong> {payment.details.fitnessLevel}</p>}
                            {payment.details.activityLevelSpecificQuestions?.length && (
                              <p><strong>Activity Approval:</strong> {payment.details.activityLevelSpecificQuestions.join("; ")}</p>
                            )}
                            {/* {payment.details.medicalDocuments && (
                              <p><strong>Medical Docs:</strong>{" "}
                                <a href={payment.details.medicalDocuments} target="_blank" className="text-blue-600 hover:underline">View</a>
                              </p>
                            )} */}
                          </div>
                        </div>

                        {payment.details.userId && (
                          <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">User Information</h3>
                            <p><strong>Name:</strong> {payment.details.userId.firstName} {payment.details.userId.lastName}</p>
                            <p><strong>Email:</strong> {payment.details.userId.email}</p>
                          </div>
                        )}

                        <DialogClose asChild>
                          <button className="mt-8 w-full md:w-auto px-5 py-2 bg-[#0694A2] text-white font-medium rounded-lg   transition-colors duration-200 cursor-pointer">Close</button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No class payments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsClass;
