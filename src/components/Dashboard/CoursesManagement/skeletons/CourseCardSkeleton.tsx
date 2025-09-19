import type React from "react";

const CourseCardSkeleton: React.FC = () => {
  return (
    <section className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
        {/* Image Skeleton */}
        <div className="h-48 w-full bg-gray-200"></div>

        {/* Content */}
        <div className="p-6">
          {/* Title and Rating */}
          <div className="flex justify-between items-start mb-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>

          {/* Course Details */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>

          {/* Description */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>

          {/* Course Includes */}
          <div className="mb-6">
            <div className="h-5 bg-gray-200 rounded w-32 mb-3"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseCardSkeleton;
