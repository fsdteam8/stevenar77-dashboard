/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import type React from "react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Upload, Plus, Loader2, X } from "lucide-react";
import { courseApi } from "@/lib/api";
import Image from "next/image";

// ✅ Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface CourseFormData {
  courseTitle: string;
  courseLevel: string;
  description: string;
  image: File | null | string;
  price: string;
  duration: string;
  location: string;
  timeSlots: string;
  classDates: string[];
  instructorAssignment: string;
  index: number;
  courseIncludes: string;
  formTitle: string[];
  minAge: number;
  maxAge: number;
  addOnce: Array<{ title: string; price: string }>; // Added addOnce field
}

interface CourseFormProps {
  mode?: "create" | "edit";
  courseData?: any;
  onSubmit?: (
    data: FormData
  ) => Promise<{ success: boolean; message?: string }>;
  onCancel?: () => void;
}

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
    location: "",
    timeSlots: "",
    classDates: [],
    instructorAssignment: "Monthly",
    index: 1,
    courseIncludes: "",
    formTitle: [],
    minAge: 0,
    maxAge: 0,
    addOnce: [], // Initialize addOnce array
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const options = [
    { value: "Standards Form", label: "Standards Form" },
    { value: "Continuing Education", label: "Continuing Education" },
    { value: "Divers Activity", label: "Divers Activity" },
    { value: "Quick Review", label: "Quick Review" },
    { value: "Divers Medical", label: "Divers Medical" },
    { value: "Enriched Training", label: "Enriched Training" },
    { value: "Equipment Rental", label: "Equipment Rental" },
  ];

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !formData.formTitle.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        formTitle: [...prev.formTitle, value],
      }));
    }
    e.target.value = "";
  };

  const handleRemove = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      formTitle: prev.formTitle.filter((item) => item !== value),
    }));
  };

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
        location: courseData.location || "",
        timeSlots: courseData.timeSlots || "",
        classDates: Array.isArray(courseData.classDates)
          ? courseData.classDates.map((d: any) =>
              typeof d === "string" ? d : d.date || d
            )
          : courseData.classDates
          ? [courseData.classDates]
          : [],
        instructorAssignment: courseData.instructorAssignment || "Monthly",
        index: courseData.index || 1,
        courseIncludes: Array.isArray(courseData.courseIncludes)
          ? courseData.courseIncludes.join("\n")
          : courseData.courseIncludes || "",
        formTitle: Array.isArray(courseData.formTitle)
          ? courseData.formTitle
          : courseData.formTitle
          ? [courseData.formTitle]
          : [],
        minAge: courseData.minAge ? Number(courseData.minAge) : 0,
        maxAge: courseData.maxAge ? Number(courseData.maxAge) : 0,
        addOnce: courseData.addOnce || [], // Load addOnce from courseData
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
    if (submitMessage) setSubmitMessage(null);
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
    if (submitMessage) setSubmitMessage(null);
  };

  const handleFileSelect = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileChange(file);
    };

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setSubmitMessage({
        type: "error",
        text: "Please select a valid image file",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSubmitMessage({
        type: "error",
        text: "File size must be less than 5MB",
      });
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setExistingImageUrl(null);
    setSubmitMessage(null);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (mode === "edit" && courseData?.image) {
      setExistingImageUrl(courseData.image);
    }
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      addOnce: [...prev.addOnce, { title: "", price: "" }],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      addOnce: prev.addOnce.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (
    index: number,
    field: "title" | "price",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      addOnce: prev.addOnce.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    // ✅ Validations
    if (!formData.courseTitle.trim()) {
      setSubmitMessage({ type: "error", text: "Course title is required" });
      setIsSubmitting(false);
      return;
    }
    if (!formData.description.trim()) {
      setSubmitMessage({ type: "error", text: "Description is required" });
      setIsSubmitting(false);
      return;
    }
    if (!formData.price.trim()) {
      setSubmitMessage({ type: "error", text: "Price is required" });
      setIsSubmitting(false);
      return;
    }
    if (!formData.duration.trim()) {
      setSubmitMessage({ type: "error", text: "Duration is required" });
      setIsSubmitting(false);
      return;
    }
    if (formData.minAge === 0) {
      setSubmitMessage({ type: "error", text: "Minimum age is required" });
      setIsSubmitting(false);
      return;
    }
    if (formData.maxAge === 0) {
      setSubmitMessage({ type: "error", text: "Maximum age is required" });
      setIsSubmitting(false);
      return;
    }
    if (formData.maxAge < formData.minAge) {
      setSubmitMessage({
        type: "error",
        text: "Max age cannot be less than Min age",
      });
      setIsSubmitting(false);
      return;
    }
    if (mode === "create" && !selectedFile) {
      setSubmitMessage({ type: "error", text: "Please upload a course image" });
      setIsSubmitting(false);
      return;
    }
    if (mode === "edit" && !selectedFile && !existingImageUrl) {
      setSubmitMessage({ type: "error", text: "Please upload a course image" });
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.courseTitle);
      formDataToSend.append("courseLevel", formData.courseLevel);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("timeSlots", formData.timeSlots);

      formData.classDates
        .filter((d) => d)
        .forEach((date) => formDataToSend.append("classDates", date));

      formDataToSend.append(
        "instructorAssignment",
        formData.instructorAssignment
      );
      formDataToSend.append("index", formData.index.toString());

      // ✅ Append minAge & maxAge
      formDataToSend.append("minAge", formData.minAge.toString());
      formDataToSend.append("maxAge", formData.maxAge.toString());

      formData.price
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p)
        .forEach((price, i) => formDataToSend.append(`price[${i}]`, price));

      formData.courseIncludes
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item)
        .forEach((include, i) =>
          formDataToSend.append(`courseIncludes[${i}]`, include)
        );

      formData.formTitle
        .filter((item) => item)
        .forEach((title, i) => formDataToSend.append(`formTitle[${i}]`, title));

      formData.addOnce.forEach((item, i) => {
        if (item.title.trim() && item.price.trim()) {
          formDataToSend.append(`addOnce[${i}][title]`, item.title);
          formDataToSend.append(`addOnce[${i}][price]`, item.price);
        }
      });

      if (selectedFile) {
        formDataToSend.append("image", selectedFile, selectedFile.name);
      } else if (mode === "edit" && existingImageUrl) {
        formDataToSend.append("keepExistingImage", "true");
        formDataToSend.append("existingImageUrl", existingImageUrl);
      }

      if (mode === "edit" && courseData?.id) {
        formDataToSend.append("courseId", courseData.id);
      }

      let response;
      if (onSubmit) {
        response = await onSubmit(formDataToSend);
      } else {
        response =
          mode === "edit" && courseData?.id
            ? await courseApi.updateCourse(courseData.id, formDataToSend)
            : await courseApi.createCourse(formDataToSend);
      }

      if (response.success) {
        setSubmitMessage({
          type: "success",
          text:
            response.message ||
            `Course ${mode === "edit" ? "updated" : "created"} successfully!`,
        });
        if (mode === "create") {
          setFormData({
            courseTitle: "",
            courseLevel: "Advanced",
            description: "",
            image: null,
            price: "",
            duration: "",
            location: "",
            timeSlots: "",
            classDates: [],
            instructorAssignment: "Monthly",
            index: 1,
            courseIncludes: "",
            formTitle: [],
            minAge: 0,
            maxAge: 0,
            addOnce: [], // Reset addOnce on success
          });
          setSelectedFile(null);
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
          setExistingImageUrl(null);
        }
      } else {
        throw new Error(response.message || `Failed to ${mode} course`);
      }
    } catch (error) {
      console.error("Error submitting:", error);
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
    if (onCancel) onCancel();
    else if (mode === "create") {
      setFormData({
        courseTitle: "",
        courseLevel: "Advanced",
        description: "",
        image: null,
        price: "",
        duration: "",
        location: "",
        timeSlots: "",
        classDates: [],
        instructorAssignment: "Monthly",
        index: 1,
        courseIncludes: "",
        formTitle: [],
        minAge: 0,
        maxAge: 0,
        addOnce: [], // Reset addOnce on cancel
      });
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setExistingImageUrl(null);
      setSubmitMessage(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const currentImageUrl = previewUrl || existingImageUrl;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto container">
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
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
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
                </div>

                {/* ✅ React Quill Editor for Description */}
                <div className="mb-16">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <ReactQuill
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    className="h-96"
                    theme="snow"
                  />
                </div>

                {/* Price + Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *{" "}
                      <span className="text-xs text-gray-500">
                        (new line-separated for multiple prices)
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

                {/* Course Includes */}
                <div className="">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Includes{" "}
                      <span className="text-xs text-gray-500">
                        (comma or line-separated)
                      </span>
                    </label>
                    <textarea
                      name="courseIncludes"
                      placeholder="Instructor guidance, Course materials..."
                      rows={3}
                      value={formData.courseIncludes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Course Dates Row */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Course Dates *
                        </label>
                        <input
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                          onChange={(e) => {
                            const selected = e.target.value;
                            if (!selected) return;

                            setFormData((prev) => {
                              if (prev.classDates.includes(selected))
                                return prev;

                              return {
                                ...prev,
                                classDates: [...prev.classDates, selected],
                              };
                            });

                            e.target.value = "";
                          }}
                        />
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location *
                        </label>
                        <input
                          type="text"
                          name="location"
                          placeholder="locations"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    {/* Show selected dates as cards */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.classDates?.map((date: string) => (
                        <div
                          key={date}
                          className="bg-teal-100 text-teal-800 px-4 py-2 rounded-lg shadow-sm flex items-center gap-2"
                        >
                          {new Date(date).toLocaleDateString()}
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                classDates: prev.classDates.filter(
                                  (d) => d !== date
                                ),
                              }))
                            }
                            className="text-red-500 hover:text-red-700 font-bold"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Min Age + Max Age */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Age *
                    </label>
                    <input
                      type="number"
                      name="minAge"
                      placeholder="Minimum Age"
                      value={formData.minAge}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Age *
                    </label>
                    <input
                      type="number"
                      name="maxAge"
                      placeholder="Maximum Age"
                      value={formData.maxAge}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Index + Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Index *
                    </label>
                    <input
                      type="number"
                      name="index"
                      placeholder="Courses Number"
                      value={formData.index}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Form
                    </label>

                    <select
                      onChange={handleSelect}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select option
                      </option>
                      {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {formData.formTitle.length > 0 ? (
                        formData.formTitle.map((value) => (
                          <span
                            key={value}
                            className="flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm"
                          >
                            {value}
                            <button
                              type="button"
                              onClick={() => handleRemove(value)}
                              className="hover:text-red-500 cursor-pointer"
                            >
                              <X size={16} />
                            </button>
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No option selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Add Once Items
                    </label>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="inline-flex items-center justify-center w-8 h-8 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors"
                      title="Add new item"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {formData.addOnce.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      No add-once items added yet. Click the + button to add
                      items.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {formData.addOnce.map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-3 items-start bg-gray-50 p-4 rounded-lg border border-gray-200"
                        >
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <input
                                type="text"
                                placeholder="Item title"
                                value={item.title}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                              />
                            </div>
                            <div>
                              <input
                                type="number"
                                placeholder="Item price"
                                value={item.price}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "price",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors"
                            title="Remove item"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                            src={currentImageUrl || "/placeholder.svg"}
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
