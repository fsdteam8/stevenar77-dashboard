"use client";
import React, { useState } from "react";
import { Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const ShopCreateForm = () => {
    const [formData, setFormData] = useState({
      productTitle: "",
      productLevel: "In Stock",
      description: "",
      price: "",
      locations: "",
      timeSlots: "",
      startDate: "",
      endDate: "",
      
    });
  
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
    };
    
  
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto container ">
          <div className="p-6">
            <h2 className="text-2xl text-teal-600 font-bold mb-8">
              Create New Product 
            </h2>
  
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                {/* Course Title and Level Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product  Title
                    </label>
                    <input
                      type="text"
                      name="courseTitle"
                      placeholder="Write Here"
                      value={formData.productTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status 
                    </label>
                    <select
                      name="courseLevel"
                      value={formData.productLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none appearance-none bg-white"
                    >
                      <option value="Advanced">In Stock</option>
                      <option value="Beginner">Low on Stock </option>
                      <option value="Intermediate">Out of Stock </option>
                    </select>
                  </div>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
  
                {/* Price and Duration Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="text"
                      name="price"
                      placeholder="Write Here"
                      value={formData.price}
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
                      type="text"
                      name="startDate"
                      placeholder="MM/DD/YYYY"
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
                      type="text"
                      name="endDate"
                      placeholder="MM/DD/YYYY"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
  
                
              </div>
  
              {/* Right Column - Upload Photo */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6  rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Upload Photo
                  </h3>
  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-500 mb-4">
                      Browse and chose the files you want to upload from your
                      computer
                    </p>
  
                    <Button className="inline-flex items-center   justify-center w-10 h-10 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors">
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
  
                {/* Action Buttons */}
                <div className="flex justify-end w-full gap-6 mt-12 px-2">
                  <Button className="px-6 py-3 border w-1/2 cursor-pointer border-red-300 text-red-600 rounded-md bg-transparent hover:bg-red-50 font-medium">
                    Cancel
                  </Button>
                  <Button className="px-8 py-3 w-1/2 cursor-pointer bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-medium">
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );


}

export default ShopCreateForm