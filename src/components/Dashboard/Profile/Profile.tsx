import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  PencilLine,
} from "lucide-react";
import Image from "next/image";
import React from "react";

const Profile = () => {
  // Sample user data (you can replace this with props or state)
  const user = {
    fullName: "Jhonathon Smith",
    userName: "JhonSmith",
    email: "jhon@gmail.com",
    phone: "+1 123 456 7890",
    gender: "Male",
    dob: "1990-05-15",
    address: "123 Main St, Springfield, USA",
  };

  // Format date to a readable format
  const formattedDob = new Date(user.dob).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <div className="mx-auto container p-5">
        <ChevronLeftIcon className="cursor-pointer text-primary w-10 h-10 mb-8" />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Image
              src={"/images/profile-mini.jpg"}
              className="rounded-full"
              alt="Admin Profile Image"
              width={120}
              height={120}
            />
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold text-xl">{user.fullName}</h2>
              <p>{user.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-transparent border text-primary hover:text-white border-primary ">
              Change Password
            </Button>
            <Button className="bg-primary hover:bg-teal-700 border-teal-600 hover:border-teal-700 flex items-center gap-2">
              <PencilLine /> Update Profile
            </Button>
          </div>
        </div>
        <div>
          <div className="grid lg:grid-cols-3 gap-6 mt-10">
            {/* Left Column - Profile Display */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Profile Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </h4>
                  <p className="text-gray-900">{user.fullName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    User Name
                  </h4>
                  <p className="text-gray-900">{user.userName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Email</h4>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </h4>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Gender</h4>
                  <p className="text-gray-900">{user.gender}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </h4>
                  <p className="text-gray-900">{formattedDob}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Address</h4>
                  <p className="text-gray-900">{user.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
