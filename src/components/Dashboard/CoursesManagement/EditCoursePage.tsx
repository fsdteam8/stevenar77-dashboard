/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useUpdateCourse, useCourse } from "@/hooks/course/useCourses";
import { useRouter } from "next/navigation";
import CourseCreateForm from "./CourseCreateForm";

export default function EditCoursePage({ id }: { id: string }) {
  const router = useRouter();
  const { data: courseData, isLoading } = useCourse(id);
  const { mutateAsync: updateCourse } = useUpdateCourse();

  const handleUpdateCourse = async (formData: FormData) => {
    try {
      const courseObj: any = {};
      formData.forEach((value, key) => {
        if (courseObj[key]) {
          if (!Array.isArray(courseObj[key])) courseObj[key] = [courseObj[key]];
          courseObj[key].push(value);
        } else {
          courseObj[key] = value;
        }
      });

      await updateCourse({ id, data: courseObj });
      router.push("/courses-management");

      return { success: true, message: "Course updated successfully" };
    } catch (error) {
      console.error("Error updating course:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update course",
      };
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!courseData) return <div>Course not found</div>;

  return (
    <CourseCreateForm
      mode="edit"
      courseData={{
        ...courseData.data,
        classDates: Array.isArray(courseData.data.classDates)
          ? courseData.data.classDates.map((d: any) =>
              typeof d === "string" ? d : d.date || d
            )
          : courseData.data.classDates
          ? [courseData.data.classDates]
          : [],
      }}
      onSubmit={handleUpdateCourse}
      onCancel={() => router.back()}
    />
  );
}
