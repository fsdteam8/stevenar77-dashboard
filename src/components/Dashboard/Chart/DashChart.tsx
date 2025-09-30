"use client";

import React, { useEffect, useState } from "react";
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
import { getDashboardChartData } from "@/lib/api";

interface ApiChartData {
  month: string;
  revenue: number;
}

interface ChartData {
  month: string;
  current: number;
  previous: number;
}

interface CustomTooltipPayload {
  value: number;
  name: string;
  dataKey: string;
  payload: ChartData;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayload[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    const p = payload[0];
    return (
      <div className="bg-white shadow-md rounded-lg p-3 border text-sm">
        <p className="text-gray-500">Revenue</p>
        <p className="text-xl font-bold text-gray-800">${p.value.toLocaleString()}</p>
        <p className="text-gray-500">{label}</p>
      </div>
    );
  }
  return null;
};

const DashChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const year = new Date().getFullYear();  
        const res = await getDashboardChartData(year);
        if (res?.data) {
          // Map API response to chart data
          const mapped: ChartData[] = res.data.map((item: ApiChartData, index: number) => ({
            month: item.month,
            current: item.revenue,
            previous: index > 0 ? res.data[index - 1].revenue : 0,  
          }));
          setChartData(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChart();
  }, []);

  if (loading) return <p>Loading chart...</p>;

  return (
    <Card className="p-6 rounded-2xl h-[450px] shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
          <span className="text-gray-400 cursor-pointer">ℹ️</span>
        </div>
        <button className="flex items-center gap-2 text-sm text-gray-600 border rounded-md px-3 py-1">
          {new Date().toLocaleString("default", { month: "long" })}, {new Date().getFullYear()} <Calendar className="w-4 h-4" />
        </button>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
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
            <Line type="monotone" dataKey="previous" stroke="#d1d5db" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="current" stroke="#14b8a6" fillOpacity={1} fill="url(#colorCurrent)" />
            <Line type="monotone" dataKey="current" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4, fill: "#14b8a6" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default DashChart;
