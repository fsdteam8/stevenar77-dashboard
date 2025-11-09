"use client";
import { Button } from "@/components/ui/button";
import { updateProfile, getMyProfileData } from "@/lib/api";
import { ChevronLeftIcon, Save, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

interface UserData {
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  street?: string;
  location?: string;
  postCode?: string;
  image?: File | null;
  imageUrl?: string;  
}

interface FormErrors {
  [key: string]: string;
}

const EditProfile: React.FC = () => {
  const [formData, setFormData] = useState<UserData>({});
  const [initialUserData, setInitialUserData] = useState<UserData>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfileData();
        const userData: UserData = {
          ...res.data,
          imageUrl: res.data.image?.url,  
        };
        setFormData(userData);
        setInitialUserData(userData);
        setPreviewImage(userData.imageUrl || null);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const isFormModified = (): boolean =>
    JSON.stringify(formData) !== JSON.stringify(initialUserData);

  const handleInputChange = (field: keyof UserData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));  
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.firstName?.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName?.trim())
      newErrors.lastName = "Last name is required";
    // if (!formData.userName?.trim()) newErrors.userName = "Username is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    if (!formData.phone?.trim()) newErrors.phone = "Phone is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth required";
    if (!formData.street?.trim()) newErrors.street = "Street is required";
    if (!formData.location?.trim()) newErrors.location = "Location is required";
    // if (!formData.postCode?.trim()) newErrors.postCode = "Postcode is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (): Promise<void> => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const token = session?.accessToken;
      if (!token) throw new Error("No token available");
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (!value || key === "imageUrl") return;

        if (key === "image" && value instanceof File) {
          formDataToSend.append(key, value);
        } else if (typeof value === "string") {
          formDataToSend.append(key, value);
        }
      });
      await updateProfile(formDataToSend, token);
      // console.log("Profile updated successfully:", response);
      toast.success("Profile updated successfully");

      // Update initial state
      setInitialUserData(formData);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (): void => {
    setFormData(initialUserData);
    setPreviewImage(initialUserData.imageUrl || null);
    setErrors({});
  };

  return (
    <div className="mx-auto container p-5">
      <ChevronLeftIcon
        className="cursor-pointer text-primary w-10 h-10 mb-8"
        onClick={() => router.back()}
      />

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-6">
          <Image
            src={previewImage || "/images/profile-mini.jpg"}
            className="rounded-full object-cover"
            alt="Profile Image"
            width={120}
            height={120}
          />
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-xl">
              {formData.firstName} {formData.lastName}
            </h2>
            <p>{formData.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="flex flex-col">
          <label className="mb-1">First Name</label>
          <input
            type="text"
            value={formData.firstName || ""}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className="border px-3 py-2 rounded"
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName}</span>
          )}
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label className="mb-1">Last Name</label>
          <input
            type="text"
            value={formData.lastName || ""}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className="border px-3 py-2 rounded"
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName}</span>
          )}
        </div>

        {/* Username */}
        {/* <div className="flex flex-col">
          <label className="mb-1">Username</label>
          <input
            type="text"
            value={formData.userName || ""}
            onChange={(e) => handleInputChange("userName", e.target.value)}
            className="border px-3 py-2 rounded"
          />
          {errors.userName && (
            <span className="text-red-500">{errors.userName}</span>
          )}
        </div> */}

        {/* Email */}
        {/* <div className="flex flex-col">
          <label className="mb-1">Email</label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="border px-3 py-2 rounded"
          />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
        </div> */}

        {/* Phone */}
        <div className="flex flex-col">
          <label className="mb-1">Phone</label>
          <input
            type="tel"
            value={formData.phone || ""}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="border px-3 py-2 rounded"
          />
          {errors.phone && <span className="text-red-500">{errors.phone}</span>}
        </div>

        {/* DOB */}
        <div className="flex flex-col">
          <label className="mb-1">Date of Birth</label>
          <input
            type="date"
            value={formData.dateOfBirth || ""}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            className="border px-3 py-2 rounded"
          />
          {errors.dateOfBirth && (
            <span className="text-red-500">{errors.dateOfBirth}</span>
          )}
        </div>

        {/* Street */}
        <div className="flex flex-col">
          <label className="mb-1">Street</label>
          <input
            type="text"
            value={formData.street || ""}
            onChange={(e) => handleInputChange("street", e.target.value)}
            className="border px-3 py-2 rounded"
          />
          {errors.street && (
            <span className="text-red-500">{errors.street}</span>
          )}
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label className="mb-1">Location</label>
          <input
            type="text"
            value={formData.location || ""}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className="border px-3 py-2 rounded"
          />
          {errors.location && (
            <span className="text-red-500">{errors.location}</span>
          )}
        </div>

        {/* PostCode */}
        {/* <div className="flex flex-col">
          <label className="mb-1">Post Code</label>
          <input
            type="text"
            value={formData.postCode || ""}
            onChange={(e) => handleInputChange("postCode", e.target.value)}
            className="border px-3 py-2 rounded"
          />
          {errors.postCode && (
            <span className="text-red-500">{errors.postCode}</span>
          )}
        </div> */}

        {/* Gender */}
        <div className="flex flex-col">
          <label className="mb-1">Gender</label>
          <select
            value={formData.gender || ""}
            onChange={(e) => handleInputChange("gender", e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            {/* <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option> */}
          </select>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col">
          <label className="mb-1">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border px-3 py-2 rounded"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <Button
          onClick={handleSave}
          disabled={!isFormModified() || isLoading}
          className={`flex items-center gap-2 px-6 py-3 ${
            isFormModified() && !isLoading
              ? "bg-teal-600 hover:bg-teal-700 text-white"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
        >
          <Save className="w-4 h-4" />
          {isLoading ? "Saving..." : "Save"}
        </Button>

        <Button
          onClick={handleCancel}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-transparent border border-red-500 text-red-500 hover:bg-red-50"
        >
          <X className="w-4 h-4" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditProfile;
