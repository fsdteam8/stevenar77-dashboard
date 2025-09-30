"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useEffect } from "react";
import { useSocial, useUpdateSocial } from "@/hooks/social";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(5, "Phone number too short"),
  location: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
});

const Social = () => {
  type SocialFormValues = z.infer<typeof formSchema>;

  const form = useForm<SocialFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      phoneNumber: "",
      location: "",
      facebook: "",
      instagram: "",
    },
  });

  // fetch existing social data
  const { data: socialData, isLoading } = useSocial();
  const id: string = socialData?.data?.[0]?._id || "";

  useEffect(() => {
    if (socialData?.data?.[0]) {
      const { email, phoneNumber, location, facebook, instagram } =
        socialData.data[0];
      form.reset({ email, phoneNumber, location, facebook, instagram });
    }
  }, [socialData, form]);

  const mutation = useUpdateSocial(id);

  const onSubmit = (values: SocialFormValues) => {
    mutation.mutate(values);
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" /> 
          <Skeleton className="h-10 w-full" /> 
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-24 rounded-lg" />
      </section>
    );
  }

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input placeholder="Facebook profile link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input placeholder="Instagram profile link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Submit"}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default Social;
