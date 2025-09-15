"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
// import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ✅ Zod validation schema
const createAccountSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
    terms: z.boolean().refine((val) => val, "You must accept terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type CreateAccountFormValues = z.infer<typeof createAccountSchema>;

export default function CreateAccount() {
  const [showPassword, setShowPassword] = useState(false);
  //   const { signUp, loading, error } = useAuth();
  const router = useRouter();

  const form = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (values: CreateAccountFormValues) => {
    // try {
    //   const res = await signUp({
    //     firstName: values.firstName,
    //     lastName: values.lastName,
    //     email: values.email,
    //     password: values.password,
    //   });
    //   const token = res?.data?.accessToken;
    //   // if (typeof window !== "undefined") {
    //   //   localStorage.setItem("userEmail", values.email);
    //   //   if (token) {
    //   //     localStorage.setItem("accessToken", token);
    //   //   }
    //   // }
    //   // console.log(res)
    //   toast.success("Account created successfully!");
    //   form.reset();
    //   router.push( `/verify-otp?token=${token}&mode=register`);
    // } catch (error) {
    //   console.error("Registration failed:", error);
    //   toast.error("Something went wrong. Please try again.");
    // }
  };

  return (
    <div className="flex items-center justify-center bg-white py-10 px-4">
      <div className="w-full max-w-lg">
        <h2 className="text-3xl md:text-[40px] font-playfair font-bold text-[#0694A2] mb-2">
          Create Your Account
        </h2>
        <p className="text-gray-500 text-sm md:text-[16px] mb-6">
          Connect families with trusted care join today.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* First & Last Name */}
            <div className="flex flex-col md:flex-row gap-2">
              {["firstName", "lastName"].map((fieldName, idx) => (
                <FormField
                  key={idx}
                  control={form.control}
                  name={fieldName as "firstName" | "lastName"}
                  render={({ field }) => (
                    <FormItem className="md:w-1/2">
                      <FormLabel>
                        {fieldName === "firstName" ? "First Name" : "Last Name"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name Here"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="hello@example.com"
                      {...field}
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password & Confirm Password */}
            {["password", "confirmPassword"].map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName as "password" | "confirmPassword"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {fieldName === "password"
                        ? "Create Password"
                        : "Confirm Password"}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          {...field}
                          className="h-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-3 flex items-center h-10"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            {/* Terms */}
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 cursor-pointer">
                  <FormControl>
                    <Checkbox
                      className="cursor-pointer"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm text-gray-600">
                    I agree to The Real Life&apos;s{" "}
                    <a href="/terms" className="text-[#0694A2] underline">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-[#0694A2] underline">
                      Privacy Policy
                    </a>
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            {/* <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-[#0694A2] hover:bg-[#0694A2] cursor-pointer"
            >
              {loading ? "Creating..." : "Sign Up"}
            </Button> */}

            <button className="w-full h-10 bg-[#0694A2] hover:bg-[#0694A2] cursor-pointer rounded-md text-white">
              Sign Up
            </button>

            {/* API Error */}
            {/* {error && <p className="text-red-500 mt-2 text-sm">{error}</p>} */}
          </form>
        </Form>

        {/* Already have account */}
        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-[#0694A2] font-medium hover:underline"
          >
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
