"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useGetSingleTemplate, useUpdateTemplate } from "@/hooks/templates";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const templateSchema = z.object({
  name: z.string().min(2, "Template name is required"),
  subject: z.string().min(2, "Subject is required"),
  type: z.enum(["courses", "product", "trips"]),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

export default function EditTemplates() {
  const router = useRouter();
  const params = useParams();  
  const templateId = params?.id;  


  const [showPreview, setShowPreview] = useState(false);

  // Fetch the single template
  const { data: template, isLoading, isError, error } =
    useGetSingleTemplate(templateId || "");
    console.log(template)

  // Update mutation
  const { mutate: updateTemplate, isPending } = useUpdateTemplate();

  // Initialize form
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      subject: "",
      type: "courses",
      message: "",
    },
  });

  // Populate form once template is loaded
  useEffect(() => {
    if (template) {
      form.reset({
        name: template.tempName || "",
        subject: template.emailSubject || "",
        type: template.type || "courses",
        message: template.messageBody || "",
      });
    }
  }, [template, form]);

  // Form submit handler
  const onSubmit = (values: TemplateFormValues) => {
    if (!templateId) return;

    const payload = {
      tempName: values.name,
      emailSubject: values.subject,
      type: values.type,
      status: template?.status || "deactive",
      messageBody: values.message,
    };

    updateTemplate(
      { id: templateId, data: payload },
      {
        onSuccess: () => {
          router.push("/send-email");
        },
      }
    );
  };

  if (!templateId)
    return <p className="p-8 text-red-500">Invalid template ID.</p>;
  if (isLoading)
    return <p className="p-8 text-gray-700">Loading template...</p>;
  if (isError)
    return (
      <p className="p-8 text-red-500">
        Error: {error?.message || "Something went wrong"}
      </p>
    );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <Link
          href="/send-email"
          className="inline-flex items-center  gap-2 text-blue-600 font-medium hover:text-blue-700 transition border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100"
        >
          <ArrowLeft size={18} />
          Back to Templates
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Edit Email Template
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Form */}
        <Card className="flex-1 shadow-sm border border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Template Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Template Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter template name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subject */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="courses">Courses</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="trips">Trips</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message (Email Body)</FormLabel>
                      <FormControl>
                        <ReactQuill
                          value={field.value}
                          onChange={field.onChange}
                          theme="snow"
                          className="h-64"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-4 mt-10">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    {showPreview ? "Hide Preview" : "Preview"}
                  </Button>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                  >
                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isPending ? "Updating..." : "Update Template"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Right: Preview */}
        {showPreview && (
          <Card className="flex-1 shadow-sm border border-gray-200 rounded-xl">
            <CardHeader>
              <CardTitle>Template Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="border rounded-xl bg-gray-50 overflow-hidden">
                <div className="px-6 py-4 border-b bg-gray-100">
                  <p>
                    <strong>Template Name:</strong> {form.getValues("name")}
                  </p>
                  <p>
                    <strong>Email Subject:</strong> {form.getValues("subject")}
                  </p>
                  <p>
                    <strong>Type:</strong> {form.getValues("type")}
                  </p>
                </div>
                <div className="p-6">
                  <div
                    className="prose max-w-none text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html:
                        form.getValues("message") ||
                        "<p class='text-gray-400 italic'>Message preview will appear here...</p>",
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
