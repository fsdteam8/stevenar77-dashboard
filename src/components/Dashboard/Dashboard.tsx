"use client";
import StatCard from "@/components/Dashboard/StatCard/StatCard";
import React from "react";
import {
  BookmarkPlus,
  ChartLine,
  CircleDollarSign,
  WavesLadder,
} from "lucide-react";
import DashChart from "@/components/Dashboard/Chart/DashChart";
import RecentTripTable from "@/components/Dashboard/Table/RecentTripTable";
import { useDashboard } from "@/hooks/useDashboard";

export default function Dashboard() {
  const { data, error, isLoading } = useDashboard();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="p-5">
      <div className="space-y-8">
        <div className="stat-cards flex gap-4">
          <StatCard
            title="Bookings"
            numberInfo={data.data.totalBookings}
            icon={<WavesLadder />}
          />
          <StatCard
            title="Popular Course"
            numberInfo={data.data.popularCoursesCount}
            icon={<ChartLine />}
          />
          <StatCard
            title="Revenue"
            numberInfo={data.data.totalRevenue}
            icon={<CircleDollarSign />}
          />
          <StatCard
            title="Product Sales"
            numberInfo={202}
            icon={<BookmarkPlus />}
          />
        </div>
        <div className="dashcharts  gap-4 ">
          <div className="col-span-8">
            <DashChart />
          </div>
        </div>
        <div className="table-data space-y-8">
          {/* Recent Trips data table */}
          <h2 className="text-xl text-[#343A40] mx-auto">Recants Trips</h2>
          <RecentTripTable />
        </div>
      </div>
    </div>
  );
}
