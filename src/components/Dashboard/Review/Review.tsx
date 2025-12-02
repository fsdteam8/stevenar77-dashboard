"use client";

import React, { useState } from "react";
import { useReview, useDeleteReview } from "@/hooks/useReview";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { format } from "date-fns";

// Types
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  image?: { url: string };
}

interface Class {
  _id: string;
  title: string;
  image?: { url: string };
}

interface ReviewItem {
  _id: string;
  userId: User;
  classId: Class;
  purchaseDate: string;
  comment: string;
  star: number;
  createdAt: string;
}

interface ReviewData {
  reviews: ReviewItem[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export default function Review() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, error } = useReview(currentPage, itemsPerPage);
  const deleteMutation = useDeleteReview();

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50">
          <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
        </div>
        <p className="mt-4 text-gray-600 text-lg font-medium">
          Loading Reviews...
        </p>
      </div>
    );

  if (error) return <div>Error fetching reviews</div>;

  const handleDelete = (review: ReviewItem) => {
    deleteMutation.mutate(
      { bookingId: review._id, token: "" },
      {
        onSuccess: () => {
          toast.success(
            `Review by ${review.userId.firstName} deleted successfully`
          );
        },
        onError: () => {
          toast.error(`Failed to delete review by ${review.userId.firstName}`);
        },
      }
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const reviews = (data?.data as ReviewData)?.reviews || [];
  const totalReviews = (data?.data as ReviewData)?.meta.total || 0;
  const totalPages = (data?.data as ReviewData)?.meta.totalPages || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Class Reviews</h1>
      <Table className="border rounded-lg overflow-hidden">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Class Title</TableHead>
            <TableHead>Review Comment</TableHead>
            <TableHead>Course Purchased Dates</TableHead>
            <TableHead>Star</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review?._id} className="hover:bg-gray-50 transition">
              <TableCell>{formatDate(review?.createdAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {review?.userId?.image?.url && (
                    <Image
                      src={review?.userId?.image.url}
                      alt={review?.userId?.firstName}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  )}
                  <span>
                    {review?.userId?.firstName} {review?.userId?.lastName}
                  </span>
                </div>
              </TableCell>
              <TableCell>{review?.classId?.title}</TableCell>
              <TableCell className="max-w-xs truncate">
                {review?.comment}
              </TableCell>
              <TableCell>
                {(() => {
                  const date = new Date(review?.purchaseDate);
                  return isNaN(date.getTime())
                    ? "—"
                    : format(date, "MMMM yyyy");
                })()}
              </TableCell>
              <TableCell>{review?.star} ⭐</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(review)}
                  className="flex items-center gap-1 cursor-pointer"
                  //   disabled={deleteMutation?.isLoading}
                >
                  <Trash className="w-4 h-4" /> Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 mt-4">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + itemsPerPage, totalReviews)} of {totalReviews}{" "}
          results
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

            if (totalPages <= 6) {
              for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
            } else {
              visiblePages.push(1);
              if (currentPage > 3) visiblePages.push("...");
              const start = Math.max(2, currentPage - 1);
              const end = Math.min(totalPages - 1, currentPage + 1);
              for (let i = start; i <= end; i++) visiblePages.push(i);
              if (currentPage < totalPages - 2) visiblePages.push("...");
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
}
