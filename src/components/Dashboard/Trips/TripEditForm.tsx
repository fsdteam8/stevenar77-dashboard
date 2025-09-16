"use client";
import React, { useState, useEffect } from "react";
import { Upload, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { useSingleTrip } from "@/hooks/useTrips";
import { useParams, useRouter } from "next/navigation";
import { updateSingleTrip } from "@/lib/api";
import TripCreateFormSkeleton from "./TripCreateFormSkeleton";

const TripEditForm = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useSingleTrip(id as string);

  const trip = data?.data;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    maximumCapacity: "",
    startDate: "",
    endDate: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
   const router = useRouter();

  // API থেকে ডাটা আসলে formData তে বসানো
  useEffect(() => {
    if (trip) {
      setFormData({
        title: trip.title || "",
        description: trip.description || "",
        price: trip.price?.toString() || "",
        location: trip.location || "",
        maximumCapacity: trip.maximumCapacity?.toString() || "",
        startDate: trip.startDate?.split("T")[0] || "",
        endDate: trip.endDate?.split("T")[0] || "",
      });

      //  যদি images array থাকে, প্রথমটার URL set করা
      if (trip.images && trip.images.length > 0) {
        setImagePreview(trip.images[0].url);
      }
    }
  }, [trip]);

  // Input Change
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  // Validation
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) newErrors[key] = "This field is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset
  const resetForm = () => {
    if (trip) {
      setFormData({
        title: trip.title || "",
        description: trip.description || "",
        price: trip.price?.toString() || "",
        location: trip.location || "",
        maximumCapacity: trip.maximumCapacity?.toString() || "",
        startDate: trip.startDate?.split("T")[0] || "",
        endDate: trip.endDate?.split("T")[0] || "",
      });
      setImagePreview(trip.images?.[0]?.url || null);
      setImageFile(null);
      setErrors({});
    }
  };

  // Save (update API call)
  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        form.append(key, value)
      );
      if (imageFile) {
        form.append("images", imageFile);
      }

      await updateSingleTrip(id as string, form);

      toast.success("Trip updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update trip");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <p className="p-6"><TripCreateFormSkeleton /></p>;
  if (isError) return <p className="p-6 text-red-500">Failed to load trip</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto container">
        <div className="p-6">
          <div className="my-4">
            <button
              onClick={() => router.back()}
              className="flex items-center p-2 gap-2 cursor-pointer border border-[#0694A2] text-[#0694A2] rounded-md transition-colors font-medium hover:bg-[#0694A2] hover:text-white"
            >
              <ArrowLeft />
              Back
            </button>
          </div>
          <h2 className="text-2xl text-teal-600 font-bold mb-8">Edit Trip</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trips Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Write Here"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#0694A2] ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Description here"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#0694A2] resize-none ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Price & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Write Here"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#0694A2] ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Write Here"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#0694A2] ${
                      errors.location ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Capacity
                </label>
                <input
                  type="number"
                  name="maximumCapacity"
                  placeholder="Write Here Number"
                  value={formData.maximumCapacity}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#0694A2] ${
                    errors.maximumCapacity
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.maximumCapacity && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.maximumCapacity}
                  </p>
                )}
              </div>

              {/* Start & End Date */}
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
                    className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#0694A2] ${
                      errors.startDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startDate}
                    </p>
                  )}
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
                    className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#0694A2] ${
                      errors.endDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Upload */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Upload Photo
                </h3>

                <label
                  htmlFor="image-upload"
                  className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors flex flex-col items-center justify-center"
                >
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={160}
                      height={160}
                      className="mx-auto mb-4 w-40 h-40 object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-500 mb-4">
                        Browse and choose the files you want to upload from your
                        computer
                      </p>
                      <Plus className="w-5 h-5 text-white bg-[#0694A2] rounded-full p-1" />
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                </label>
                {errors.image && (
                  <p className="text-red-500 text-sm mt-2">{errors.image}</p>
                )}
              </div>
              {/* Buttons */}
              <div className="flex justify-end w-full gap-6 mt-6 px-2">
                <Button
                  className="px-6 py-3 border w-1/2 cursor-pointer border-red-300 text-red-600 rounded-md bg-transparent hover:bg-red-50 font-medium"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  className="px-8 py-3 w-1/2 cursor-pointer bg-[#0694A2] text-white rounded-md hover:bg-[#057f89] transition-colors font-medium"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripEditForm;
