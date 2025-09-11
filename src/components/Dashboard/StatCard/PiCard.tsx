"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PaymentData {
  name: string;
  value: number;
  color: string;
}

const data: PaymentData[] = [
  { name: "PayPal", value: 1200, color: "#9333EA" }, // purple
  { name: "Credit Card", value: 3363, color: "#22C55E" }, // green
];

const totalBalance = data.reduce((sum, entry) => sum + entry.value, 0);

const PiCard: React.FC = () => {
  return (
    <Card className="p-6 h-[450px] rounded-2xl shadow-sm text-center">
      {/* Header */}
      <h2 className="text-gray-700 font-medium mb-6 text-left">
        Payment Methods
      </h2>

      {/* Donut Chart */}
      <div className="flex justify-center items-center mb-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute text-center">
          <p className="text-lg font-semibold">${totalBalance.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Balance</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mb-6">
        {data.map((entry, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 px-3 py-1 border rounded-md ${
              entry.name === "PayPal"
                ? "border-purple-500 text-purple-600"
                : "border-green-500 text-green-600"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="text-sm">{entry.name}</span>
          </div>
        ))}
      </div>

      {/* Button */}
      <Button
        variant="outline"
        className="w-full rounded-lg font-medium py-2"
      >
        View Detailed Breakdown
      </Button>
    </Card>
  );
};

export default PiCard;
