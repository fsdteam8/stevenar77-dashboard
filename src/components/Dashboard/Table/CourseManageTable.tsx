"use client";
import React, { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Course = {
  id: string;
  name: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  instructor: string;
  date: string;
};

const data: Course[] = [
  {
    id: "1",
    name: "Open Water Dive",
    duration: "4 days",
    level: "Intermediate",
    price: 250,
    instructor: "Cristofer Curtis",
    date: "Jan 06, 2025",
  },
  {
    id: "2",
    name: "Open Water Dive",
    duration: "4 days",
    level: "Beginner",
    price: 250,
    instructor: "Sarah Jonson's",
    date: "Jan 06, 2025",
  },
  {
    id: "3",
    name: "Open Water Dive",
    duration: "4 days",
    level: "Intermediate",
    price: 250,
    instructor: "Brandon Dorwart",
    date: "Jan 06, 2025",
  },
  {
    id: "4",
    name: "Open Water Dive",
    duration: "4 days",
    level: "Advanced",
    price: 250,
    instructor: "Sarah Jonson's",
    date: "Jan 06, 2025",
  },
  {
    id: "5",
    name: "Open Water Dive",
    duration: "4 days",
    level: "Beginner",
    price: 250,
    instructor: "Sarah Jonson's",
    date: "Jan 06, 2025",
  },
  {
    id: "6",
    name: "Open Water Dive",
    duration: "4 days",
    level: "Intermediate",
    price: 250,
    instructor: "Alfonso Calzoni",
    date: "Jan 06, 2025",
  },
  {
    id: "7",
    name: "Open Water Dive",
    duration: "4 days",
    level: "Advanced",
    price: 250,
    instructor: "Sarah Jonson's",
    date: "Jan 06, 2025",
  },
  {
    id: "8",
    name: "Open Water Dive",
    duration: "4 days",
    level: "Beginner",
    price: 250,
    instructor: "Sarah Jonson's",
    date: "Jan 06, 2025",
  },
  {
    id: "9",
    name: "Open Water Dive",
    duration: "4 days",
    level: "Advanced",
    price: 250,
    instructor: "Jaxson Rosser",
    date: "Jan 06, 2025",
  },
  {
    id: "10",
    name: "Open Water Dive",
    duration: "4 days",
    level: "Beginner",
    price: 250,
    instructor: "Sarah Jonson's",
    date: "Jan 06, 2025",
  },
  {
    id: "11",
    name: "Rescue Diver",
    duration: "5 days",
    level: "Advanced",
    price: 300,
    instructor: "Michael Scott",
    date: "Feb 10, 2025",
  },
];

const CourseManageTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleView = (course: Course) => {
    console.log("View course:", course.id);
  };

  const handleDelete = (course: Course) => {
    console.log("Delete course:", course.id);
  };

  const getLevelBadgeStyle = (level: Course["level"]) => {
    switch (level) {
      case "Beginner":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Intermediate":
        return "bg-teal-100 text-teal-800 border border-teal-200";
      case "Advanced":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full bg-white">
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Course
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Level
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Instructor
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData.map((course, index) => (
              <tr
                key={course.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {course.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {course.duration}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadgeStyle(
                      course.level
                    )}`}
                  >
                    {course.level}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ${course.price}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {course.instructor}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {course.date}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleView(course)}
                      className="p-1 text-primary bg-transparent  rounded hover:bg-gray-200 cursor-pointer"
                      title="View course"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(course)}
                      className="p-1 text-red-600 bg-transparent  rounded  hover:bg-gray-200 cursor-pointer"
                      title="Delete course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 py-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseManageTable;
