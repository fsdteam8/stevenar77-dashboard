"use client";

import { useEffect, useState } from "react";
import { CalendarHeader } from "./calendar-header";
import { CalendarGrid } from "./calendar-grid";
import { Button } from "@/components/ui/button";
import { Session } from "@/types/class";
import { useAllClassBookings } from "@/hooks/useAllClassData";
import { transformBookingsToSessions } from "@/lib/api";

const months = [
  { name: "September 2025", days: 30, startDay: 0, month: 8, year: 2025 },  
  { name: "October 2025", days: 31, startDay: 3, month: 9, year: 2025 },
  { name: "November 2025", days: 30, startDay: 6, month: 10, year: 2025 },
  { name: "December 2025", days: 31, startDay: 1, month: 11, year: 2025 },
];

export default function AvailableSessionsPage() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [courseType] = useState("all");
  const [sessions, setSessions] = useState<Session[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  const currentMonth = months[currentMonthIndex];

  const { data: bookings, isLoading, isError } = useAllClassBookings();
  // const transformedSessions = transformBookingsToSessions(bookings);

  // console.log(transformedSessions);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const transformedSessions = transformBookingsToSessions(bookings);
        setSessions(transformedSessions);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error loading bookings:", err.message);
        } else {
          console.error("Unexpected error:", err);
        }
      }
    };

    loadBookings();
  }, [bookings]);

  const handlePreviousMonth = () => {
    setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : months.length - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prev) => (prev < months.length - 1 ? prev + 1 : 0));
  };

  const filteredSessions = sessions.filter((session) => {
    // Filter by current month and year
    if (
      session.month !== currentMonth.month ||
      session.year !== currentMonth.year
    ) {
      return false;
    }

    // Filter by course type if not "all"
    if (
      courseType !== "all" &&
      !session.title.toLowerCase().includes(courseType.replace("-", " "))
    ) {
      return false;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Something was wrong, Plese try again!
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* <div className="flex justify-end mb-6 sm:mb-4">
        <div className="">
          <Button>
            <Plus /> Add Event
          </Button>
        </div>
      </div> */}
      <div className="p-3 sm:p-4 lg:p-6  mx-auto">
        {/* Calendar Header */}
        <CalendarHeader
          currentMonth={currentMonth.name}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />

        {/* Calendar Grid */}
        <CalendarGrid
          sessions={filteredSessions}
          daysInMonth={currentMonth.days}
          startDay={currentMonth.startDay}
        />
      </div>
    </div>
  );
}
