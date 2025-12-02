"use client";
import React, { useState, useMemo } from "react";
import { Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAllAdminTrips } from "@/hooks/useAlladminTrips";
import { Participant, TripBooking } from "@/types/BookingTableType";

const ITEMS_PER_PAGE = 8;

const TripBookingTable = () => {
  // const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAllAdminTrips(page, ITEMS_PER_PAGE);

  const items = useMemo(() => data?.data || [], [data]);
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  console.log(items);
  const paginatedItems = useMemo((): TripBooking[] => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [page, items]);

  // const isAllSelected =
  //   paginatedItems.length > 0 &&
  //   paginatedItems.every((item) => selected.includes(item._id));

  // const toggleSelect = (id: string) => {
  //   setSelected((prev) =>
  //     prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  //   );
  // };

  // const toggleSelectAll = () => {
  //   if (isAllSelected) {
  //     const visibleIds = paginatedItems.map((i) => i._id);
  //     setSelected((prev) => prev.filter((id) => !visibleIds.includes(id)));
  //   } else {
  //     const visibleIds = paginatedItems.map((i) => i._id);
  //     setSelected((prev) => [...new Set([...prev, ...visibleIds])]);
  //   }
  // };

  // const handleDelete = () => {
  //   // Optional: Implement delete API call
  //   setSelected([]);
  // };

  if (isLoading) {
    return <p className="text-center py-10">Loading trips...</p>;
  }

  if (isError) {
    return (
      <p className="text-center py-10 text-red-500">Error loading trips!</p>
    );
  }

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">Trip Booking Table</h2>

      {/* Bulk Actions */}
      {/* <div className="flex items-center justify-between py-3">
        <p className="text-sm text-gray-600">{selected.length} selected</p>
        {selected.length > 0 && (
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected ({selected.length})
          </Button>
        )}
      </div> */}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {/* <th className="px-4 py-3">
                <div
                  className="inline-flex items-center justify-center p-2 -ml-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelectAll();
                  }}
                >
                  <Checkbox
                    checked={isAllSelected}
                    className="pointer-events-none"
                  />
                </div>
              </th> */}
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                ID No
              </th>
              {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Date
              </th> */}
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Trips Name
              </th>
              {/*<th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Mobile
              </th> */}
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                Total Price
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item) => {
                const participant = item.participants[0]; // first participant
                return (
                  <tr key={item._id} className="hover:bg-gray-50">
                    {/* <td className="px-4 py-3">
                      <div
                        className="inline-flex items-center justify-center p-2 -ml-2 rounded-md hover:bg-gray-100 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelect(item._id);
                        }}
                      >
                        <Checkbox
                          checked={selected.includes(item._id)}
                          className="pointer-events-none"
                        />
                      </div>
                    </td> */}
                    <td className="px-4 py-3 text-sm">
                      <p>ID-#{item._id.slice(-4)}</p>
                    </td>
                    {/* <td className="px-4 py-3 text-sm"> */}
                      {/* created_at date */}
                      {/* <p>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p> */}
                    {/* </td> */}
                    <td className="px-4 py-3 text-sm">
                      <p className="mb-2 text-sm font-semibold ">
                        <span className="mr-2"> Name: </span>{" "}
                        {`${participant.firstName} ${participant.lastName}`}
                      </p>
                      <p className="mb-2 text-sm font-semibold ">
                        <span className="mr-2"> Email: </span>{" "}
                        {participant.email}
                      </p>
                      <p className="mb-2 text-sm font-semibold ">
                        <span className="mr-2"> Mobile: </span>{" "}
                        {participant.mobile}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <p className="mb-2 text-sm font-semibold ">
                        {item?.trip?.title}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium">
                      ${item.totalPrice}
                    </td>
                    <td className="px-4 py-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>All Participants</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4 space-y-4">
                            {item.participants &&
                            item.participants.length > 0 ? (
                              item.participants.map(
                                (p: Participant, index: number) => (
                                  <div
                                    key={index}
                                    className="p-4 border rounded-lg bg-gray-50 space-y-2"
                                  >
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <span className="text-sm font-medium text-gray-500">
                                          Name
                                        </span>
                                        <p className="font-medium">
                                          {p.firstName} {p.lastName}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium text-gray-500">
                                          Email
                                        </span>
                                        <p className="text-sm">{p.email}</p>
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium text-gray-500">
                                          Mobile
                                        </span>
                                        <p className="text-sm">
                                          {p.mobile || "N/A"}
                                        </p>
                                      </div>
                                      {/* Add more fields if needed based on data structure */}
                                    </div>
                                  </div>
                                )
                              )
                            ) : (
                              <p className="text-center text-gray-500">
                                No participants found.
                              </p>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No trips found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
        >
          Prev
        </button>

        <span className="text-sm text-gray-600">
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TripBookingTable;
