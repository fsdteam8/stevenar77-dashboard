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

  // const handleUpdateCourse = async (formData: FormData) => {
  //   try {
  //     // Convert FormData to plain object matching ApiCourse type
  //     const courseObj: any = {};
  //     formData.forEach((value, key) => {
  //       courseObj[key] = value;
  //     });

  //     await updateCourse({
  //       id: params.id,
  //       data: courseObj,
  //     });
  //     router.push("/courses-management");
  //     return { success: true, message: "Course updated successfully" };
  //   } catch (error) {
  //     console.error("Failed to update course:", error);
  //     return { success: false, message: "Failed to update course" };
  //   }
  // };

  const handleUpdateCourse = async (formData: FormData) => {
    try {
      // Convert FormData to plain object while preserving multiple values for the same key
      const courseObj: any = {};

      formData.forEach((value, key) => {
        if (courseObj[key]) {
          // Already exists: convert to array if not already
          if (!Array.isArray(courseObj[key])) {
            courseObj[key] = [courseObj[key]];
          }
          courseObj[key].push(value);
        } else {
          courseObj[key] = value;
        }
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
    // <CourseCreateForm
    //   mode="edit"
    //   //   courseId={params.id}
    //   courseData={courseData.data}
    //   onSubmit={handleUpdateCourse}
    //   onCancel={handleCancel}
    // />
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
      onCancel={handleCancel}
    />
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import CourseCreateForm from "@/components/Dashboard/CoursesManagement/CourseCreateForm";
// import { useUpdateCourse, useCourse } from "@/hooks/course/useCourses";
// import { useRouter } from "next/navigation";
// import React from "react";

// interface PageProps {
//   params: {
//     id: string;
//   };
// }

// export default function Page({ params }: PageProps) {
//   const unwrappedParams = React.use(params); // ✅ unwrap params
//   const courseId = unwrappedParams.id;

//   const router = useRouter();
//   const { data: courseData, isLoading } = useCourse(courseId);
//   const { mutateAsync: updateCourse } = useUpdateCourse();

//   const handleUpdateCourse = async (formData: FormData) => {
//     try {
//       const courseObj: any = {};
//       formData.forEach((value, key) => {
//         courseObj[key] = value;
//       });

//       await updateCourse({
//         id: courseId,
//         data: courseObj,
//       });
//       router.push("/courses-management");
//       return { success: true, message: "Course updated successfully" };
//     } catch (error) {
//       console.error("Failed to update course:", error);
//       return { success: false, message: "Failed to update course" };
//     }
//   };

//   const handleCancel = () => {
//     router.back();
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!courseData) {
//     return <div>Course not found</div>;
//   }

//   return (
//     <CourseCreateForm
//       mode="edit"
//       courseData={courseData.data}
//       onSubmit={handleUpdateCourse}
//       onCancel={handleCancel}
//     />
//   );
// }
