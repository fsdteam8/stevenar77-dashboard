"use client"

import { useState } from "react"
import { CalendarHeader } from "./calendar-header"
import { CalendarGrid } from "./calendar-grid"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"


interface Session {
  id: string
  title: string
  time: string
  price: string
  day: number
}

const sessions: Session[] = [
  { id: "1", title: "Open Water Diver", time: "09:00", price: "$423", day: 7 },
  { id: "2", title: "Open Water Diver", time: "09:00", price: "$423", day: 10 },
  { id: "3", title: "Open Water Diver", time: "09:00", price: "$423", day: 27 },
]

const months = [
  { name: "September 2025", days: 30, startDay: 0 }, // September 1, 2025 is a Monday (0 = Sunday offset)
  { name: "October 2025", days: 31, startDay: 3 },
  { name: "November 2025", days: 30, startDay: 6 },
  { name: "December 2025", days: 31, startDay: 1 },
]

export default function AvailableSessionsPage() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0)
  const [courseType, setCourseType] = useState("all")
  const [instructor, setInstructor] = useState("all")

  const currentMonth = months[currentMonthIndex]

  const handlePreviousMonth = () => {
    setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : months.length - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonthIndex((prev) => (prev < months.length - 1 ? prev + 1 : 0))
  }

  const filteredSessions = sessions.filter((session) => {
    if (courseType !== "all" && !session.title.toLowerCase().includes(courseType.replace("-", " "))) {
      return false
    }
    return true
  })

  return (
    <div className="">
      <div className=" flex justify-end mb-6 sm:mb-4">
        <div className=" ">
            <Button>
              <Plus /> Add Event 
            </Button>
          </div>
      </div>
      <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      

      {/* Filters */}
      {/* <CalendarFilters
        courseType={courseType}
        instructor={instructor}
        onCourseTypeChange={setCourseType}
        onInstructorChange={setInstructor}
      /> */}
      

      {/* Calendar Header */}
      <CalendarHeader
        currentMonth={currentMonth.name}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />

      {/* Calendar Grid */}
      <CalendarGrid sessions={filteredSessions} daysInMonth={currentMonth.days} startDay={currentMonth.startDay} />
    </div>
    </div>
  )
}
