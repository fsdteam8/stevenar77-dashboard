"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CalendarHeaderProps {
  currentMonth: string
  onPreviousMonth: () => void
  onNextMonth: () => void
}

export function CalendarHeader({ currentMonth, onPreviousMonth, onNextMonth }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl font-medium text-foreground">{currentMonth}</h2>
      <div className="flex gap-1 sm:gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPreviousMonth}
          className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onNextMonth}
          className="h-8 w-8 sm:h-9 sm:w-9 bg-teal-600 hover:bg-teal-700 border-teal-600 text-white"
        >
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  )
}
