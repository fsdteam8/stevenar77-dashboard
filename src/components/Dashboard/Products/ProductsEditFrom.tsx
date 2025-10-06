"use client";
import React, { useState, useEffect } from "react";
import { Upload, Plus, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useSingleProduct } from "@/hooks/useProducts";
import { updateSingleProduct } from "@/lib/api";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

// ✅ Define types
interface VariantType {
  title: string;
  quantity: number;
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // ✅ Load product data
  useEffect(() => {
    if (!product) return;

    const variants: VariantType[] =
      product.variants?.map((v) => ({
        title: v.title ?? v.title ?? "",
        quantity: v.variantsQuantity
          ? Number(v.variantsQuantity)
          : v.quantity
          ? Number(v.quantity)
          : 0,
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

    if (product.images?.length) {
      setImagePreview(product.images[0].url);
    }
  }, [product]);

  // ✅ Input handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = type === "checkbox" ? target.checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Variant handler
  const handleVariantChange = (
    index: number,
    field: keyof VariantType,
    value: string
  ) => {
    setFormData((prev) => {
      const updatedVariants = [...prev.variants];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: field === "quantity" ? Number(value) || 0 : value,
      };
      return { ...prev, variants: updatedVariants };
    });
  };

  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { title: "", quantity: 0 }],
    }));
  };

  const handleRemoveVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, longDescription: value }));
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
        title: v.title ?? v.title ?? "",
        quantity: v.variantsQuantity
          ? Number(v.variantsQuantity)
          : v.quantity
          ? Number(v.quantity)
          : 0,
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
  };

  // ✅ Save form
  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "variants" && Array.isArray(value)) {
          (value as VariantType[]).forEach((v, index) => {
            form.append(`variants[${index}][title]`, v.title);
            form.append(`variants[${index}][quantity]`, v.quantity.toString());
          });
        } else if (Array.isArray(value)) {
          value.forEach((v) => form.append(`${key}[]`, v.toString()));
        } else if (value !== undefined && value !== null) {
          form.append(key, value.toString());
        }
      });

      if (imageFile) form.append("image", imageFile);

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

            {/* ✅ Variants Section */}
            <div className="mt-10">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  Product Variants
                </h3>
                <Button
                  type="button"
                  onClick={handleAddVariant}
                  className="bg-[#0694A2] text-white hover:bg-[#057f89]"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Variant
                </Button>
              </div>

              {formData.variants.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No variants added yet. Click “Add Variant”.
                </p>
              )}

              <div className="space-y-4 mt-3">
                {formData.variants.map((variant, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border p-4 rounded-lg "
                  >
                    <input
                      type="text"
                      placeholder="Example: Red"
                      value={variant.title}
                      onChange={(e) =>
                        handleVariantChange(index, "title", e.target.value)
                      }
                      className="px-3 py-2 border rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="10"
                      value={variant.quantity}
                      onChange={(e) =>
                        handleVariantChange(index, "quantity", e.target.value)
                      }
                      className="px-3 py-2 border rounded-md"
                    />
                    <button
                      onClick={() => handleRemoveVariant(index)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                ))}
              </div>
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
