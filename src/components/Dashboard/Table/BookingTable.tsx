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

export type Participant = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type MedicalDocument = {
  _id: string;
  public_id: string;
  url: string;
};

export type Booking = {
  id: string;
  invoice: string;
  customerName: string;
  customerEmail: string;
  location: string;
  price: number;
  status: "Paid" | "Cancelled" | "Pending" | "Success";
  date?: string;
  dates?: string[];
  avatar: string;
  classImage?: string;
  participants?: Participant[];
  activityLevelSpecificQuestions?: string[];
  medicalHistory?: string[];
  medicalDocuments?: MedicalDocument[];
  courseIncludes?: string[];
  divingExperience?: string;
  fitnessLevel?: string;
  canSwim?: string;
  gender?: string;
  height?: number;
  weight?: number;
  shoeSize?: number | string;
  lastPhysicalExamination?: string;
  description?: string;
  duration?: string;
  classId?: string | null;
  totalParticipates?: number;
  avgRating?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type BookingAPIResponse = {
  _id: string;
  userId?: { _id?: string; email?: string };
  totalPrice?: number;
  status?: "paid" | "success" | "cancelled" | string;
  classDate?: string[];
  classId?: {
    _id?: string;
    image?: { public_id?: string; url?: string };
    classDates?: string[];
    title?: string;
    description?: string;
    price?: number[];
    courseIncludes?: string[];
    duration?: string;
    totalReviews?: number;
    avgRating?: number;
    participates?: number;
    totalParticipates?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    index?: number;
  };
  participant?: number;
  medicalHistory?: string[];
  canSwim?: string;
  divingExperience?: string;
  lastPhysicalExamination?: string;
  fitnessLevel?: string;
  activityLevelSpecificQuestions?: string[];
  medicalDocuments?: { _id: string; public_id: string; url: string }[];
  gender?: string;
  shoeSize?: number | string;
  hight?: number;
  weight?: number;
  createdAt?: string;
  updatedAt?: string;
};

const itemsPerPage = 8;

const BookingTable: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  console.log(bookings);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await getAllBookings();

        if (res?.success) {
          const mapped: Booking[] = (res.data as BookingAPIResponse[]).map(
            (item, index) => ({
              id: item._id || `temp-id-${index}`,
              invoice: `#${1000 + index}`,
              customerName: item.userId?.email || "Demo User",
              customerEmail: item.userId?.email || "demo@example.com",
              location: "Not Provided",
              price: item.totalPrice || 0,
              status:
                item.status?.toLowerCase() === "paid"
                  ? "Paid"
                  : item.status?.toLowerCase() === "success"
                  ? "Success"
                  : "Pending",
              date: item.classDate?.[0]
                ? new Date(item.classDate[0]).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                : "N/A",
              dates:
                item.classDate?.map((date) =>
                  new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                ) || [],
              avatar: item.classId?.image?.url || "/images/profile-mini.jpg",
              classImage:
                item.classId?.image?.url || "/images/default-class.jpg",
              participants: item.participant
                ? Array.from({ length: item.participant }).map((_, i) => ({
                    _id: `${item._id}-${i}`,
                    firstName: "Participant",
                    lastName: `${i + 1}`,
                    email: `participant${i + 1}@example.com`,
                  }))
                : [],
              activityLevelSpecificQuestions:
                item.activityLevelSpecificQuestions || [],
              medicalHistory: item.medicalHistory || [],
              medicalDocuments: item.medicalDocuments || [],
              courseIncludes: item.classId?.courseIncludes || [],
              divingExperience: item.divingExperience || "",
              fitnessLevel: item.fitnessLevel || "",
              canSwim: item.canSwim || "",
              gender: item.gender || "",
              height: item.hight || 0,
              weight: item.weight || 0,
              shoeSize: item.shoeSize || "",
              lastPhysicalExamination: item.lastPhysicalExamination
                ? new Date(item.lastPhysicalExamination).toLocaleDateString()
                : "",
              description: item.classId?.description || "",
              duration: item.classId?.duration || "",
              classId: item.classId?._id || null,
              totalParticipates: item.classId?.totalParticipates || 0,
              avgRating: item.classId?.avgRating || 0,
              isActive: item.classId?.isActive ?? true,
              createdAt: item.createdAt
                ? new Date(item.createdAt).toLocaleDateString()
                : "",
              updatedAt: item.updatedAt
                ? new Date(item.updatedAt).toLocaleDateString()
                : "",
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
                    <DialogContent className="sm:max-w-5xl p-6 rounded-3xl shadow-2xl bg-gray-50 border border-gray-200 max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-3xl font-bold text-gray-800">
                          Booking Details
                        </DialogTitle>
                      </DialogHeader>

                      {selectedBooking && (
                        <div className="mt-6 space-y-6 text-gray-700 text-sm">
                          {/* Basic Info Card */}
                          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                              <Image
                                src={
                                  selectedBooking.classImage ||
                                  selectedBooking.avatar
                                }
                                alt={selectedBooking.customerName}
                                width={400}
                                height={250}
                                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                              />
                            </div>

                            <div className="flex-1 space-y-2">
                              <p>
                                <strong>Invoice:</strong>{" "}
                                {selectedBooking.invoice || "N/A"}
                              </p>
                              <p>
                                <strong>Customer:</strong>{" "}
                                {selectedBooking.customerName || "N/A"}
                              </p>
                              <p>
                                <strong>Email:</strong>{" "}
                                {selectedBooking.customerEmail || "N/A"}
                              </p>
                              <p>
                                <strong>Price:</strong> $
                                {selectedBooking.price?.toLocaleString() ||
                                  "N/A"}
                              </p>
                              <p>
                                <strong>Status:</strong>{" "}
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeStyle(
                                    selectedBooking.status
                                  )}`}
                                >
                                  {selectedBooking.status || "N/A"}
                                </span>
                              </p>
                              <p>
                                <strong>Date:</strong>{" "}
                                {selectedBooking.date || "N/A"}
                              </p>
                              <p>
                                <strong>Location:</strong>{" "}
                                {selectedBooking.location || "N/A"}
                              </p>
                            </div>
                          </div>

                          {/* Extended Info Card */}
                          <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Section */}
                            <div className="space-y-4">
                              <p>
                                <strong>Class Description:</strong>{" "}
                                {selectedBooking.description || "N/A"}
                              </p>
                              <p>
                                <strong>Duration:</strong>{" "}
                                {selectedBooking.duration || "N/A"}
                              </p>

                              <div>
                                <p className="font-semibold">
                                  Course Includes:
                                </p>
                                <ul className="list-disc list-inside ml-4">
                                  {selectedBooking.courseIncludes?.length ? (
                                    selectedBooking.courseIncludes.map(
                                      (item, idx) => <li key={idx}>{item}</li>
                                    )
                                  ) : (
                                    <li>N/A</li>
                                  )}
                                </ul>
                              </div>

                              <div>
                                <p className="font-semibold">
                                  Activity Level Questions:
                                </p>
                                <ul className="list-disc list-inside ml-4">
                                  {selectedBooking
                                    .activityLevelSpecificQuestions?.length ? (
                                    selectedBooking.activityLevelSpecificQuestions.map(
                                      (item, idx) => <li key={idx}>{item}</li>
                                    )
                                  ) : (
                                    <li>N/A</li>
                                  )}
                                </ul>
                              </div>

                              <div>
                                <p className="font-semibold">
                                  Medical History:
                                </p>
                                <ul className="list-disc list-inside ml-4">
                                  {selectedBooking.medicalHistory?.length ? (
                                    selectedBooking.medicalHistory.map(
                                      (item, idx) => <li key={idx}>{item}</li>
                                    )
                                  ) : (
                                    <li>N/A</li>
                                  )}
                                </ul>
                              </div>

                              <div>
                                <p className="font-semibold">Documents:</p>
                                <div className="flex flex-col gap-1 ml-4">
                                  {selectedBooking.medicalDocuments?.length ? (
                                    selectedBooking.medicalDocuments.map(
                                      (doc) => (
                                        <a
                                          key={doc._id}
                                          href={doc.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-teal-600 underline hover:text-teal-800 transition-colors"
                                        >
                                          {doc.public_id}
                                        </a>
                                      )
                                    )
                                  ) : (
                                    <span>N/A</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right Section */}
                            <div className="space-y-4">
                              <p>
                                <strong>Diving Experience:</strong>{" "}
                                {selectedBooking.divingExperience || "N/A"}
                              </p>
                              <p>
                                <strong>Fitness Level:</strong>{" "}
                                {selectedBooking.fitnessLevel || "N/A"}
                              </p>
                              <p>
                                <strong>Can Swim:</strong>{" "}
                                {selectedBooking.canSwim || "N/A"}
                              </p>
                              <p>
                                <strong>Gender:</strong>{" "}
                                {selectedBooking.gender || "N/A"}
                              </p>
                              <p>
                                <strong>Height:</strong>{" "}
                                {selectedBooking.height || "N/A"}
                              </p>
                              <p>
                                <strong>Weight:</strong>{" "}
                                {selectedBooking.weight || "N/A"}
                              </p>
                              <p>
                                <strong>Shoe Size:</strong>{" "}
                                {selectedBooking.shoeSize || "N/A"}
                              </p>
                              <p>
                                <strong>Last Physical Exam:</strong>{" "}
                                {selectedBooking.lastPhysicalExamination ||
                                  "N/A"}
                              </p>

                              <div>
                                <p className="font-semibold">Participants:</p>
                                <ul className="list-disc list-inside ml-4">
                                  {selectedBooking.participants?.length ? (
                                    selectedBooking.participants.map((p) => (
                                      <li key={p._id}>
                                        {p.firstName} {p.lastName} ({p.email})
                                      </li>
                                    ))
                                  ) : (
                                    <li>N/A</li>
                                  )}
                                </ul>
                              </div>

                              <p>
                                <strong>Average Rating:</strong>{" "}
                                {selectedBooking.avgRating ?? "N/A"}
                              </p>
                              <p>
                                <strong>Total Participates:</strong>{" "}
                                {selectedBooking.totalParticipates ?? "N/A"}
                              </p>
                              <p>
                                <strong>Active:</strong>{" "}
                                {selectedBooking.isActive ? "Yes" : "No"}
                              </p>
                              <p>
                                <strong>Created At:</strong>{" "}
                                {selectedBooking.createdAt || "N/A"}
                              </p>
                              <p>
                                <strong>Updated At:</strong>{" "}
                                {selectedBooking.updatedAt || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <DialogClose asChild>
                        <button className="mt-6 w-full md:w-auto px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition-colors duration-200">
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

      {/* Pagination Styled Same as ProductsEditForm */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Showing results */}
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + itemsPerPage, bookings.length)} of{" "}
          {bookings.length} results
        </p>

        {/* Pagination */}
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-[#8E938F] rounded cursor-pointer"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded ${
                currentPage === num
                  ? "bg-[#0694A2] hover:bg-[#0694A2] text-white cursor-pointer"
                  : "bg-gray-100 text-gray-700 border border-[#0694A2] cursor-pointer"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-[#8E938F] rounded cursor-pointer"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingTable;
