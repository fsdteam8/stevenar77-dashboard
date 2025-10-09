"use client";
import StatCard from "@/components/Dashboard/StatCard/StatCard";
import React, { useEffect, useState } from "react";
import {
  BookmarkPlus,
  ChartLine,
  CircleDollarSign,
  Loader2,
  WavesLadder,
} from "lucide-react";
import DashChart from "@/components/Dashboard/Chart/DashChart";
import RecentTripTable from "@/components/Dashboard/Table/RecentTripTable";
import { useDashboard } from "@/hooks/useDashboard";
import { getDashboardChartData } from "@/lib/api";

export default function Dashboard() {
  const { data, error, isLoading } = useDashboard();

  // Chart data state
  const [, setChartData] = useState<unknown>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const year = new Date().getFullYear();
        const data = await getDashboardChartData(year);
        setChartData(data);
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
      } finally {
      }
    };
    fetchChartData();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
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
            numberInfo={data.data.totalPaidOrders}
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
