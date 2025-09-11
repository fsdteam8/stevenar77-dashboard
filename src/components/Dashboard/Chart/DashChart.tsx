"use client";

import React from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

// Define our data type
interface ChartData {
  month: string;
  current: number;
  previous: number;
}

const data: ChartData[] = [
  { month: "Jan", current: 60, previous: 50 },
  { month: "Feb", current: 100, previous: 80 },
  { month: "Mar", current: 90, previous: 120 },
  { month: "Apr", current: 80, previous: 110 },
  { month: "May", current: 150, previous: 100 },
  { month: "Jun", current: 140, previous: 130 },
  { month: "Jul", current: 130, previous: 120 },
  { month: "Aug", current: 170, previous: 110 },
  { month: "Sep", current: 190, previous: 140 },
  { month: "Oct", current: 120, previous: 130 },
  { month: "Nov", current: 100, previous: 90 },
  { month: "Dec", current: 110, previous: 80 },
];

// Define the payload structure Recharts gives us
interface CustomTooltipPayload {
  value: number;
  name: string;
  dataKey: string;
  payload: ChartData;
  color: string;
}

// Custom tooltip props interface that matches what Recharts actually passes
interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayload[];
  label?: string;
}

// ✅ Properly typed CustomTooltip
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length > 0) {
    const p = payload[0];

    return (
      <div className="bg-white shadow-md rounded-lg p-3 border text-sm">
        <p className="text-gray-500">This Month</p>
        <p className="text-xl font-bold text-gray-800">
          ${p.value.toLocaleString()}
        </p>
        <p className="text-gray-500">{label}</p>
      </div>
    );
  }
  return null;
};

const DashChart: React.FC = () => {
  return (
    <Card className="p-6 rounded-2xl h-[450px] shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-700">Total Earning</h2>
          <span className="text-gray-400 cursor-pointer">ℹ️</span>
        </div>
        <button className="flex items-center gap-2 text-sm text-gray-600 border rounded-md px-3 py-1">
          March, 2025 <Calendar className="w-4 h-4" />
        </button>
      </div>

      {/* Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="90%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {/* Previous line (gray) */}
            <Line type="monotone" dataKey="previous" stroke="#d1d5db" strokeWidth={2} dot={false} />
            {/* Current line with area */}
            <Area type="monotone" dataKey="current" stroke="#14b8a6" fillOpacity={1} fill="url(#colorCurrent)" />
            <Line type="monotone" dataKey="current" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4, fill: "#14b8a6" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default DashChart;