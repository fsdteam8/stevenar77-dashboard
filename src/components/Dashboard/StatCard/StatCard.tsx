import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  numberInfo: string | number;
  icon: ReactNode;
  footerText: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  numberInfo,
  icon,
  footerText,
}) => {
  return (
    <Card className="p-5 w-[372px] rounded-xl shadow-sm">
      <CardContent className="p-0">
        {/* Title */}
        <h3 className="text-gray-700 font-semibold text-3xl mb-3">{title}</h3>

        {/* Number + Icon */}
        <div className="flex justify-between items-center">
          <div className="text-5xl font-bold text-primary">
            {numberInfo}
          </div>
          <div className="text-primary text-5xl [&>svg]:w-35 [&>svg]:h-35">{icon}</div>
        </div>

        {/* Footer */}
        <div className="flex items-center text-sm text-teal-600 mt-2">
          {footerText}
          <ArrowUpRight className="w-4 h-4 ml-1" />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
