"use client";

import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyOTP() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otpValue, setOtpValue] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(60);

  const searchParams = useSearchParams();
  const token = encodeURIComponent(searchParams.get("token") || "");
  const mode =
    (searchParams.get("mode") as "register" | "forgot") || "register";

  // Load email from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("userEmail");
      setEmail(storedEmail);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // React Hook Form
  const form = useForm({ defaultValues: { otp: "" } });

  // Handle OTP input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const val = e.target.value.replace(/\D/, "");
    if (!val) return;
    const newOtp = [...otpValue];
    newOtp[index] = val;
    setOtpValue(newOtp);
    if (index < 5) inputRefs.current[index + 1]?.focus();
  };

  // Handle backspace
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otpValue];
      newOtp[index] = "";
      setOtpValue(newOtp);
      if (index > 0) inputRefs.current[index - 1]?.focus();
    }
  };
 

  // Submit OTP
  const onSubmit = async () => {
    const otp = otpValue.join("");
    if (!otp) return toast.warning("Please enter the OTP");
    if (!token) return toast.error("Token not found. Please try again.");

    setLoading(true);
    try {
      const url =
        mode === "register"
          ? `${process.env.NEXT_PUBLIC_API_URL}/user/verify-email`
          : `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otp }),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Verification failed");

      setOtpValue(Array(6).fill(""));
      form.reset();
      toast.success(result.message || "OTP verified successfully");

      // Redirect after success
      if (mode === "register") {
        router.push("/login");
      } else {
        router.push(`/reset-password?token=${token}`);
      }
    } catch   {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl">
      <h1 className="text-[#0694A2] text-3xl md:text-[40px] font-bold mb-2">
        Enter OTP
      </h1>
      <p className="text-gray-500 mb-6">
        We’ve sent a 6-digit code to your email:{" "}
        <span className="font-semibold text-[#131313]">{email}</span>
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="otp"
            render={() => (
              <FormItem>
                <div className="flex justify-between gap-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otpValue[index] || ""}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      className="h-16 w-14 md:w-16 text-center text-2xl font-bold border-gray-300 focus:ring-2 focus:ring-[#0694A2]"
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Timer + Resend */}
          <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-1">
              <span>⏱</span>
              <span>
                {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                {String(timeLeft % 60).padStart(2, "0")}
              </span>
            </div>
            <div>
              Didn’t get a code?{" "}
              <button
                disabled={timeLeft > 0}
                className={`${
                  timeLeft > 0
                    ? "text-[#0694A2] cursor-not-allowed"
                    : "text-[#0694A2] hover:underline cursor-pointer"
                }`}
              >
                Resend
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="bg-[#0694A2] hover:bg-[#0c7b99] text-white h-12 w-full rounded-md text-base font-semibold shadow-md flex items-center justify-center cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
