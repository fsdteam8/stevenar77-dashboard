"use client";

import { useState } from "react";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { postChangePassword } from "@/lib/api";
import { toast } from "sonner";

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const [formData, setFormData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check if form has been modified
  const isFormModified = (): boolean => {
    return (
      formData.currentPassword !== "" ||
      formData.newPassword !== "" ||
      formData.confirmPassword !== ""
    );
  };

  const handleInputChange = (
    field: keyof ChangePasswordData,
    value: string
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (
    field: "current" | "new" | "confirm"
  ): void => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      // alert("Please fill in all fields")
      toast.warning("Please fill in all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      // alert("New password and confirm password do not match");
      toast.warning("New password and confirm password do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      // alert("New password must be at least 8 characters long");
      toast.warning("New password must be at least 8 characters long");
      return;
    }

    if (!token) {
      // alert("Unauthorized. Please login again.");
      toast.warning("Unauthorized. Please login again.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await postChangePassword(
        formData.currentPassword,
        formData.newPassword,
        token
      );

      console.log("API Response:", res);
      // alert("Password changed successfully!");
      toast.success("Password changed successfully!")

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      // alert("Failed to change password. Please try again.");
      toast.warning("Error changing password:")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      {/* Back Button */}
      <ChevronLeft className="cursor-pointer text-primary w-8 h-8 mb-6" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Password Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) =>
                  handleInputChange("currentPassword", e.target.value)
                }
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.current ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              placeholder="••••••••"
              className={`pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                formData.confirmPassword !== "" &&
                formData.newPassword !== formData.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.confirm ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {formData.confirmPassword !== "" &&
            formData.newPassword !== formData.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                Passwords do not match
              </p>
            )}
        </div>

        {/* Action Button */}
        <div className="flex justify-start mt-8">
          <Button
            type="submit"
            disabled={
              !isFormModified() ||
              isLoading ||
              formData.newPassword !== formData.confirmPassword
            }
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
