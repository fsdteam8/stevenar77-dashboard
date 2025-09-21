"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMyProfileData } from "@/lib/api";
import { ChevronLeftIcon, PencilLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  role?: string;
  isVerified?: boolean;
  street?: string;
  location?: string;
  image?: {
    url?: string;
  };
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfileData();
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p className="p-5">Loading profile...</p>;
  }

  if (!user) {
    return <p className="p-5 text-red-500">Failed to load profile data.</p>;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="mx-auto container p-5">
        <ChevronLeftIcon
          className="cursor-pointer text-primary w-10 h-10 mb-8"
          onClick={() => router.back()}
        />

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Image
              src={user.image?.url || "/images/profile-mini.jpg"}
              className="rounded-full object-center"
              alt="Profile Image"
              width={100}
              height={100}
            />
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold text-xl">
                {`${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                  "N/A"}
              </h2>
              <p>{user.email || "N/A"}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href={"/profile/changePassword"}>
              <Button className="bg-transparent border text-primary hover:text-white border-primary ">
                Change Password
              </Button>
            </Link>
            <Link href={"/profile/updateProfile"}>
              <Button className="bg-primary hover:bg-teal-700 border-teal-600 hover:border-teal-700 flex items-center gap-2">
                <PencilLine /> Update Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid lg:grid-cols-3 gap-6 mt-10">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Profile Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  First Name
                </label>
                <Input value={user.firstName || "N/A"} disabled />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Last Name
                </label>
                <Input value={user.lastName || "N/A"} disabled />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Email
                </label>
                <Input value={user.email || "N/A"} disabled />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Phone Number
                </label>
                <Input value={user.phone || "N/A"} disabled />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Gender
                </label>
                <Input value={user.gender || "N/A"} disabled />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Date of Birth
                </label>
                <Input value={formatDate(user.dateOfBirth)} disabled />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Role
                </label>
                <Input value={user.role || "N/A"} disabled />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Verified
                </label>
                <Input value={user.isVerified ? "Yes" : "No"} disabled />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Address
                </label>
                <Input
                  value={`${user.street || "N/A"}, ${user.location || "N/A"}`}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
