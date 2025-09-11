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
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

// ✅ Zod validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
 
     await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    redirect("/dashboard");
 
  };

  return (
    <div className="w-full max-w-lg">
      <h2 className="text-3xl md:text-[40px] font-bold leading-[150%] font-playfair text-[#0694A2] mb-2">
        Welcome
      </h2>
      <p className="text-gray-500 mb-6">
        Access your account to manage tours, leads, and listings
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] leading-[150%] font-medium text-[#343A40]">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="hello@example.com"
                    className="h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password with toggle */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] leading-[150%] font-medium text-[#343A40]">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      className="h-12"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember + Forgot */}
          <div className="flex justify-between items-center">
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      className="cursor-pointer"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-[16px] text-[#6C757D]">
                    Remember me
                  </FormLabel>
                </FormItem>
              )}
            />

            <a
              href="/forget-password"
              className="text-[#0694A2] text-sm border-b border-gray-400 cursor-pointer"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-10 bg-[#0694A2] hover:bg-[#0694A2] cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : "Log In"}
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm">
        Don&apos;t have an account?{" "}
        <a
          href="/create-account"
          className="text-[#0694A2] font-medium hover:underline cursor-pointer"
        >
          Sign Up
        </a>
      </p>
    </div>
  );
}
