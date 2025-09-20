"use client";
import React, { useState } from "react";
import { Eye, SquarePen, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteAlertDialog from "../Card/DeleteCard";
import { useTrips } from "@/hooks/useTrips";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteTrip } from "@/lib/api";
import { toast } from "sonner";
import TripsSkeleton from "../Trips/TripsSkeleton";
import Link from "next/link";

export type Trip = {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  maximumCapacity: number;
  startDate: string;
  endDate: string;
  images?: { url: string }[];
};

const TripTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const itemsPerPage = 4;

  const {
    data: tripsResponse,
    isLoading,
    isError,
    refetch,
  } = useTrips(currentPage, itemsPerPage);

  const trips: Trip[] = tripsResponse?.data || [];
  const totalItems = tripsResponse?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleView = (trip: Trip) => setSelectedTrip(trip);

  const handleDelete = async (trip: Trip) => {
    try {
      await deleteTrip(trip._id);
      toast.success("Trip deleted successfully!");
      refetch?.();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete trip. Please try again.");
    }
  };

  if (isLoading) return <TripsSkeleton />;
  if (isError)
    return (
      <p className="text-center py-6 text-red-500">Failed to load trips.</p>
    );

  return (
    <div className="w-full bg-white ">
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm ">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
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
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {trips.length > 0 ? (
              trips.map((trip) => (
                <tr
                  key={trip._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        {trip.images?.length ? (
                          <Image
                            src={trip.images[0].url}
                            alt={trip.title}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-green-200 flex items-center justify-center text-xs text-gray-600">
                            No Img
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {trip.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${trip.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    {trip.location}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleView(trip)}
                        className="p-1 text-teal-600 hover:text-teal-700 hover:bg-gray-200 bg-transparent rounded"
                        title="View trip"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Link href={`/trips/edit/${String(trip._id)}`}>
                        <Button
                          className="p-1 text-[#68706A] hover:bg-gray-200 bg-transparent rounded"
                          title="Edit trip"
                        >
                          <SquarePen className="w-4 h-4" />
                        </Button>
                      </Link>
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
                        itemName={trip.title}
                        onConfirm={() => handleDelete(trip)}
                        actionText="Delete Trip"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
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

      {/* Pagination UI */}

      <div className="flex items-center justify-between px-6 py-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Next
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={!!selectedTrip} onOpenChange={() => setSelectedTrip(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl">
          {selectedTrip && (
            <div className="flex flex-col">
              <div className="w-full h-64 relative">
                {selectedTrip.images?.length ? (
                  <Image
                    src={selectedTrip.images[0].url}
                    alt={selectedTrip.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    {selectedTrip.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex items-center text-sm text-gray-600 mt-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {selectedTrip.location}
                </div>
                <div
                  className="mt-4 text-gray-700 leading-relaxed italic prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedTrip.description }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TripTable;
