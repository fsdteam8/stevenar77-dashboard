"use client";
import React, { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CourseCard from "../Card/CourseCard";
import DeleteAlertDialog from "../Card/DeleteCard";
import { useCourses } from "@/hooks/useCourses";

type ApiCourse = {
  _id: string;
  title: string;
  images?: { url: string }[];
  shortDescription: string;
  courseLevel: "beginner" | "intermediate" | "advanced";
  features: string[];
  price: number;
  longDescription: string;
  courseDate: string;
  location: string;
  requiredAge: number;
  maxDepth: number;
  courseDuration: string;
  avgRating?: number;
  totalReviews?: number;
};

const CourseManageTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ApiCourse | null>(null);

  const { data, isLoading, isError } = useCourses(currentPage, 10);

  const courses: ApiCourse[] = data?.data || [];
  const meta = data?.meta;

  const handleView = (course: ApiCourse) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = (course: ApiCourse) => {
    console.log("Delete course:", course._id);
  };

  const handleSeeMore = () => {
    console.log("See more clicked for:", selectedCourse?._id);
  };

  const handleBookNow = () => {
    console.log("Book now clicked for:", selectedCourse?._id);
  };

  // Convert API course → CourseCard format
  const getCourseCardData = (course: ApiCourse) => ({
    image:
      course.images && course.images.length > 0
        ? course.images[0].url
        : "/api/placeholder/400/240",
    title: course.title,
    description: course.shortDescription,
    rating: course.avgRating || 4.5,
    reviews: course.totalReviews || 10,
    duration: course.courseDuration,
    maxDepth: `${course.maxDepth}m`,
    ageRestriction: `Age ${course.requiredAge}+`,
    features: course.features,
    price: course.price.toString(),
    location: course.location,
  });

  const getLevelBadgeStyle = (level: ApiCourse["courseLevel"]) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "intermediate":
        return "bg-teal-100 text-teal-800 border border-teal-200";
      case "advanced":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

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
                Location
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
            {isLoading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Loading courses...
                </td>
              </tr>
            )}

            {isError && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-red-500">
                  Failed to load courses.
                </td>
              </tr>
            )}

            {!isLoading &&
              !isError &&
              courses.map((course) => (
                <tr
                  key={course._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                        <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {course.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {course.courseDuration}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadgeStyle(
                        course.courseLevel
                      )}`}
                    >
                      {course.courseLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ${course.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {course.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(course.courseDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleView(course)}
                        className="p-1 text-primary bg-transparent rounded hover:bg-gray-200 cursor-pointer"
                        title="View course"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <DeleteAlertDialog
                        trigger={
                          <Button
                            className="p-1 text-red-600 bg-transparent rounded hover:bg-gray-200 cursor-pointer"
                            title="Delete course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        }
                        title="Delete Course"
                        itemName={course.title}
                        onConfirm={() => handleDelete(course)}
                        actionText="Delete Course"
                      />
                    </div>
                  </td>
                </tr>
              ))}

            {!isLoading && !isError && courses.length === 0 && (
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

      {/* Pagination */}
      {meta?.totalPage > 1 && (
        <div className="flex items-center justify-end gap-2 py-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {meta.totalPage}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(meta.totalPage, prev + 1))
            }
            disabled={currentPage === meta.totalPage}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      )}

      {/* Course Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Course Details
            </DialogTitle>
          </DialogHeader>

          {selectedCourse && (
            <div className="mt-4">
              <CourseCard
                {...getCourseCardData(selectedCourse)}
                onSeeMore={handleSeeMore}
                onBookNow={handleBookNow}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseManageTable;
