"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { postForgotPassword } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ✅ Validation schema
const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgetPassword() {
  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (values: ForgotFormValues) => {
    try {
      const res = await postForgotPassword({ email: values.email });

      if (res?.data?.success === false) {
        toast.error(res?.data?.message || "Something went wrong");
        return;
      }

      const token = res?.data?.accessToken;
      // console.log(token);
      if (token) {
        // redirect(`/verify-otp?token=${token}`);
        router.push(`/verify-otp?token=${token}&mode=forgot`);
      } else {
        toast.error("Token not received, please try again");
      }
    } catch {
      toast.error("Failed to send OTP. Try again");
    }
  };

  return (
    <div className="w-full max-w-lg">
      <h2 className="text-3xl md:text-[48px] font-bold leading-[150%] font-playfair text-[#0694A2] mb-2">
        Forgot Password
      </h2>
      <p className="text-gray-500 mb-6">
        Enter your email to recover your password
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
                    className="h-12 w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-10 bg-[#0694A2] hover:bg-[#0694A2] cursor-pointer"
          >
            Send OTP
          </Button>
        </form>
      </Form>
    </div>
  );
}
