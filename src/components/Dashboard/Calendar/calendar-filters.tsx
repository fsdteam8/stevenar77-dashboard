"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CalendarFiltersProps {
  courseType: string
  instructor: string
  onCourseTypeChange: (value: string) => void
  onInstructorChange: (value: string) => void
}

export function CalendarFilters({
  courseType,
  instructor,
  onCourseTypeChange,
  onInstructorChange,
}: CalendarFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <span className="text-sm text-muted-foreground font-medium">Filters:</span>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={courseType} onValueChange={onCourseTypeChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Courses Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses Type</SelectItem>
              <SelectItem value="open-water">Open Water Diver</SelectItem>
              <SelectItem value="advanced">Advanced Open Water</SelectItem>
              <SelectItem value="rescue">Rescue Diver</SelectItem>
            </SelectContent>
          </Select>

          <Select value={instructor} onValueChange={onInstructorChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Instructor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Instructor</SelectItem>
              <SelectItem value="john">John Smith</SelectItem>
              <SelectItem value="jane">Jane Doe</SelectItem>
              <SelectItem value="mike">Mike Johnson</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
