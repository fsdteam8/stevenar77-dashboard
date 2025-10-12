"use client";

import * as React from "react";
import { useAllCourses } from "@/hooks/course/useCourses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Toaster, toast } from "sonner";
import { Course } from "@/types/course";
import { singleUpdateCourse } from "@/lib/api";

// Extended Course type with schedule property
interface ScheduleDate {
  date: string;
  location: string;
  type: string;
  isActive: boolean;
}

interface Schedule {
  dates: ScheduleDate[];
}

interface ExtendedCourse extends Course {
  schedule?: Schedule[];
}

// --- Single Course Update Hook ---
export function useSingleUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      courseData,
    }: {
      id: string | number;
      courseData: FormData;
    }) => singleUpdateCourse(id, courseData),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses", id] });
    }, 

    onError: (error) => {
      console.error("Failed to update course:", error);
    },
  });
}

// --- ScheduleCalendar Component ---
export default function ScheduleCalendar() {
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  
  // New state for location/type input
  const [addingCourseId, setAddingCourseId] = React.useState<string | null>(null);
  const [location, setLocation] = React.useState("");
  const [type, setType] = React.useState("pool");

  const { data, isLoading, isError, refetch } = useAllCourses();
  const singleUpdateCourseMutation = useSingleUpdateCourse();

  console.log(data);

  // Wrapper to use mutation as async/await
  const updateSingleCourseAsync = async (id: string, formData: FormData) => {
    return new Promise<void>((resolve, reject) => {
      singleUpdateCourseMutation.mutate(
        { id, courseData: formData },
        {
          onSuccess: () => resolve(),
          onError: (err) => reject(err),
        }
      );
    });
  };

  const today = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const formatDateKey = (date: Date) => date.toISOString().split("T")[0];

  const schedules: Record<string, { title: string; price: number }[]> =
    React.useMemo(() => {
      if (!data?.data || !Array.isArray(data.data)) return {};
      const map: Record<string, { title: string; price: number }[]> = {};

      data.data.forEach((course: ExtendedCourse) => {
        // Check for new schedule structure
        if (Array.isArray(course.schedule)) {
          course.schedule.forEach((scheduleGroup) => {
            if (Array.isArray(scheduleGroup.dates)) {
              scheduleGroup.dates.forEach((dateObj) => {
                if (dateObj.date && dateObj.isActive !== false) {
                  const key = dateObj.date.split("T")[0];
                  if (!map[key]) map[key] = [];
                  map[key].push({
                    title: course.title,
                    price: course.price?.[0] ?? 0,
                  });
                }
              });
            }
          });
        }
        // Fallback to old classDates structure for backward compatibility
        else if (Array.isArray(course.classDates)) {
          course.classDates.forEach((dateStr: string) => {
            const key = dateStr.split("T")[0];
            if (!map[key]) map[key] = [];
            map[key].push({
              title: course.title,
              price: course.price?.[0] ?? 0,
            });
          });
        }
      });

      return map;
    }, [data]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(formatDateKey(date));
    setModalOpen(true);
    // Reset input states
    setAddingCourseId(null);
    setLocation("");
    setType("pool");
  };

  const generateCalendarDays = (month: Date) => {
    const startDay = new Date(
      month.getFullYear(),
      month.getMonth(),
      1
    ).getDay();
    const totalDays = new Date(
      month.getFullYear(),
      month.getMonth() + 1,
      0
    ).getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++)
      days.push(new Date(month.getFullYear(), month.getMonth(), i));
    return days;
  };

  const calendarDays = generateCalendarDays(currentMonth);

  const goPrevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  const goNextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-teal-50 shadow-inner">
          <Loader2 className="animate-spin text-[#06B6D4] w-8 h-8" />
        </div>
        <p className="mt-4 text-[#047481] font-medium text-sm animate-pulse tracking-wide">
          Loading courses, please wait...
        </p>
      </div>
    );

  if (isError) return <p className="text-red-500">Failed to load courses</p>;

  const handleAddDateToCourse = async (course: ExtendedCourse) => {
    if (!selectedDate) return;

    // Prevent adding past dates
    const todayStr = new Date().toISOString().split("T")[0];
    if (selectedDate < todayStr) {
      toast.warning("You cannot add a course to a past date.");
      return;
    }

    // Validate location and type
    if (!location.trim()) {
      toast.warning("⚠️ Please enter a location.");
      return;
    }

    if (!type.trim()) {
      toast.warning("⚠️ Please select a type.");
      return;
    }

    // Get existing schedule or initialize
    const existingSchedule: Schedule[] = Array.isArray(course.schedule) 
      ? course.schedule 
      : [{ dates: [] }];

    // Check if date already exists
    const dateExists = existingSchedule.some((scheduleGroup) =>
      Array.isArray(scheduleGroup.dates) &&
      scheduleGroup.dates.some((d) => d.date?.split("T")[0] === selectedDate)
    );

    if (dateExists) {
      toast.warning("⚠️ This date is already added.");
      return;
    }

    // Create new date object
    const newDateObj: ScheduleDate = {
      date: new Date(selectedDate + "T00:00:00.000Z").toISOString(),
      location: location.trim(),
      type: type.trim(),
      isActive: true,
    };

    // Add to existing schedule
    const updatedSchedule: Schedule[] = [...existingSchedule];
    if (updatedSchedule.length === 0) {
      updatedSchedule.push({ dates: [newDateObj] });
    } else {
      updatedSchedule[0].dates = [...(updatedSchedule[0].dates || []), newDateObj];
    }

    const formData = new FormData();
    formData.append("schedule", JSON.stringify(updatedSchedule));

    try {
      setIsUpdating(true);
      await updateSingleCourseAsync(course._id, formData);
      toast.success("✅ Date added successfully!");
      setAddingCourseId(null);
      setLocation("");
      setType("pool");
      refetch();
    } catch {
      toast.error("❌ Failed to add date.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveDateFromCourse = async (course: ExtendedCourse) => { 
    if (!selectedDate) return;

    const existingSchedule: Schedule[] = Array.isArray(course.schedule) 
      ? course.schedule 
      : [{ dates: [] }];

    // Check if date exists
    const dateExists = existingSchedule.some((scheduleGroup) =>
      Array.isArray(scheduleGroup.dates) &&
      scheduleGroup.dates.some((d) => d.date?.split("T")[0] === selectedDate)
    );

    if (!dateExists) {
      toast.warning("⚠️ This date is not in the course.");
      return;
    }

    // Remove the date from schedule
    const updatedSchedule: Schedule[] = existingSchedule.map((scheduleGroup) => ({
      ...scheduleGroup,
      dates: (scheduleGroup.dates || []).filter(
        (d) => d.date?.split("T")[0] !== selectedDate
      ),
    }));

    const formData = new FormData();
    formData.append("schedule", JSON.stringify(updatedSchedule));

    try {
      setIsUpdating(true);
      await updateSingleCourseAsync(course._id, formData);
      toast.success("✅ Date removed successfully!");
      refetch();
    } catch {
      toast.error("❌ Failed to remove date.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStartAdding = (courseId: string) => {
    setAddingCourseId(courseId);
    setLocation("");
    setType("pool");
  };

  const handleCancelAdding = () => {
    setAddingCourseId(null);
    setLocation("");
    setType("pool");
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" richColors />

      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Schedule Courses
      </h2>

      {/* Calendar Header */}
      <div className="flex items-center justify-between w-full max-w-8xl mb-4 rounded-xl shadow px-4 py-2 ">
        <button
          onClick={goPrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700 cursor-pointer" />
        </button>
        <h3 className="font-semibold text-lg text-gray-700">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <button
          onClick={goNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="w-5 h-5 text-gray-700 cursor-pointer" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 w-full max-w-8xl border rounded-t-xl bg-gray-100 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-center font-semibold py-2 border-r last:border-r-0 border-gray-300 text-gray-600"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 w-full max-w-8xl">
        {calendarDays.map((date, idx) => {
          if (!date)
            return (
              <div key={idx} className="h-36 border rounded-lg bg-gray-50" />
            );

          const key = formatDateKey(date);
          const courses = schedules[key] || [];

          return (
            <div
              key={idx}
              onClick={() => handleDateClick(date)}
              className="flex flex-col p-3 border rounded-xl cursor-pointer transition-all duration-200 min-h-36 bg-white hover:shadow-lg"
            >
              <span className="font-semibold mb-2 text-gray-700">
                {date.getDate()}
              </span>
              {courses.slice(0, 2).map((course, i) => (
                <div
                  key={i}
                  className="mb-1 px-2 py-1 rounded-md text-white text-xs truncate bg-[#0694A2]"
                >
                  {course.title} — ${course.price}
                </div>
              ))}
              {courses.length > 2 && (
                <span className="text-gray-500 text-xs mt-1">
                  +{courses.length - 2} more…
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Manage Courses — {selectedDate}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 grid gap-4 max-h-[500px] overflow-y-auto">
            {data?.data.map((course: ExtendedCourse, i: number) => {
              const existingSchedule: Schedule[] = Array.isArray(course.schedule)
                ? course.schedule
                : [];
              
              const alreadyHas = existingSchedule.some((scheduleGroup) =>
                Array.isArray(scheduleGroup.dates) &&
                scheduleGroup.dates.some(
                  (d) => d.date?.split("T")[0] === selectedDate
                )
              );

              const isAddingThis = addingCourseId === course._id;

              return (
                <div
                  key={i}
                  className="flex flex-col gap-3 p-3 bg-white rounded-xl shadow hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden relative bg-gray-100">
                      <Image
                        src={course.image?.url || "/placeholder.png"}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm md:text-base truncate">
                        {course.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Price: ${course.price?.[0] ?? 0}
                      </p>
                    </div>
                  </div>

                  {/* Add Date Form */}
                  {isAddingThis && (
                    <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g., Main Pool"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0694A2]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0694A2]"
                        >
                          <option value="pool">Pool</option>
                          <option value="islands">islands</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddDateToCourse(course)}
                          disabled={isUpdating}
                          className="flex-1 text-sm px-3 py-2 rounded-md bg-[#0694A2] text-white hover:opacity-90 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
                        >
                          {isUpdating ? "Adding..." : "Confirm Add"}
                        </button>
                        <button
                          onClick={handleCancelAdding}
                          disabled={isUpdating}
                          className="flex-1 text-sm px-3 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {!isAddingThis && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartAdding(course._id)}
                        disabled={!selectedDate || alreadyHas || isUpdating}
                        className={`text-sm px-3 py-2 rounded-md flex-1 ${
                          !selectedDate || alreadyHas || isUpdating
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-[#0694A2] text-white hover:opacity-90 cursor-pointer"
                        }`}
                      >
                        {alreadyHas ? "Already Added" : "Add Date"}
                      </button>
                      <button
                        onClick={() => handleRemoveDateFromCourse(course)}
                        disabled={!selectedDate || !alreadyHas || isUpdating}
                        className={`text-sm px-3 py-2 rounded-md flex-1 ${
                          !selectedDate || !alreadyHas || isUpdating
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-red-600 text-white hover:opacity-90 cursor-pointer"
                        }`}
                      >
                        Remove Date
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}