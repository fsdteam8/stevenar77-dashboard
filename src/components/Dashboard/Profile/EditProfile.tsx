"use client"
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, PencilLine, Save, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface UserData {
  fullName: string;
  userName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  address: string;
}

interface FormErrors {
  fullName?: string;
  userName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  address?: string;
}

const EditProfile: React.FC = () => {
  // Sample user data (you can replace this with props or state from API)
  const initialUserData: UserData = {
    fullName: "Jenny Wilson",
    userName: "Jenny",
    email: "example@example.com",
    phone: "9394-08590",
    gender: "Male",
    dob: "2003-04-05",
    address: "0000 Mohakhali",
  };

  // Form state
  const [formData, setFormData] = useState<UserData>(initialUserData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Check if form has been modified
  const isFormModified = (): boolean => {
    return JSON.stringify(formData) !== JSON.stringify(initialUserData);
  };

  // Handle input changes
  const handleInputChange = (field: keyof UserData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSave = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // API call would go here
      // const response = await updateUserProfile(formData);
      
      // Simulate API call
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      
      console.log('Profile updated:', formData);
      // You can add success notification here
      
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error (show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = (): void => {
    setFormData(initialUserData);
    setErrors({});
  };

  // Format date for display
  // const formattedDob: string = formData.dob ? new Date(formData.dob).toLocaleDateString(undefined, {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // }) : '';

  return (
    <div>
      <div className="mx-auto container p-5">
        <ChevronLeftIcon className="cursor-pointer text-primary w-10 h-10 mb-8" />
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-6">
            <Image
              src={"/images/profile-mini.jpg"}
              className="rounded-full"
              alt="Admin Profile Image"
              width={120}
              height={120}
            />
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold text-xl">{formData.fullName}</h2>
              <p>{formData.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href={"/profile/changePassword"}>
            <Button className="bg-transparent border text-primary hover:text-white border-primary">
              Change Password
            </Button>
            </Link>
            <Button 
              className={`border-teal-600 hover:border-teal-700 flex items-center gap-2 ${
                isFormModified() && !isLoading 
                  ? 'bg-primary hover:bg-teal-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!isFormModified() || isLoading}
            >
              <PencilLine /> Update Profile
            </Button>
          </div>
        </div>

        <div className="update-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="flex flex-col">
              <label htmlFor="fullName" className="text-sm font-medium mb-2 text-gray-700">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('fullName', e.target.value)}
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full name"
              />
              {errors.fullName && <span className="text-red-500 text-sm mt-1">{errors.fullName}</span>}
            </div>

            {/* User Name */}
            <div className="flex flex-col">
              <label htmlFor="userName" className="text-sm font-medium mb-2 text-gray-700">
                User Name
              </label>
              <input
                id="userName"
                type="text"
                value={formData.userName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('userName', e.target.value)}
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                  errors.userName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter username"
              />
              {errors.userName && <span className="text-red-500 text-sm mt-1">{errors.userName}</span>}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium mb-2 text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
              />
              {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <label htmlFor="phone" className="text-sm font-medium mb-2 text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter phone number"
              />
              {errors.phone && <span className="text-red-500 text-sm mt-1">{errors.phone}</span>}
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col">
              <label htmlFor="dob" className="text-sm font-medium mb-2 text-gray-700">
                Date Of Birth
              </label>
              <input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('dob', e.target.value)}
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                  errors.dob ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dob && <span className="text-red-500 text-sm mt-1">{errors.dob}</span>}
            </div>

            {/* Gender */}
            <div className="flex flex-col">
              <label htmlFor="gender" className="text-sm font-medium mb-2 text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('gender', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Address - Full width */}
            <div className="flex flex-col md:col-span-2">
              <label htmlFor="address" className="text-sm font-medium mb-2 text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('address', e.target.value)}
                rows={3}
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full address"
              />
              {errors.address && <span className="text-red-500 text-sm mt-1">{errors.address}</span>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <Button
              onClick={handleSave}
              disabled={!isFormModified() || isLoading}
              className={`flex items-center gap-2 px-6 py-3 ${
                isFormModified() && !isLoading
                  ? 'bg-teal-600 hover:bg-teal-700 text-white'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save'}
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
      </div>
    </div>
  );
};

export default EditProfile;