import StatCard from "@/components/Dashboard/StatCard/StatCard";
import React from "react";
import { ChartLine, Ship, ShoppingCart, WavesLadder } from "lucide-react";
import DashChart from "@/components/Dashboard/Chart/DashChart";
import PiCard from "@/components/Dashboard/StatCard/PiCard";
import RecentTripTable from "@/components/Dashboard/Table/RecentTripTable";

const page = () => {
  return (
    <div className="p-5">
      <div className="space-y-8">
        <div className="stat-cards flex gap-4">
          <StatCard
            title="Upcoming Course"
            numberInfo={12}
            icon={<WavesLadder />}
            footerText="+ 36% from the last month"
          />
          <StatCard
            title="Total Course Sales"
            numberInfo={123}
            icon={<ChartLine />}
            footerText="+ 36% from the last month"
          />
          <StatCard
            title="Total Shop"
            numberInfo={200}
            icon={<ShoppingCart />}
            footerText="+ 36% from the last month"
          />
          <StatCard
            title="Total Trips"
            numberInfo={202}
            icon={<Ship />}
            footerText="+ 36% from the last month"
          />
        </div>
        <div className="dashcharts grid grid-cols-12 gap-4 ">
          <div className="col-span-8">
            <DashChart />
          </div>
          <div className="col-span-4">
            {/* pi-chart goes here */}
            <PiCard />
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
};

export default page;
