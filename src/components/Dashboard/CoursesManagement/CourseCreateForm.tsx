/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import type React from "react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Upload, Plus, Loader2, X } from "lucide-react";
import { courseApi } from "@/lib/api";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  schedule: Array<{
    title: string;
    description: string;
    participents: number;
    sets: Array<{
      date: string;
      location: string;
      type: string;
    }>;
  }>;
  instructorAssignment: string;
  index: number;
  courseIncludes: string;
  formTitle: string[];
  minAge: number;
  maxAge: number;
  addOnce: Array<{ title: string; price: string }>;
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
    schedule: [],
    instructorAssignment: "Monthly",
    index: 1,
    courseIncludes: "",
    formTitle: [],
    minAge: 0,
    maxAge: 0,
    addOnce: [],
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [scheduleSets, setScheduleSets] = useState<
    Array<{
      title: string;
      description: string;
      participents: number;
      sets: Array<{
        date: string;
        location: string;
        type: string;
      }>;
    }>
  >([{ title: "", description: "", participents: 0, sets: [] }]);

  const toBackendUTC = (date: Date, offsetHours: number = -6) => {
    const d = new Date(date);
    d.setHours(d.getHours() - offsetHours);
    return d.toISOString();
  };

  // Only load scheduleSets from courseData on mount/edit mode
  useEffect(() => {
    if (mode === "edit" && courseData?.schedule) {
      const loadedSets =
        Array.isArray(courseData.schedule) && courseData.schedule.length > 0
          ? courseData.schedule.map((scheduleItem: any) => ({
              title: scheduleItem.title || "",
              description: scheduleItem.description || "",
              participents: scheduleItem.participents,
              sets: Array.isArray(scheduleItem.sets)
                ? scheduleItem.sets.map((item: any) => ({
                    date: item.date || "",
                    location: item.location || "",
                    // type: item.type || "pool",
                  }))
                : [],
            }))
          : [{ title: "", description: "", participents: 0, sets: [] }];
      setScheduleSets(loadedSets);
    }
  }, [mode, courseData]);

  const handleAddScheduleSet = () => {
    setScheduleSets((prev) => [
      ...prev,
      { title: "", description: "", participents: 0, sets: [] },
    ]);
  };

  const handleRemoveScheduleSet = (setIndex: number) => {
    setScheduleSets((prev) => prev.filter((_, i) => i !== setIndex));
  };

  const handleScheduleFieldChange = (
    setIndex: number,
    field: "title" | "description" | "participents",
    value: string | number
  ) => {
    setScheduleSets((prev) =>
      prev.map((scheduleSet, i) =>
        i === setIndex ? { ...scheduleSet, [field]: value } : scheduleSet
      )
    );
  };

  const handleAddClassDate = (setIndex: number) => {
    setScheduleSets((prev) =>
      prev.map((scheduleSet, i) =>
        i === setIndex
          ? {
              ...scheduleSet,
              sets: [
                ...scheduleSet.sets,
                { date: "", location: "", type: "pool" },
              ],
            }
          : scheduleSet
      )
    );
  };

  const handleRemoveClassDate = (setIndex: number, dateIndex: number) => {
    setScheduleSets((prev) =>
      prev.map((scheduleSet, i) =>
        i === setIndex
          ? {
              ...scheduleSet,
              sets: scheduleSet.sets.filter((_, j) => j !== dateIndex),
            }
          : scheduleSet
      )
    );
  };

  const handleClassDateChange = (
    setIndex: number,
    dateIndex: number,
    date: Date | null
  ) => {
    if (!date) return;
    const isoString = toBackendUTC(date, -6);
    setScheduleSets((prev) =>
      prev.map((scheduleSet, i) =>
        i === setIndex
          ? {
              ...scheduleSet,
              sets: scheduleSet.sets.map((item, j) =>
                j === dateIndex ? { ...item, date: isoString } : item
              ),
            }
          : scheduleSet
      )
    );
  };

  const handleClassLocationChange = (
    setIndex: number,
    dateIndex: number,
    location: string
  ) => {
    setScheduleSets((prev) =>
      prev.map((scheduleSet, i) =>
        i === setIndex
          ? {
              ...scheduleSet,
              sets: scheduleSet.sets.map((item, j) =>
                j === dateIndex ? { ...item, location } : item
              ),
            }
          : scheduleSet
      )
    );
  };

  // const handleClassTypeChange = (
  //   setIndex: number,
  //   dateIndex: number,
  //   type: string
  // ) => {
  //   setScheduleSets((prev) =>
  //     prev.map((scheduleSet, i) =>
  //       i === setIndex
  //         ? {
  //             ...scheduleSet,
  //             sets: scheduleSet.sets.map((item, j) =>
  //               j === dateIndex ? { ...item, type } : item
  //             ),
  //           }
  //         : scheduleSet
  //     )
  //   );
  // };

  const options = [
    { value: "Standards Form", label: "Standards Form" },
    { value: "Continuing Education", label: "Continuing Education" },
    { value: "Divers Activity", label: "Divers Activity" },
    { value: "Quick Review", label: "Quick Review" },
    { value: "Divers Medical", label: "Divers Medical" },
    { value: "Enriched Training", label: "Enriched Training" },
    { value: "Equipment Rental", label: "Equipment Rental" },
    // {
    //   value: "Enriched Air -Quick Review",
    //   label: "Enriched Air -Quick Review",
    // },
    // { value: "Resque Diver-Quick Review", label: "Resque Diver-Quick Review" },
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
        schedule: [],
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
        addOnce: courseData.addOnce || [],
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

      // Append schedule in the correct backend format
      if (scheduleSets.length > 0) {
        const scheduleData = scheduleSets.map((scheduleSet) => ({
          title: scheduleSet.title || "",
          description: scheduleSet.description || "",
          participents: scheduleSet.participents || 0,
          sets: scheduleSet.sets
            .filter((item) => item.date)
            .map((item) => ({
              date: item.date,
              location: item.location || "",
              type: item.type || "pool",
            })),
        }));

        // Send as JSON string for nested structure
        formDataToSend.append("schedule", JSON.stringify(scheduleData));
      }

      formDataToSend.append(
        "instructorAssignment",
        formData.instructorAssignment
      );
      formDataToSend.append("index", formData.index.toString());
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
        if (item.title.trim() && String(item.price).trim()) {
          formDataToSend.append(`addOnce[${i}][title]`, item.title);
          formDataToSend.append(`addOnce[${i}][price]`, String(item.price));
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

      console.log(formData);

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
            schedule: [],
            instructorAssignment: "Monthly",
            index: 1,
            courseIncludes: "",
            formTitle: [],
            minAge: 0,
            maxAge: 0,
            addOnce: [],
          });
          setSelectedFile(null);
          setScheduleSets([
            { title: "", description: "", participents: 0, sets: [] },
          ]);
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
        schedule: [],
        instructorAssignment: "Monthly",
        index: 1,
        courseIncludes: "",
        formTitle: [],
        minAge: 0,
        maxAge: 0,
        addOnce: [],
      });
      setSelectedFile(null);
      setScheduleSets([
        { title: "", description: "", participents: 0, sets: [] },
      ]);
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
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="location"
                      value={formData.location}
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
                        {/* (new line-separated for multiple prices) */}
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
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Course Schedule (Dates & Locations) *
                      </label>
                      <button
                        type="button"
                        onClick={handleAddScheduleSet}
                        className="flex gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors cursor-pointer text-sm font-medium"
                      >
                        Create New Date Schedule <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {scheduleSets.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">
                        No schedule sets added yet. Click &ldquo;Create New
                        Set&quot; to add a set.
                      </p>
                    ) : (
                      <div className="space-y-6">
                        {scheduleSets.map((scheduleSet, setIndex) => (
                          <div
                            key={setIndex}
                            className="border-2 border-gray-300 rounded-lg p-4 bg-white"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-base font-semibold text-gray-800">
                                Date Schedule {setIndex + 1}
                              </h4>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleAddClassDate(setIndex)}
                                  className="inline-flex items-center justify-center w-8 h-8 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors cursor-pointer"
                                  title="Add date to this set"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                                {scheduleSets.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveScheduleSet(setIndex)
                                    }
                                    className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                                    title="Remove this set"
                                  >
                                    <X className="w-5 h-5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Schedule Details Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-blue-100 p-4 rounded-lg border border-gray-200">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Schedule Title *
                                </label>
                                <input
                                  type="text"
                                  placeholder="Enter schedule title"
                                  value={scheduleSet.title}
                                  onChange={(e) =>
                                    handleScheduleFieldChange(
                                      setIndex,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-primary rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Schedule Description
                                </label>
                                <input
                                  type="text"
                                  placeholder="Enter description"
                                  value={scheduleSet.description}
                                  onChange={(e) =>
                                    handleScheduleFieldChange(
                                      setIndex,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-primary rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Total participents *
                                </label>
                                <input
                                  type="number"
                                  placeholder="Enter number"
                                  value={scheduleSet.participents}
                                  onChange={(e) =>
                                    handleScheduleFieldChange(
                                      setIndex,
                                      "participents",
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  min="0"
                                  className="w-full px-3 py-2 border border-primary rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                />
                              </div>
                            </div>

                            {scheduleSet.sets.length === 0 ? (
                              <p className="text-sm text-gray-500 italic">
                                No dates in this set. Click the + button to add
                                a date.
                              </p>
                            ) : (
                              <div className="space-y-4">
                                {scheduleSet.sets.map((item, dateIndex) => (
                                  <div
                                    key={dateIndex}
                                    className="flex flex-col md:flex-row gap-3 items-start bg-gray-50 p-4 rounded-lg border border-gray-200"
                                  >
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 w-full">
                                      {/* Date Picker */}
                                      <div className="w-full">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                          Select Date *
                                        </label>
                                        <DatePicker
                                          selected={
                                            item.date
                                              ? new Date(item.date)
                                              : null
                                          }
                                          onChange={(date) =>
                                            handleClassDateChange(
                                              setIndex,
                                              dateIndex,
                                              date
                                            )
                                          }
                                          minDate={new Date()}
                                          dateFormat="MM/dd/yyyy"
                                          placeholderText="Select a date"
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm"
                                        />
                                      </div>

                                      {/* Location Input */}
                                      <div className="w-full">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                          Location *
                                        </label>
                                        <input
                                          type="text"
                                          placeholder="Enter location"
                                          value={item.location}
                                          onChange={(e) =>
                                            handleClassLocationChange(
                                              setIndex,
                                              dateIndex,
                                              e.target.value
                                            )
                                          }
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm"
                                        />
                                      </div>
                                    </div>

                                    {/* Remove button */}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveClassDate(
                                          setIndex,
                                          dateIndex
                                        )
                                      }
                                      className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors md:mt-5 self-end md:self-auto"
                                      title="Remove date"
                                    >
                                      <X className="w-5 h-5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
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
                      Max Age <span className="text-xs ">(optional)</span>
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
                      Add-ons Items
                    </label>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="inline-flex items-center justify-center w-8 h-8 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors cursor-pointer"
                      title="Add new item"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {formData.addOnce.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      No add-ons items added yet. Click the + button to add
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
                            className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
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
