"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTrips } from "@/hooks/useTrips";

export type Trip = {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  maximumCapacity: number;
  startDate: string;
  endDate: string;
  images?: { url: string }[];
};

const RecentTripTable: React.FC = () => {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Define pagination variables (even if we only show 4 trips)
  const itemsToShow = 4;

  const { data: tripsResponse, isLoading, isError } = useTrips(1, itemsToShow);

  // Correctly extract trips array
  const trips: Trip[] = tripsResponse?.data?.data || [];
  const displayedTrips = trips.slice(0, itemsToShow);

  const handleView = (trip: Trip) => {
    setSelectedTrip(trip);
  };

  if (isLoading) return <p>Loading trips...</p>;
  if (isError) return <p>Error fetching trips.</p>;

  return (
    <div className="w-full bg-white">
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Location
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                End Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {displayedTrips.map((trip) => (
              <tr key={trip._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {trip.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {trip.location}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(trip.startDate).toDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(trip.endDate).toDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleView(trip)}
                      className="p-1 text-primary bg-transparent rounded hover:bg-gray-200 cursor-pointer"
                      title="View trip"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {displayedTrips.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No trips found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Dialog open={!!selectedTrip} onOpenChange={() => setSelectedTrip(null)}>
        <DialogContent className="!max-w-3xl h-[800px] p-0 overflow-y-auto rounded-2xl">
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
                {/* <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line italic">
                  {selectedTrip.description}
                </p> */}
                <p
                  className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line italic"
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

export default RecentTripTable;
