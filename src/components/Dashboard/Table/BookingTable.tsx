/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import {
  Ellipsis,
  Eye,
  Loader2,
  UserCog,
  Calendar,
  MapPin,
  ChevronDown,
  Trash,
} from "lucide-react";
import Image from "next/image";
import {
  deleteBooking,
  getAllBookings,
  sentQuickReview,
  useSingleUpdateCourse,
} from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useReassignBooking } from "@/hooks/course/useCourses";
import { useSession } from "next-auth/react";
import { useSingleBooking } from "@/hooks/useBooking";

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

interface UserSession {
  id: string;
  email: string;
  role: string;
  accessToken: string;
}

interface CustomSession {
  user: UserSession;
  accessToken?: string;
}

export type Booking = {
  customerId: { _id?: string; email?: string };
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
  emergencyName?: string[];
  emergencyPhoneNumber?: string[];
  medicalDocuments?: MedicalDocument[];
  courseIncludes?: string[];
  divingExperience?: string;
  fitnessLevel?: string;
  PhoneNumber?: string;
  gender?: string;
  hight?: string | number;
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
  medicalHistory?: string[];
  activityLevelSpecificQuestions?: string[];
  canSwim?: string;
  scheduleId?: string;
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
  emergencyPhoneNumber?: string[];
  phoneNumber?: string;
  divingExperience?: string;
  lastPhysicalExamination?: string;
  fitnessLevel?: string;
  emergencyName?: string[];
  medicalDocuments?: { _id: string; public_id: string; url: string }[];
  gender?: string;
  shoeSize?: number | string;
  hight?: number;
  weight?: number;
  createdAt?: string;
  updatedAt?: string;
  scheduleId?: string;
  email?: string;
  Username?: string;
};

export interface ScheduleDate {
  _id?: string;
  date: string;
  location: string;
  type?: string;
  isActive?: boolean;
}

export interface ScheduleSet {
  _id: string;
  title: string;
  description: string;
  participents: number;
  totalParticipents?: number;
  sets: ScheduleDate[];
}

const itemsPerPage = 8;

const BookingTable: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reassignBooking, setReassignBooking] = useState<Booking | null>(null);
  const [newCourseId, setNewCourseId] = useState<string>("");
  const [openSet, setOpenSet] = useState<number | null>(null);
  const { data, isLoading } = useSingleUpdateCourse(newCourseId);
  const { data: session } = useSession() as { data: CustomSession | null };
  // Reassign booking mutation
  const reassignBookingMutation = useReassignBooking();

const id = selectedBooking?.id;
const { data: singleBooking } = useSingleBooking(id || "");
const [scheduleDates, setScheduleDates] = useState<ScheduleDate[]>([]);

useEffect(() => {
  // Check if scheduleData.sets exists
  if (singleBooking?.data?.scheduleData?.sets) {
    setScheduleDates(singleBooking.data.scheduleData.sets);
  } 
  // Fallback to classDate if scheduleData doesn't exist
  else if (singleBooking?.data?.classDate) {
    const datesArray = singleBooking.data.classDate as string[];
    const datesSet = new Set(datesArray);

    setScheduleDates(
      Array.from(datesSet).map((date) => ({ date, location: "TBD" }))
    );
  }
}, [singleBooking]);

console.log("Schedule Dates:", scheduleDates);
console.log("Single Booking Data:", singleBooking?.data);

  const course = data?.data;

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await getAllBookings();

        if (res?.success) {
          const mapped: Booking[] = (res.data as BookingAPIResponse[]).map(
            (item, index) => ({
              id: item._id || `temp-id-${index}`,
              invoice: `#${item._id}`,
              customerId:
                typeof item.userId === "string"
                  ? { _id: item.userId, email: "demo@example.com" }
                  : {
                      _id: item._id || `demo-id-${index}`,
                      email: item?.email || "demo@example.com",
                    },
              customerName: item?.Username || "Demo User",
              customerEmail: item?.email || "demo@example.com",
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
              emergencyName: item.emergencyName || [],
              emergencyPhoneNumber: item.emergencyPhoneNumber || [],
              medicalDocuments: item.medicalDocuments || [],
              courseIncludes: item.classId?.courseIncludes || [],
              divingExperience: item.divingExperience || "",
              fitnessLevel: item.fitnessLevel || "",
              PhoneNumber: item.phoneNumber || "",
              gender: item.gender || "",
              hight: item.hight || "",
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
              scheduleId: item.scheduleId || "",
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const toggleSet = (index: number) => {
    setOpenSet(openSet === index ? null : index);
  };

  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = bookings.slice(startIndex, startIndex + itemsPerPage);

  // UPDATE THIS MUTATION
  const handleQuickReviewMutation = useMutation({
    mutationFn: ({
      userId,
      link,
      token,
    }: {
      userId: string;
      link: string;
      token: string;
    }) => sentQuickReview(userId, link, token),
    onSuccess: (data) => {
      toast.success(data.message || "Review form sent successfully!");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to send review form");
    },
  });

  // UPDATE THIS FUNCTION
  const handleQuickReview = (link: string, userId: string) => {
    // Get userId and accessToken from session
    // const id = "68bf6876f02adb6fb1fef59b"
    // const userId = booking.customerId._id;
    const accessToken = session?.accessToken || session?.user?.accessToken;

    console.log(userId);
    // Validation
    if (!userId) {
      toast.error("User ID not found in session");
      return;
    }

    if (!accessToken) {
      toast.error("Access token not found in session");
      return;
    }

    // Send the request
    handleQuickReviewMutation.mutate({ userId, link, token: accessToken });
  };

  const handleReassignCourse = (bookingId: string, scheduleId: string) => {
    if (!bookingId || !scheduleId) {
      toast.error("Invalid booking or schedule ID");
      return;
    }

    reassignBookingMutation.mutate(
      { id: bookingId, newScheduleId: scheduleId },
      {
        onSuccess: () => {
          toast.success("Course successfully reassigned!");
          // Refetch bookings to update the UI
          const fetchBookings = async () => {
            try {
              const res = await getAllBookings();
              if (res?.success) {
                const mapped: Booking[] = (
                  res.data as BookingAPIResponse[]
                ).map((item, index) => ({
                  id: item._id || `temp-id-${index}`,
                  invoice: `#${item._id}`,
                  customerId:
                    typeof item.userId === "string"
                      ? { _id: item.userId, email: "demo@example.com" }
                      : {
                          _id: item._id || `demo-id-${index}`,
                          email: item?.email || "demo@example.com",
                        },
                  customerName: item?.Username || "Demo User",
                  customerEmail: item?.email || "demo@example.com",
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
                  avatar:
                    item.classId?.image?.url || "/images/profile-mini.jpg",
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
                  emergencyName: item.emergencyName || [],
                  emergencyPhoneNumber: item.emergencyPhoneNumber || [],
                  medicalDocuments: item.medicalDocuments || [],
                  courseIncludes: item.classId?.courseIncludes || [],
                  divingExperience: item.divingExperience || "",
                  fitnessLevel: item.fitnessLevel || "",
                  PhoneNumber: item.phoneNumber || "",
                  gender: item.gender || "",
                  hight: item.hight || " ",
                  weight: item.weight || 0,
                  shoeSize: item.shoeSize || "",
                  lastPhysicalExamination: item.lastPhysicalExamination
                    ? new Date(
                        item.lastPhysicalExamination
                      ).toLocaleDateString()
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
                  scheduleId: item.scheduleId || "",
                }));
                setBookings(mapped);
              }
            } catch (error) {
              console.error("Error refetching bookings:", error);
            }
          };
          fetchBookings();
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to reassign course");
        },
      }
    );
  };

  // This is Bk=ooking Delete Handler
  const handleBookingDelete = async (id: string) => {
    try {
      if (!session?.accessToken) {
        toast.error("User not authenticated!");
        return;
      }
      // Call delete API
      await deleteBooking(id, session.accessToken);
      toast.success("Booking deleted successfully!");
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50">
          <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
        </div>
        <p className="mt-4 text-gray-600 text-lg font-medium">
          Loading bookings...
        </p>
      </div>
    );

  return (
    <div className="w-full">
      <div className="my-4 text-2xl font-semibold">
        <h1>This is Courses Booking History</h1>
      </div>
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
                Order Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Action
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Delete
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
                  #{booking.invoice?.slice(-4)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={booking.avatar}
                      alt={booking.customerName}
                      width={30}
                      height={30}
                      className="rounded-full object-cover flex-shrink-0 h-10 w-10 "
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
                  {booking.createdAt}
                </td>

                <td className="px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium"
                      >
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-48">
                      {/* Details */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            onClick={() => setSelectedBooking(booking)}
                            className="cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                            Details
                          </DropdownMenuItem>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-5xl p-6 rounded-3xl shadow-2xl bg-gray-50 border border-gray-200 max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-3xl font-bold text-gray-800">
                              Booking Details
                            </DialogTitle>
                          </DialogHeader>

                          {selectedBooking && (
                            <div className="mt-6 space-y-6 text-gray-700 text-sm">
                              <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6">
                                <div className="flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                                  <Image
                                    src={
                                      selectedBooking?.classImage ||
                                      selectedBooking?.avatar
                                    }
                                    alt={selectedBooking.customerName}
                                    width={400}
                                    height={250}
                                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                                  />
                                </div>

                                <div className="flex-1">
                                  <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 space-y-4">
                                    {/* Info Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                                      <p>
                                        <strong className="text-gray-900">
                                          Invoice:
                                        </strong>{" "}
                                        <span className="text-gray-600">
                                          #
                                          {selectedBooking.invoice?.slice(-4) ||
                                            "N/A"}
                                        </span>
                                      </p>
                                      <p>
                                        <strong className="text-gray-900">
                                          Customer:
                                        </strong>{" "}
                                        <span className="text-gray-600">
                                          {selectedBooking.customerName ||
                                            "N/A"}
                                        </span>
                                      </p>
                                      <p className="sm:col-span-2">
                                        <strong className="text-gray-900">
                                          Email:
                                        </strong>{" "}
                                        <span className="text-gray-600">
                                          {selectedBooking.customerEmail ||
                                            "N/A"}
                                        </span>
                                      </p>
                                      <p>
                                        <strong className="text-gray-900">
                                          Price:
                                        </strong>{" "}
                                        <span className="font-semibold text-[#0694a2]">
                                          $
                                          {selectedBooking.price?.toLocaleString() ||
                                            "N/A"}
                                        </span>
                                      </p>
                                    </div>

                                    {/* Date Box */}
                              <div className="mt-5 bg-gradient-to-br from-[#e6f9fa] to-[#f9fdfd] border border-[#0694a2]/20 rounded-xl p-4 shadow-inner">
                                <h3 className="text-base font-semibold text-[#0694a2] mb-3 flex items-center gap-2">
                                  Course Date
                                </h3>
                                {scheduleDates && scheduleDates.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                      {scheduleDates.map((item, index) => (
                                        <div
                                          key={item._id || index}
                                          className="px-3 py-1.5 bg-white border border-[#0694a2]/30 rounded-lg text-sm text-gray-700 shadow-sm"
                                        >
                                          <div className="font-medium">
                                            {item.date
                                              ? new Date(item.date).toLocaleDateString("en-US", {
                                                  year: "numeric",
                                                  month: "short",
                                                  day: "numeric",
                                                })
                                              : "N/A"}
                                          </div>
                                          {item.type && (
                                            <div className="text-xs text-gray-500 mt-0.5">
                                              {item.type}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-gray-400 italic">
                                      No dates available
                                    </p>
                                  )}
                              </div>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border border-gray-100">
                                {/* Left Side */}
                                <div className="space-y-5">
                                  <h2 className="text-lg font-semibold text-[#0694a2] border-b pb-2">
                                    Course Information
                                  </h2>

                                  <div className="space-y-3 text-sm text-gray-700">
                                    <p>
                                      <strong className="text-gray-900">
                                        Class Description:
                                      </strong>{" "}
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html:
                                            selectedBooking?.description ||
                                            "N/A",
                                        }}
                                      />
                                    </p>

                                    <p>
                                      <strong className="text-gray-900">
                                        Duration:
                                      </strong>{" "}
                                      {selectedBooking.duration || "N/A"}
                                    </p>

                                    {/* Course Includes */}
                                    <div>
                                      <p className="font-semibold text-gray-900 mb-1">
                                        Course Includes:
                                      </p>
                                      <ul className="list-disc list-inside ml-4 text-gray-700 space-y-0.5">
                                        {selectedBooking.courseIncludes
                                          ?.length ? (
                                          selectedBooking.courseIncludes.map(
                                            (item, idx) => (
                                              <li key={idx}>{item}</li>
                                            )
                                          )
                                        ) : (
                                          <li>N/A</li>
                                        )}
                                      </ul>
                                    </div>

                                    {/* Documents */}
                                    <div>
                                      <p className="font-semibold text-gray-900 mb-1">
                                        Documents:
                                      </p>
                                      <div className="flex flex-col gap-1 ml-4">
                                        {selectedBooking.medicalDocuments
                                          ?.length ? (
                                          selectedBooking.medicalDocuments.map(
                                            (doc) => (
                                              <a
                                                key={doc._id}
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#0694a2] underline hover:text-[#047f8d] transition-colors"
                                              >
                                                {doc.public_id}
                                              </a>
                                            )
                                          )
                                        ) : (
                                          <span className="text-gray-500">
                                            N/A
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Right Side */}
                                <div className="space-y-5">
                                  <h2 className="text-lg font-semibold text-[#0694a2] border-b pb-2">
                                    Personal Information
                                  </h2>

                                  <div className="space-y-3 text-sm text-gray-700">
                                    <p>
                                      <strong className="text-gray-900">
                                        Gender:
                                      </strong>{" "}
                                      {selectedBooking.gender || "N/A"}
                                    </p>
                                    <p>
                                      <strong className="text-gray-900">
                                        Height:
                                      </strong>{" "}
                                      {selectedBooking.hight || "N/A"}
                                    </p>
                                    <p>
                                      <strong className="text-gray-900">
                                        Weight:
                                      </strong>{" "}
                                      {selectedBooking.weight || "N/A"}
                                    </p>
                                    <p>
                                      <strong className="text-gray-900">
                                        Shoe Size:
                                      </strong>{" "}
                                      {selectedBooking.shoeSize || "N/A"}
                                    </p>
                                    <p>
                                      <strong className="text-gray-900">
                                        Active:
                                      </strong>{" "}
                                      <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                          selectedBooking.isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                      >
                                        {selectedBooking.isActive
                                          ? "Yes"
                                          : "No"}
                                      </span>
                                    </p>
                                  </div>
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

                      {/* UPDATE THIS SECTION - Review Submenu */}
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          Sent Review Form
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem
                            onClick={() =>
                              handleQuickReview(
                                "https://stevenar77-website.vercel.app/rescue-diver",
                                booking.customerId._id || ""
                              )
                            }
                            disabled={handleQuickReviewMutation.isPending}
                          >
                            {handleQuickReviewMutation.isPending
                              ? "Sending..."
                              : "Rescue Diver"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleQuickReview(
                                "https://stevenar77-website.vercel.app/enrich-air",
                                booking.customerId._id || ""
                              )
                            }
                            disabled={handleQuickReviewMutation.isPending}
                          >
                            {handleQuickReviewMutation.isPending
                              ? "Sending..."
                              : "Enrich Air"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleQuickReview(
                                "https://stevenar77-website.vercel.app/quick-review",
                                booking.customerId._id || ""
                              )
                            }
                            disabled={handleQuickReviewMutation.isPending}
                          >
                            {handleQuickReviewMutation.isPending
                              ? "Sending..."
                              : "Quick Review"}
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>

                      {/* Reassign Courses */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            onClick={() => {
                              setReassignBooking(booking);
                              setNewCourseId(booking.classId || "");
                              setOpenSet(null);
                            }}
                            className="cursor-pointer"
                          >
                            <UserCog className="w-4 h-4" />
                            Reassign Courses
                          </DropdownMenuItem>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-6xl p-6 rounded-2xl shadow-xl bg-white border border-gray-200 max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-800">
                              Reassign Courses
                            </DialogTitle>
                          </DialogHeader>

                          {reassignBooking && (
                            <div className="mt-4 space-y-6">
                              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <p className="text-sm text-gray-600">
                                  <strong>Invoice:</strong> #
                                  {reassignBooking.invoice.slice(-4)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Customer:</strong>{" "}
                                  {reassignBooking.customerName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Email:</strong>{" "}
                                  {reassignBooking.customerEmail}
                                </p>
                                {/* <p className="text-sm text-gray-600">
                                  <strong>Current Schedule ID:</strong>{" "}
                                  {reassignBooking.scheduleId || "Not assigned"}
                                </p> */}
                              </div>

                              {/* Schedule Section */}
                              {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                  <Loader2 className="animate-spin text-teal-600 w-8 h-8" />
                                </div>
                              ) : course?.schedule ? (
                                <div className="mt-8 pt-8 border-t border-gray-200">
                                  <div className="flex items-center gap-2 mb-6">
                                    <Calendar className="w-5 h-5 text-teal-600" />
                                    <h3 className="text-xl font-semibold text-[#27303F]">
                                      Available Schedules
                                    </h3>
                                  </div>

                                  <div className="space-y-4">
                                    {course?.schedule.map(
                                      (
                                        scheduleSet: ScheduleSet,
                                        setIndex: number
                                      ) => {
                                        if (
                                          !scheduleSet?.sets ||
                                          scheduleSet?.sets?.length === 0
                                        )
                                          return null;
                                        const isOpen = openSet === setIndex;

                                        return (
                                          <div
                                            key={setIndex}
                                            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                                          >
                                            {/* Header */}
                                            <button
                                              onClick={() =>
                                                toggleSet(setIndex)
                                              }
                                              className="w-full px-6 py-5 hover:bg-gray-50 transition-colors"
                                            >
                                              <div className="items-start justify-between gap-1">
                                                <div className="flex gap-4">
                                                  <div className="flex-1 text-left">
                                                    <h4 className="text-[18px] font-semibold text-gray-900 mb-2">
                                                      {scheduleSet.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 leading-relaxed border rounded-md px-2 bg-blue-50 p-1">
                                                      {scheduleSet.description}
                                                    </p>
                                                  </div>

                                                  <div className="mt-10 border p-1 rounded-full cursor-pointer">
                                                    <ChevronDown
                                                      className={`w-5 h-5 text-gray-600 transition-transform duration-300 cursor-pointer ${
                                                        isOpen
                                                          ? "rotate-180"
                                                          : ""
                                                      }`}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="flex items-center justify-between gap-4 flex-shrink-0 mt-4">
                                                  {/* Left Side: Stats Grid */}
                                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
                                                    {/* Slots */}
                                                    <div className="flex flex-col items-center px-4 py-2 bg-teal-50 border border-teal-200 rounded-lg">
                                                      <div className="text-[18px] font-semibold text-teal-700">
                                                        {
                                                          scheduleSet.participents
                                                        }
                                                      </div>
                                                      <div className="text-xs text-gray-500 font-medium">
                                                        Total Available
                                                        Participents
                                                      </div>
                                                    </div>

                                                    {/* Participants */}
                                                    {/* <div className="flex flex-col items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                                                      <div className="text-[18px] font-semibold text-blue-700">
                                                        {scheduleSet.participents}
                                                      </div>
                                                      <div className="text-xs text-gray-500 font-medium">
                                                        Participants
                                                      </div>
                                                    </div> */}

                                                    {/* Total Participants */}
                                                    {/* <div className="flex flex-col items-center px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                                                      <div className="text-[18px] font-semibold text-purple-700">
                                                        {scheduleSet.totalParticipents}
                                                      </div>
                                                      <div className="text-xs text-gray-500 font-medium">
                                                        Total
                                                      </div>
                                                    </div> */}

                                                    {/* Schedule ID */}
                                                    {/* <div className="flex flex-col items-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                                                      <div className="text-[10px] font-mono text-gray-700 truncate max-w-full">
                                                        {scheduleSet._id.slice(-8)}
                                                      </div>
                                                      <div className="text-xs text-gray-500 font-medium">
                                                        ID
                                                      </div>
                                                    </div> */}
                                                  </div>

                                                  {/* Right Side: Booking Status */}
                                                  <div className="flex-shrink-0">
                                                    {reassignBooking?.scheduleId ===
                                                    scheduleSet._id ? (
                                                      <div className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md flex items-center gap-2 ">
                                                        <svg
                                                          className="w-5 h-5"
                                                          fill="none"
                                                          stroke="currentColor"
                                                          viewBox="0 0 24 24"
                                                        >
                                                          <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                          />
                                                        </svg>
                                                        <span className="font-semibold text-sm cursor-not-allowed">
                                                          Already Assigned
                                                        </span>
                                                      </div>
                                                    ) : (
                                                      <button
                                                        onClick={() =>
                                                          handleReassignCourse(
                                                            reassignBooking?.id ||
                                                              "",
                                                            scheduleSet._id
                                                          )
                                                        }
                                                        disabled={
                                                          reassignBookingMutation.isPending
                                                        }
                                                        className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg shadow-md hover:shadow-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center gap-2 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                      >
                                                        {reassignBookingMutation.isPending ? (
                                                          <>
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                            <span>
                                                              Assigning...
                                                            </span>
                                                          </>
                                                        ) : (
                                                          <>
                                                            <svg
                                                              className="w-5 h-5 cursor-pointer"
                                                              fill="none"
                                                              stroke="currentColor"
                                                              viewBox="0 0 24 24"
                                                            >
                                                              <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M12 4v16m8-8H4"
                                                              />
                                                            </svg>
                                                            <span className="cursor-pointer">
                                                              Assign Courses
                                                            </span>
                                                          </>
                                                        )}
                                                      </button>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </button>

                                            {/* Collapsible Content */}
                                            <div
                                              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                                                isOpen
                                                  ? "max-h-[2000px] opacity-100"
                                                  : "max-h-0 opacity-0"
                                              }`}
                                            >
                                              <div className="px-6 pb-6 space-y-3 bg-gray-50">
                                                {scheduleSet.sets.map(
                                                  (
                                                    scheduleItem: ScheduleDate,
                                                    itemIndex: number
                                                  ) => {
                                                    return (
                                                      <div
                                                        key={itemIndex}
                                                        className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-teal-300 transition-all duration-300"
                                                      >
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                          {/* Date */}
                                                          <div className="flex items-start gap-3">
                                                            <div className="w-11 h-11 bg-gradient-to-br from-teal-100 to-teal-50 rounded-xl flex items-center justify-center shadow-sm">
                                                              <Calendar className="w-5 h-5 text-teal-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                                                Date
                                                              </p>
                                                              <p className="text-sm font-bold text-gray-900">
                                                                {formatDate(
                                                                  scheduleItem.date
                                                                )}
                                                              </p>
                                                            </div>
                                                          </div>

                                                          {/* Location */}
                                                          <div className="flex items-start gap-3">
                                                            <div className="w-11 h-11 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center shadow-sm">
                                                              <MapPin className="w-5 h-5 text-orange-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                                                Location
                                                              </p>
                                                              <p className="text-sm font-bold text-gray-900">
                                                                {
                                                                  scheduleItem.location
                                                                }
                                                              </p>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  No schedules available
                                </div>
                              )}

                              <DialogClose asChild>
                                <button className="mt-6 w-full px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200 cursor-pointer">
                                  Close
                                </button>
                              </DialogClose>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>

                <td onClick={() => handleBookingDelete(booking.id)}>
                  <Trash className="hover:text-red-500 hover:cursor-pointer" />
                </td>
              </tr>
            ))}

            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 mt-4">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + itemsPerPage, bookings.length)} of{" "}
          {bookings.length} results
        </p>

        <div className="flex items-center gap-1">
          {/* Previous */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            &lt;
          </button>

          {/* Dynamic Page Numbers */}
          {(() => {
            const visiblePages: (number | string)[] = [];

            // If total pages <= 6, show all pages directly
            if (totalPages <= 6) {
              for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
            } else {
              // Always show first page
              visiblePages.push(1);

              // Show left ellipsis if currentPage > 3
              if (currentPage > 3) visiblePages.push("...");

              // Determine middle range
              const start = Math.max(2, currentPage - 1);
              const end = Math.min(totalPages - 1, currentPage + 1);

              for (let i = start; i <= end; i++) visiblePages.push(i);

              // Show right ellipsis if currentPage < totalPages - 2
              if (currentPage < totalPages - 2) visiblePages.push("...");

              // Always show last page
              visiblePages.push(totalPages);
            }

            return visiblePages.map((num, idx) =>
              num === "..." ? (
                <span key={idx} className="px-2 text-gray-400 select-none">
                  ...
                </span>
              ) : (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num as number)}
                  className={`px-3 py-1.5 text-sm rounded-md border transition ${
                    currentPage === num
                      ? "bg-[#0694A2] text-white border-[#0694A2] shadow-sm"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {num}
                </button>
              )
            );
          })()}

          {/* Next */}
          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingTable;
