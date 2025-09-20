"use client";
import React, { useState, useEffect } from "react";
import { Upload, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useSingleProduct } from "@/hooks/useProducts";
import { updateSingleProduct } from "@/lib/api";
import dynamic from "next/dynamic";
// ✅ Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const ProductsEditForm = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading, isError } = useSingleProduct(id as string);
  const product = data?.data;

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    price: "",
    category: "",
    quantity: "",
    inStock: true,
    featured: [] as string[],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Load product data into form
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        shortDescription: product.shortDescription || "",
        longDescription: product.longDescription || "",
        price: product.price?.toString() || "",
        category: product.category || "",
        quantity: product.quantity?.toString() || "",
        inStock: product.inStock ?? true,
        featured: product.featured || [],
      });

      if (product.images && product.images.length > 0) {
        setImagePreview(product.images[0].url);
      }
    }
  }, [product]);

  // Input change
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  // ✅ Special handler for ReactQuill
  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
    if (submitMessage) setSubmitMessage(null);
  };

  // Validation
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value === "" || value === null)
        newErrors[key] = "This field is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset
  const resetForm = () => {
    if (product) {
      setFormData({
        title: product.title || "",
        shortDescription: product.shortDescription || "",
        longDescription: product.longDescription || "",
        price: product.price?.toString() || "",
        category: product.category || "",
        quantity: product.quantity?.toString() || "",
        inStock: product.inStock ?? true,
        featured: product.featured || [],
      });
      setImagePreview(product.images?.[0]?.url || null);
      setImageFile(null);
      setErrors({});
    }
  };

  // Save (update API)
  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => form.append(`${key}[]`, v));
        } else {
          form.append(key, value as string | Blob);
        }
      });

      if (imageFile) {
        form.append("image", imageFile);
      }

      await updateSingleProduct(id as string, form);

      toast.success("Product updated successfully!");
      router.push("/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (isError)
    return <p className="p-6 text-red-500">Failed to load product</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto container p-6">
        <div className="my-4">
          <button
            onClick={() => router.back()}
            className="flex items-center p-2 gap-2 cursor-pointer border border-[#0694A2] text-[#0694A2] rounded-md transition-colors font-medium hover:bg-[#0694A2] hover:text-white"
          >
            <ArrowLeft />
            Back
          </button>
        </div>

        <h2 className="text-2xl text-teal-600 font-bold mb-8">Edit Product</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Title
              </label>
              <input
                type="text"
                name="title"
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

            {/* Short Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description
              </label>
              <textarea
                name="shortDescription"
                rows={2}
                value={formData.shortDescription}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#0694A2] resize-none ${
                  errors.shortDescription ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.shortDescription && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.shortDescription}
                </p>
              )}
            </div>

            {/* Long Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Long Description
              </label>
              {/* 
              <textarea
                name="longDescription"
                rows={4}
                value={formData.longDescription}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#0694A2] resize-none ${
                  errors.longDescription ? "border-red-500" : "border-gray-300"
                }`}
              /> */}
              <ReactQuill
                value={formData?.longDescription}
                onChange={handleDescriptionChange}
                className="h-96"
                theme="snow"
              />
              {errors.longDescription && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.longDescription}
                </p>
              )}
            </div>

            {/* Price, Category, Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["price", "category", "quantity"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === "category" ? "text" : "number"}
                    name={field}
                    value={
                      formData[field as keyof typeof formData] as
                        | string
                        | number
                        | undefined
                    }
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#0694A2] ${
                      errors[field] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}
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
                      Browse and choose a file to upload
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
  );
};

export default ProductsEditForm;
