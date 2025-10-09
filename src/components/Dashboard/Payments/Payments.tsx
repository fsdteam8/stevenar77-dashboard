"use client";
import React, { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";
import PaymentsTrip from "../Table/PaymentsTrip";
import PaymentsCourse from "../Table/PaymentsCourse";

export default function Payments() {
  // const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"trip" | "course">("trip");

  return (
    <div>
      <div className="mb-6">
        {/* Search and Tabs */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          {/* <div className="relative flex-1 max-w-65">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div> */}

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "trip"
                  ? "bg-[#0694A2] text-white cursor-pointer"
                  : "bg-gray-200 text-gray-700 cursor-pointer"
              }`}
              onClick={() => setActiveTab("trip")}
            >
              Trip
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "course"
                  ? "bg-[#0694A2] text-white cursor-pointer"
                  : "bg-gray-200 text-gray-700 cursor-pointer"
              }`}
              onClick={() => setActiveTab("course")}
            >
              Course
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div>
        {activeTab === "trip" && <PaymentsTrip />}
        {activeTab === "course" && <PaymentsCourse />}
      </div>
    </div>
  );
}
