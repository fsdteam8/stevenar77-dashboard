"use client";
import React, { useState } from "react";
import { Upload, Plus, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProduct } from "@/hooks/useProducts";

// ✅ Zod schema
const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Short Description is required"),
  category: z.string().min(1, "Category is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a valid number",
    }),
  longDescription: z.string().min(1, "Long Description is required"),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Quantity must be a number",
    }),
  featured: z.array(z.string()).optional(),
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => !!file, { message: "Image is required" }),
});

type ProductForm = z.infer<typeof productSchema>;

export default function ProductCreateForm() {
  const router = useRouter();
  const { mutate: createProductMutate, isPending } = useCreateProduct();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      category: "",
      price: "",
      longDescription: "",
      quantity: "",
      featured: [],
    },
  });

  const [newFeatured, setNewFeatured] = useState("");

  // Add featured
  const handleAddFeatured = () => {
    if (newFeatured.trim()) {
      const current = getValues("featured") || [];
      if (!current.includes(newFeatured.trim())) {
        setValue("featured", [...current, newFeatured.trim()]);
      }
      setNewFeatured("");
    }
  };

  // Remove featured
  const handleRemoveFeatured = (tag: string) => {
    const current = getValues("featured") || [];
    setValue(
      "featured",
      current.filter((item) => item !== tag)
    );
  };

  // Image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit
  const onSubmit = (data: ProductForm) => {
    const formData = new FormData();

    // Basic fields
    formData.append("title", data.title);
    formData.append("shortDescription", data.shortDescription);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("longDescription", data.longDescription);
    formData.append("quantity", data.quantity);

    // Featured tags array
    (data.featured || []).forEach((tag) => {
      formData.append("featured[]", tag);
    });

    // Image
    if (data.image) {
      formData.append("image", data.image);
    }

    createProductMutate(formData, {
      onSuccess: () => {
        toast.success("✅ Product created successfully!");
        reset();
        setImagePreview(null);
        router.push("/products"); // চাইলে product list এ redirect করতে পারেন
      },
      onError: () => {
        toast.error("❌ Failed to create product!");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto container">
        <div className="p-6">
          {/* Back */}
          <div className="my-4">
            <button
              onClick={() => router.back()}
              className="flex items-center p-2 gap-2 cursor-pointer border border-[#0694A2] text-[#0694A2] rounded-md hover:bg-[#0694A2] hover:text-white"
            >
              <ArrowLeft />
              Back
            </button>
          </div>

          <h2 className="text-2xl text-teal-600 font-bold mb-8">
            Create New Product
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm mb-2">Title</label>
                <input
                  {...register("title")}
                  placeholder="Product Title"
                  className="w-full px-4 py-3 border rounded-lg"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm mb-2">Short Description</label>
                <input
                  {...register("shortDescription")}
                  placeholder="Short description"
                  className="w-full px-4 py-3 border rounded-lg"
                />
                {errors.shortDescription && (
                  <p className="text-red-500 text-sm">
                    {errors.shortDescription.message}
                  </p>
                )}
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2">Category</label>
                  <input
                    {...register("category")}
                    placeholder="Category"
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                  {errors.category && (
                    <p className="text-red-500 text-sm">
                      {errors.category.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm mb-2">Price</label>
                  <input
                    type="number"
                    {...register("price")}
                    placeholder="Price"
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">
                      {errors.price.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm mb-2">Quantity</label>
                <input
                  type="number"
                  {...register("quantity")}
                  placeholder="Quantity"
                  className="w-full px-4 py-3 border rounded-lg"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm">
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              {/* Long Description */}
              <div>
                <label className="block text-sm mb-2">Long Description</label>
                <textarea
                  rows={4}
                  {...register("longDescription")}
                  placeholder="Write product details"
                  className="w-full px-4 py-3 border rounded-lg"
                />
                {errors.longDescription && (
                  <p className="text-red-500 text-sm">
                    {errors.longDescription.message}
                  </p>
                )}
              </div>

              {/* Featured */}
              <div>
                <label className="block text-sm mb-2">Featured Tags</label>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {(getValues("featured") || []).map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-2 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <X
                        size={16}
                        className="cursor-pointer"
                        onClick={() => handleRemoveFeatured(tag)}
                      />
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newFeatured}
                    onChange={(e) => setNewFeatured(e.target.value)}
                    placeholder="Add featured tag"
                    className="flex-1 px-4 py-2 border rounded-lg"
                  />
                  <Button
                    type="button"
                    onClick={handleAddFeatured}
                    className="bg-[#0694A2] text-white"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Right - Upload */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-medium mb-4">Upload Image</h3>
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 text-center flex flex-col items-center justify-center"
                >
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={160}
                      height={160}
                      className="w-40 h-40 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-500 mb-4">
                        Browse and choose an image
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
                  <p className="text-red-500 text-sm">{errors.image.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-6 mt-6">
                <Button
                  type="button"
                  onClick={() => {
                    reset();
                    setImagePreview(null);
                  }}
                  disabled={isSubmitting}
                  className="px-6 py-3 border w-1/2 border-red-300 text-red-600 bg-transparent hover:bg-red-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="px-8 py-3 w-1/2 bg-[#0694A2] text-white hover:bg-[#057f89] flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
