/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CourseCreateForm from "@/components/Dashboard/CoursesManagement/CourseCreateForm";
import { useUpdateCourse, useCourse } from "@/hooks/course/useCourses";
import { useRouter } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const { data: courseData, isLoading } = useCourse(params.id);
  const { mutateAsync: updateCourse } = useUpdateCourse();

  const handleUpdateCourse = async (formData: FormData) => {
    try {
      // Convert FormData to plain object matching ApiCourse type
      const courseObj: any = {};
      formData.forEach((value, key) => {
        courseObj[key] = value;
      });

      await updateCourse({
        id: params.id,
        data: courseObj,
      });
      router.push("/courses-management");
      return { success: true, message: "Course updated successfully" };
    } catch (error) {
      console.error("Failed to update course:", error);
      return { success: false, message: "Failed to update course" };
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!courseData) {
    return <div>Course not found</div>;
  }

  return (
    <CourseCreateForm
      mode="edit"
      //   courseId={params.id}
      courseData={courseData.data}
      onSubmit={handleUpdateCourse}
      onCancel={handleCancel}
    />
  );
}
