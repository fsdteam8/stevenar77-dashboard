"use client";
import React, { useState } from "react";
import { ArrowUpDown, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteAlertDialog from "../Card/DeleteCard"; // Make sure this path is correct

export type Trip = {
  id: string;
  invoice: string;
  destination: string;
  price: number;
  location: string;
  instructor: string;
  date: string;
};

const data: Trip[] = [
  {
    id: "1",
    invoice: "#3066",
    destination: "St Croix, Virgin Island",
    price: 250,
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    instructor: "Cristofer Curtis",
    date: "Jan 06, 2025",
  },
  {
    id: "2",
    invoice: "#3066",
    destination: "St Croix, Virgin Island",
    price: 250,
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    instructor: "Sarah Jonson's",
    date: "Jan 06, 2025",
  },
  {
    id: "3",
    invoice: "#3066",
    destination: "St Croix, Virgin Island",
    price: 250,
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    instructor: "Brandon Dorwart",
    date: "Jan 06, 2025",
  },
  {
    id: "4",
    invoice: "#3066",
    destination: "St Croix, Virgin Island",
    price: 250,
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    instructor: "Sarah Jonson's",
    date: "Jan 06, 2025",
  },
  {
    id: "5",
    invoice: "#3066",
    destination: "St Croix, Virgin Island",
    price: 250,
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    instructor: "Sarah Jonson's",
    date: "Jan 06, 2025",
  },
  {
    id: "6",
    invoice: "#3066",
    destination: "St Croix, Virgin Island",
    price: 250,
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    instructor: "Alfonso Calzoni",
    date: "Jan 06, 2025",
  },
  {
    id: "7",
    invoice: "#3066",
    destination: "St Croix, Virgin Island",
    price: 250,
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    instructor: "Sarah Jonson's",
    date: "Jan 06, 2025",
  },
  {
    id: "8",
    invoice: "#3066",
    destination: "St Croix, Virgin Island",
    price: 250,
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    instructor: "Sarah Jonson's",
    date: "Jan 06, 2025",
  },
  {
    id: "9",
    invoice: "#3066",
    destination: "St Croix, Virgin Island",
    price: 250,
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    instructor: "Sarah Jonson's",
    date: "Jan 06, 2025",
  },
  {
    id: "10",
    invoice: "#3066",
    destination: "St Croix, Virgin Island",
    price: 250,
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    instructor: "Sarah Jonson's",
    date: "Jan 06, 2025",
  },
  {
    id: "11",
    invoice: "#3066",
    destination: "St Croix, Virgin Island",
    price: 250,
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    instructor: "Sarah Jonson's",
    date: "Jan 06, 2025",
  },
  {
    id: "12",
    invoice: "#3066",
    destination: "St Croix, Virgin Island",
    price: 250,
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    instructor: "Sarah Jonson's",
    date: "Jan 06, 2025",
  },
];

const TripTable = () => {
  const [sortField, setSortField] = useState<keyof Trip | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: keyof Trip) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleView = (trip: Trip) => {
    console.log("View trip:", trip.id);
  };

  const handleDelete = (trip: Trip) => {
    console.log("Delete trip:", trip.id);
    // Add your actual delete logic here
    // Example: await deleteTrip(trip.id);
  };

  const sortedData = React.useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [sortField, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full bg-white">
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort("invoice")}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Invoice
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Trips
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Location
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Instructor
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
            {paginatedData.map((trip) => (
              <tr key={trip.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600">
                  {trip.invoice}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {trip.destination}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ${trip.price}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                  {trip.location}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {trip.instructor}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{trip.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleView(trip)}
                      className="p-1 text-teal-600 hover:text-teal-700 hover:bg-gray-200 bg-transparent rounded"
                      title="View trip"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <DeleteAlertDialog
                      trigger={
                        <Button
                          className="p-1 text-red-600 bg-transparent rounded hover:bg-gray-200 cursor-pointer"
                          title="Delete trip"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      }
                      title="Delete Trip"
                      itemName={trip.destination}
                      onConfirm={() => handleDelete(trip)}
                      actionText="Delete Trip"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No trips found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 py-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default TripTable;