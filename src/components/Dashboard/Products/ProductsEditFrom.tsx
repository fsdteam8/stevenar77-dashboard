"use client";
import React, { useState, useEffect } from "react";
import {
  Upload,
  Plus,
  ArrowLeft,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useSingleProduct } from "@/hooks/useProducts";
import { updateSingleProduct } from "@/lib/api";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

// ✅ Types
interface VariantType {
  title: string;
  quantity: number;
  image?: string | File;
}

interface ProductFormData {
  title: string;
  shortDescription: string;
  longDescription: string;
  price: string;
  category: string;
  quantity: string;
  inStock: boolean;
  featured: string[];
  variants: VariantType[];
}

interface ProductData {
  title?: string;
  shortDescription?: string;
  longDescription?: string;
  price?: number | string;
  category?: string;
  quantity?: number | string;
  inStock?: boolean;
  featured?: string[];
  images?: { url: string }[];
  variants?: {
    variantsTitle?: string;
    variantsQuantity?: string | number;
    title?: string;
    quantity?: string | number;
    image?: { url: string };
  }[];
}

const ProductsEditForm: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, isError } = useSingleProduct(id as string);
  const product: ProductData | undefined = data?.data;

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    shortDescription: "",
    longDescription: "",
    price: "",
    category: "",
    quantity: "",
    inStock: true,
    featured: [],
    variants: [],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [variantPreviews, setVariantPreviews] = useState<(string | null)[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // ✅ Load product data
  useEffect(() => {
    if (!product) return;

    const variants: VariantType[] =
      product.variants?.map((v) => ({
        title: v.title ?? "",
        quantity: v.variantsQuantity
          ? Number(v.variantsQuantity)
          : v.quantity
          ? Number(v.quantity)
          : 0,
        image: v.image?.url ?? undefined,
      })) ?? [];

    setFormData({
      title: product.title ?? "",
      shortDescription: product.shortDescription ?? "",
      longDescription: product.longDescription ?? "",
      price: product.price?.toString() ?? "",
      category: product.category ?? "",
      quantity: product.quantity?.toString() ?? "",
      inStock: product.inStock ?? true,
      featured: product.featured ?? [],
      variants,
    });

    setImagePreview(product.images?.[0]?.url ?? null);
    setVariantPreviews(
      variants.map((v) => (typeof v.image === "string" ? v.image : null))
    );
  }, [product]);

  // ✅ Input handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, longDescription: value }));
  };

  // ✅ Variant handlers
  const handleVariantChange = (
    index: number,
    field: keyof VariantType,
    value: string | File
  ) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[index] = {
        ...updated[index],
        [field]: field === "quantity" ? Number(value) || 0 : value,
      };
      return { ...prev, variants: updated };
    });

    if (field === "image" && value instanceof File) {
      const previews = [...variantPreviews];
      previews[index] = URL.createObjectURL(value);
      setVariantPreviews(previews);
    }
  };

  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { title: "", quantity: 0 }],
    }));
    setVariantPreviews((prev) => [...prev, null]);
  };

  const handleRemoveVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
    setVariantPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  // ✅ Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.shortDescription.trim())
      newErrors.shortDescription = "Short description is required";
    if (!formData.longDescription.trim())
      newErrors.longDescription = "Long description is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Reset form
  const resetForm = () => {
    if (!product) return;
    const variants: VariantType[] =
      product.variants?.map((v) => ({
        title: v.title ?? "",
        quantity: v.variantsQuantity
          ? Number(v.variantsQuantity)
          : v.quantity
          ? Number(v.quantity)
          : 0,
        image: v.image?.url ?? undefined,
      })) ?? [];

    setFormData({
      title: product.title ?? "",
      shortDescription: product.shortDescription ?? "",
      longDescription: product.longDescription ?? "",
      price: product.price?.toString() ?? "",
      category: product.category ?? "",
      quantity: product.quantity?.toString() ?? "",
      inStock: product.inStock ?? true,
      featured: product.featured ?? [],
      variants,
    });

    setImagePreview(product.images?.[0]?.url ?? null);
    setVariantPreviews(
      variants.map((v) => (typeof v.image === "string" ? v.image : null))
    );
  };

  // ✅ Save form
  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const form = new FormData();

      // Append main product fields
      form.append("title", formData.title);
      form.append("shortDescription", formData.shortDescription);
      form.append("longDescription", formData.longDescription);
      form.append("price", formData.price);
      form.append("category", formData.category);
      form.append("quantity", formData.quantity);
      form.append("inStock", String(formData.inStock));

      formData.featured.forEach((f) => form.append("featured[]", f));

      // Append main image
      if (imageFile) {
        form.append("image", imageFile);
      }

      // Prepare variants JSON and images
      const variantsPayload = formData.variants.map((v, index) => {
        // Append each variant image separately
        if (v.image instanceof File) {
          form.append(`variant_${index}`, v.image);
        }

        // Return variant data for JSON body (exclude image file)
        return {
          title: v.title,
          quantity: Number(v.quantity),
          // Preserve existing image URL if not replaced
          image:
            typeof v.image === "string"
              ? { url: v.image }
              : v.image instanceof File
              ? null // handled by file field
              : null,
        };
      });

      // Send variants as JSON string (without file content)
      form.append("variants", JSON.stringify(variantsPayload));

      await updateSingleProduct(id as string, form);
      toast.success("✅ Product updated successfully!");
      router.push("/products");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-teal-50">
          <Loader2 className="animate-spin text-[#0694A2] w-8 h-8" />
        </div>
        <p className="mt-4 text-gray-600 text-lg font-medium">Loading...</p>
      </div>
    );
  if (isError)
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50">
          <AlertCircle className="text-red-500 w-8 h-8" />
        </div>
        <p className="mt-4 text-red-600 text-lg font-medium">
          Failed to load product
        </p>
        <p className="text-gray-500 text-sm mt-1">Please try again later.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto container p-6">
        <div className="my-4">
          <button
            onClick={() => router.back()}
            className="flex items-center p-2 gap-2 border border-[#0694A2] text-[#0694A2] rounded-md hover:bg-[#0694A2] hover:text-white font-medium"
          >
            <ArrowLeft /> Back
          </button>
        </div>

        <h2 className="text-2xl text-teal-600 font-bold mb-8">Edit Product</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg ${
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
                className={`w-full px-4 py-3 border rounded-lg resize-none ${
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
              <ReactQuill
                value={formData.longDescription}
                onChange={handleDescriptionChange}
                className="h-96"
                theme="snow"
              />
              {errors.longDescription && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.longDescription}
                </p>
              )}
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            {/* ✅ Product Variants Section */}
            <div className="mt-10">
              <div className="flex flex-wrap justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Product Variants
                </h3>
                <Button
                  type="button"
                  onClick={handleAddVariant}
                  className="bg-[#0694A2] hover:bg-[#057f89] text-white flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Variant
                </Button>
              </div>

              {formData.variants.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  No variants added yet. Click <b>Add Variant</b> to create one.
                </p>
              ) : (
                <div className="space-y-5">
                  {formData.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-5 gap-4 border border-gray-200 p-4 rounded-xl shadow-sm bg-white transition hover:shadow-md"
                    >
                      {/* Variant Title */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                          Variant Title
                        </label>
                        <input
                          type="text"
                          placeholder="Example: Red"
                          value={variant.title}
                          onChange={(e) =>
                            handleVariantChange(index, "title", e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0694A2]"
                        />
                      </div>

                      {/* Quantity */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          placeholder="10"
                          value={variant.quantity}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0694A2]"
                        />
                      </div>

                      {/* Variant Image */}
                      <div className="flex flex-col items-center justify-center">
                        <label className="text-sm font-medium text-gray-600 mb-2">
                          Image
                        </label>
                        <label className="relative w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                          {variantPreviews[index] ? (
                            <Image
                              src={variantPreviews[index] as string}
                              alt="Variant"
                              fill
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <div className="flex flex-col items-center text-gray-400">
                              <Upload className="w-5 h-5 mb-1" />
                              <span className="text-xs">Upload</span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              e.target.files &&
                              handleVariantChange(
                                index,
                                "image",
                                e.target.files[0]
                              )
                            }
                          />
                        </label>
                      </div>

                      {/* Remove Button */}
                      <div className="flex items-end justify-center md:col-span-2">
                        <button
                          onClick={() => handleRemoveVariant(index)}
                          type="button"
                          className="flex items-center gap-1 text-red-500 hover:text-red-600 transition text-sm"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Upload Photo
              </h3>

              <label
                htmlFor="image-upload"
                className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 flex flex-col items-center justify-center"
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
            </div>

            {/* Buttons */}
            <div className="flex justify-end w-full gap-6 mt-6 px-2">
              <Button
                className="w-1/2 border border-red-300 text-red-600 bg-transparent hover:bg-red-50"
                onClick={resetForm}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="w-1/2 bg-[#0694A2] text-white hover:bg-[#057f89]"
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
