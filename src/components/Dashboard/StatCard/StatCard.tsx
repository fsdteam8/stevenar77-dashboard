import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
 

interface StatCardProps {
  title: string;
  numberInfo: string | number;
  icon: ReactNode;
 
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  numberInfo,
  icon,
 
}) => {
  return (
    <Card className="p-5 w-[372px] rounded-xl shadow-sm">
      <CardContent className="p-0">
        {/* Title */}
        <h3 className="text-[#343A40] font-semibold text-2xl mb-3">{title}</h3>

        {/* Number + Icon */}
        <div className="flex justify-between items-center">
          <div className="text-5xl font-bold text-[#10421B]">
            {numberInfo}
          </div>
          <div className="text-primary text-3xl [&>svg]:w-26 [&>svg]:h-24">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
