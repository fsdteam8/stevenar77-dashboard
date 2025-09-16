import React from "react";

export default function TripCreateFormSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="mx-auto container">
        <div className="p-6">
          {/* Back Button Placeholder */}
          <div className="my-4 h-10 w-32 bg-gray-300 rounded-md"></div>

          {/* Heading Placeholder */}
          <div className="h-8 w-64 bg-gray-300 rounded mb-8"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="h-10 w-full bg-gray-300 rounded"></div>

              {/* Description */}
              <div className="h-24 w-full bg-gray-300 rounded"></div>

              {/* Price & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-10 w-full bg-gray-300 rounded"></div>
                <div className="h-10 w-full bg-gray-300 rounded"></div>
              </div>

              {/* Maximum Capacity */}
              <div className="h-10 w-full bg-gray-300 rounded"></div>

              {/* Start & End Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-10 w-full bg-gray-300 rounded"></div>
                <div className="h-10 w-full bg-gray-300 rounded"></div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="lg:col-span-1 space-y-4">
              <div className="h-48 w-full bg-gray-300 rounded-lg"></div>

              {/* Buttons */}
              <div className="flex justify-end w-full gap-6 mt-6 px-2">
                <div className="h-10 w-1/2 bg-gray-300 rounded"></div>
                <div className="h-10 w-1/2 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
