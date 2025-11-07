"use client";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  if (totalPages <= 1) return null; // if only 1 page, hide pagination

  return (
    <>
      <div className="flex items-center justify-between  px-6 py-4 border-t border-gray-200 mt-4">
        {/* Info */}
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}{" "}
          results
        </p>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-1">
          {/* Previous */}
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
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
                  onClick={() => onPageChange(num as number)}
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
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            &gt;
          </button>
        </div>
      </div>
    </>
  );
}
