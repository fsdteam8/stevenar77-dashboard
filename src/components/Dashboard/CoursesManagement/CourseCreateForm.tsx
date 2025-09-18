/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Upload, Plus, Loader2, X } from "lucide-react";
import { courseApi } from "@/lib/api";
import Image from "next/image";

interface CourseFormData {
  courseTitle: string;
  courseLevel: string;
  description: string;
  image: File | null | string; // Can be File object, null, or existing image URL
  price: string;
  duration: string;
  locations: string;
  timeSlots: string;
  startDate: string;
  endDate: string;
  instructorAssignment: string;
  courseIncludes: string;
}

// interface Course {
//   id?: string;
//   title?: string;
//   courseLevel?: string;
//   description?: string;
//   price?: string[];
//   duration?: string;
//   locations?: string;
//   timeSlots?: string;
//   startDate?: string;
//   endDate?: string;
//   instructorAssignment?: string;
//   courseIncludes?: string[];
//   image?: string; 
// }

interface CourseFormProps {
  mode?: "create" | "edit";
  courseData?: any;
  onSubmit?: (
    data: FormData
  ) => Promise<{ success: boolean; message?: string }>;
  onCancel?: () => void;
}

// Mock API functions for demonstration
// const courseApi = {
//   createCourse: async (formData: FormData) => {
//     console.log("Creating course - FormData contents:");
//     for (let [key, value] of formData.entries()) {
//       if (value instanceof File) {
//         console.log(key, `File: ${value.name} (${value.size} bytes)`);
//       } else {
//         console.log(key, value);
//       }
//     }
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     return { success: true, message: "Course created successfully" };
//   },

//   updateCourse: async (id: string, formData: FormData) => {
//     console.log(`Updating course ${id} - FormData contents:`);
//     for (let [key, value] of formData.entries()) {
//       if (value instanceof File) {
//         console.log(key, `File: ${value.name} (${value.size} bytes)`);
//       } else {
//         console.log(key, value);
//       }
//     }
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     return { success: true, message: "Course updated successfully" };
//   },
// };

const Button = ({
  children,
  className,
  disabled,
  type,
  onClick,
  ...props
}: any) => (
  <button
    className={className}
    disabled={disabled}
    type={type}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

const CourseCreateForm: React.FC<CourseFormProps> = ({
  mode = "create",
  courseData = null,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CourseFormData>({
    courseTitle: "",
    courseLevel: "Advanced",
    description: "",
    image: null,
    price: "",
    duration: "",
    locations: "",
    timeSlots: "",
    startDate: "",
    endDate: "",
    instructorAssignment: "Monthly",
    courseIncludes: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Populate form data when editing
  useEffect(() => {
    if (mode === "edit" && courseData) {
      setFormData({
        courseTitle: courseData.title || "",
        courseLevel: courseData.courseLevel || "Advanced",
        description: courseData.description || "",
        image: courseData?.image || null,
        price: Array.isArray(courseData.price)
          ? courseData.price.join(", ")
          : courseData.price || "",
        duration: courseData.duration || "",
        locations: courseData.locations || "",
        timeSlots: courseData.timeSlots || "",
        startDate: courseData.startDate || "",
        endDate: courseData.endDate || "",
        instructorAssignment: courseData.instructorAssignment || "Monthly",
        courseIncludes: Array.isArray(courseData.courseIncludes)
          ? courseData.courseIncludes.join(", ")
          : courseData.courseIncludes || "",
      });

      if (courseData.image) {
        setExistingImageUrl(courseData?.image?.url);
      }
    }
  }, [mode, courseData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (submitMessage) {
      setSubmitMessage(null);
    }
  };

  const handleFileSelect = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileChange(file);
      }
    };

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const handleFileChange = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setSubmitMessage({
        type: "error",
        text: "Please select a valid image file",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setSubmitMessage({
        type: "error",
        text: "File size must be less than 5MB",
      });
      return;
    }

    // Clean up previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);

    // Create new preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setExistingImageUrl(null); // Clear existing image when new file is selected

    setSubmitMessage(null);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    // In edit mode, restore existing image if available
    if (mode === "edit" && courseData?.image) {
      setExistingImageUrl(courseData.image);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    // Validate required fields
    if (!formData.courseTitle.trim()) {
      setSubmitMessage({
        type: "error",
        text: "Course title is required",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.description.trim()) {
      setSubmitMessage({
        type: "error",
        text: "Description is required",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.price.trim()) {
      setSubmitMessage({
        type: "error",
        text: "Price is required",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.duration.trim()) {
      setSubmitMessage({
        type: "error",
        text: "Duration is required",
      });
      setIsSubmitting(false);
      return;
    }

    // For create mode, image is required. For edit mode, it's optional if existing image exists
    if (mode === "create" && !selectedFile) {
      setSubmitMessage({
        type: "error",
        text: "Please upload a course image",
      });
      setIsSubmitting(false);
      return;
    }

    if (mode === "edit" && !selectedFile && !existingImageUrl) {
      setSubmitMessage({
        type: "error",
        text: "Please upload a course image",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.courseTitle);
      formDataToSend.append("courseLevel", formData.courseLevel);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("locations", formData.locations);
      formDataToSend.append("timeSlots", formData.timeSlots);
      formDataToSend.append("startDate", formData.startDate);
      formDataToSend.append("endDate", formData.endDate);
      formDataToSend.append(
        "instructorAssignment",
        formData.instructorAssignment
      );

      // Handle price as array
      const prices = formData.price
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p);
      prices.forEach((price, index) => {
        formDataToSend.append(`price[${index}]`, price);
      });

      // Handle courseIncludes as array
      const includes = formData.courseIncludes
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter((item) => item);
      includes.forEach((include, index) => {
        formDataToSend.append(`courseIncludes[${index}]`, include);
      });

      // Add image if selected, or indicate to keep existing
      if (selectedFile) {
        formDataToSend.append("image", selectedFile, selectedFile.name);
      } else if (mode === "edit" && existingImageUrl) {
        formDataToSend.append("keepExistingImage", "true");
        formDataToSend.append("existingImageUrl", existingImageUrl);
      }

      // Add course ID for edit mode
      if (mode === "edit" && courseData?.id) {
        formDataToSend.append("courseId", courseData.id);
      }

      let response;
      if (onSubmit) {
        // Use custom submit handler if provided
        response = await onSubmit(formDataToSend);
      } else {
        // Use default API calls
        if (mode === "edit" && courseData?.id) {
          response = await courseApi.updateCourse(
            courseData.id,
            formDataToSend
          );
        } else {
          response = await courseApi.createCourse(formDataToSend);
        }
      }

      if (response.success) {
        setSubmitMessage({
          type: "success",
          text:
            response.message ||
            `Course ${mode === "edit" ? "updated" : "created"} successfully!`,
        });

        // Reset form only in create mode
        if (mode === "create") {
          setFormData({
            courseTitle: "",
            courseLevel: "Advanced",
            description: "",
            image: null,
            price: "",
            duration: "",
            locations: "",
            timeSlots: "",
            startDate: "",
            endDate: "",
            instructorAssignment: "Monthly",
            courseIncludes: "",
          });
          setSelectedFile(null);
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }
          setExistingImageUrl(null);
        }
      } else {
        throw new Error(response.message || `Failed to ${mode} course`);
      }
    } catch (error) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "creating"} course:`,
        error
      );
      setSubmitMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : `Failed to ${mode} course`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Default cancel behavior - reset form for create mode
      if (mode === "create") {
        setFormData({
          courseTitle: "",
          courseLevel: "Advanced",
          description: "",
          image: null,
          price: "",
          duration: "",
          locations: "",
          timeSlots: "",
          startDate: "",
          endDate: "",
          instructorAssignment: "Monthly",
          courseIncludes: "",
        });
        setSelectedFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        setExistingImageUrl(null);
        setSubmitMessage(null);
      }
    }
  };

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const currentImageUrl = previewUrl || existingImageUrl;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto container max-w-6xl">
        <div className="p-6">
          <h2 className="text-2xl text-teal-600 font-bold mb-8">
            {mode === "edit" ? "Edit Course" : "Create New Course"}
          </h2>

          {submitMessage && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                submitMessage.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {submitMessage.text}
            </div>
          )}

          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                {/* Course Title and Level Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      name="courseTitle"
                      placeholder="Write Here"
                      value={formData.courseTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Level
                    </label>
                    <select
                      name="courseLevel"
                      value={formData.courseLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none appearance-none bg-white"
                    >
                      <option value="Advanced">Advanced</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    placeholder="Description here"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                  />
                </div>

                {/* Price and Duration Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *{" "}
                      <span className="text-xs text-gray-500">
                        (comma-separated for multiple prices)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="price"
                      placeholder="120, 250"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration *
                    </label>
                    <input
                      type="text"
                      name="duration"
                      placeholder="2 weekends"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Includes{" "}
                    <span className="text-xs text-gray-500">
                      (comma or line-separated)
                    </span>
                  </label>
                  <textarea
                    name="courseIncludes"
                    placeholder="Instructor guidance, Course materials, Rental gear, Hotel stay"
                    rows={3}
                    value={formData.courseIncludes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                  />
                </div>

                {/* Locations and Time & Slots Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Locations
                    </label>
                    <input
                      type="text"
                      name="locations"
                      placeholder="Write Here"
                      value={formData.locations}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time & Slots
                    </label>
                    <input
                      type="text"
                      name="timeSlots"
                      placeholder="Write Here"
                      value={formData.timeSlots}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Start Date and End Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Instructor Assignment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor Assignment
                  </label>
                  <select
                    name="instructorAssignment"
                    value={formData.instructorAssignment}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none appearance-none bg-white"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Daily">Daily</option>
                  </select>
                </div>
              </div>

              {/* Right Column - Upload Photo */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {mode === "edit" ? "Update Photo" : "Upload Photo"}{" "}
                    <span className="text-red-500">*</span>
                  </h3>

                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      currentImageUrl
                        ? "border-teal-300 bg-teal-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {!currentImageUrl ? (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-500 mb-4">
                          Browse and choose the files you want to upload from
                          your computer
                        </p>
                        <Button
                          type="button"
                          onClick={handleFileSelect}
                          className="inline-flex items-center justify-center w-10 h-10 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors cursor-pointer"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative">
                          <Image
                            width={400}
                            height={200}
                            src={currentImageUrl}
                            alt="Course preview"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={removeFile}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {selectedFile ? (
                          <>
                            <p className="text-sm text-teal-600">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Size:{" "}
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-gray-500">
                            Current image{" "}
                            {mode === "edit"
                              ? "(will be kept if no new image is uploaded)"
                              : ""}
                          </p>
                        )}
                        <Button
                          type="button"
                          onClick={handleFileSelect}
                          className="text-sm bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                        >
                          Change Image
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end w-full gap-6 mt-12 px-2">
                  <Button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border w-1/2 cursor-pointer border-red-300 text-red-600 rounded-md bg-transparent hover:bg-red-50 font-medium"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="px-8 py-3 w-1/2 cursor-pointer bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {mode === "edit" ? "Updating..." : "Creating..."}
                      </>
                    ) : mode === "edit" ? (
                      "Update"
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCreateForm;
