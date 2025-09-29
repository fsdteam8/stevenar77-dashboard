"use client";

import { SessionCard } from "./session-card";

interface Session {
  id: string;
  title: string;
  time: string;
  price: string;
  day: number;
}

interface CalendarGridProps {
  sessions: Session[];
  daysInMonth: number;
  startDay: number;
}

export function CalendarGrid({
  sessions,
  daysInMonth,
  startDay,
}: CalendarGridProps) {
  const dayHeaders = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  console.log(sessions);

  // Generate calendar days with proper empty cells for month start
  const calendarCells = [];

  // Add empty cells for days before the month starts
  for (let i = 0; i < startDay; i++) {
    calendarCells.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  const getSessionForDay = (day: number | null) => {
    if (!day) return null;
    return sessions.find((session) => session.day === day);
  };

  return (
    <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
      {/* Day Headers */}
      {dayHeaders.map((day, index) => (
        <div
          key={index}
          className="bg-background p-2 sm:p-3 text-xs sm:text-sm font-medium text-muted-foreground text-center"
        >
          <span className="hidden sm:inline">{day}</span>
          <span className="sm:hidden">{day.slice(0, 3)}</span>
        </div>
      ))}

      {/* Calendar Days */}
      {calendarCells.map((day, index) => {
        const session = getSessionForDay(day);

        return (
          <div
            key={index}
            className="bg-background min-h-20 sm:min-h-28 lg:min-h-[248px] p-1 sm:p-2 relative"
          >
            {day && (
              <>
                <div className="text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2">
                  {day}
                </div>
                {session && <SessionCard {...session} />}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
