/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Upload, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  useAbout,
  useUpdateAbout,
  useGalleryImageDelete,
} from "@/hooks/useAbout";
import Image from "next/image";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

// ---- Enhanced Types for Image Tracking ----
type ImageWithId = {
  _id: string;
  url: string;
  public_id?: string;
};

type ImageValue = File | ImageWithId;

// ---- Schema ----
const FileSchema = z.union([
  z.custom<File | string>((val) => val instanceof File || String, {
    message: "Must be a File instance",
  }),
  z
    .object({
      _id: z.string(),
      url: z.string(),
      public_id: z.string().optional(),
    })
    .passthrough(),
]);

const AboutSchema = z
  .object({
    section1: z.object({
      title: z.string().min(2, "Title is required"),
      description: z.string().min(5, "Description is required"),
      images: z.array(FileSchema).max(1, "Only 1 image allowed"),
    }),
    section2: z.object({
      title: z.string().min(2),
      description: z.string().min(5),
      images: z.array(FileSchema),
    }),
    section3: z.object({
      title: z.string().min(2),
      description: z.string().min(5),
      images: z.array(FileSchema),
    }),
    section4: z.object({
      title: z.string().min(2),
      description: z.string().min(5),
    }),
    section5: z.object({
      title: z.string().min(2),
      description: z.string().min(5),
    }),
    team: z.array(
      z
        .object({
          _id: z.string().optional(),
          title: z.string().min(2, "Member name required"),
          possition: z.string().min(2, "Position required"),
          description: z.string().min(5, "Description required"),
          quote: z.string().min(2, "Quote required"),
          features: z.array(z.string().min(2)).min(1, "At least 1 feature"),
          image: z.array(FileSchema).optional(),
          _delete: z.boolean().optional(),
          _isNew: z.boolean().optional(),
          _removeImage: z.boolean().optional(),
        })
        .refine(
          (data) => {
            // Existing members (_id present) never need image validation
            if (data._isNew && !data._delete) {
              return data.image && data.image.length > 0;
            }
            return true;
          },
          {
            message: "Team member image is required for new members",
            path: ["image"],
          }
        )
    ),
    galleryImages: z.array(FileSchema),
  })
  // .passthrough(); // Allow extra fields like _id from API response

export type AboutFormValues = z.infer<typeof AboutSchema>;

type AboutApiResponse = {
  _id: string;
  section1?: {
    title?: string;
    description?: string;
    images?: ImageWithId[];
  };
  section2?: {
    title?: string;
    description?: string;
    images?: ImageWithId[];
  };
  section3?: {
    title?: string;
    description?: string;
    images?: ImageWithId[];
  };
  section4?: { title?: string; description?: string };
  section5?: { title?: string; description?: string };
  team?: {
    card: {
      _id?: string;
      title?: string;
      possition?: string;
      description?: string;
      quote?: string;
      features?: string[];
      image?: ImageWithId;
    }[];
  };
  galleryImages?: ImageWithId[];
};

// ---- Enhanced File Preview with Delete Handler ----
const FilePreview = ({
  files,
  onRemove,
  onDelete,
  aboutId,
}: {
  files?: ImageValue[];
  onRemove: (index: number) => void;
  onDelete?: (imageId: string, index: number) => void;
  aboutId?: string;
}) => {
  if (!files || files.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {files.map((file, idx) => {
        let src: string | undefined;
        let imageId: string | undefined;

        if (file instanceof File) {
          src = URL.createObjectURL(file);
        } else if (file && typeof file === "object" && "url" in file) {
          src = file.url;
          imageId = file._id;
        }

        return (
          <div key={idx} className="relative">
            {src && (
              <Image
                src={src || "/placeholder.svg"}
                alt="preview"
                width={96}
                height={96}
                className="w-24 h-24 object-cover rounded-lg border"
              />
            )}
            <button
              type="button"
              onClick={() => {
                if (imageId && onDelete && aboutId) {
                  onDelete(imageId, idx);
                } else {
                  onRemove(idx);
                }
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
};

// ---- Enhanced File Input ----
type FileInputFieldShape = {
  value?: ImageValue[];
  onChange: (v: ImageValue[]) => void;
  name?: string;
};

const FileInput = ({
  field,
  limit,
  multiple,
  onDelete,
  aboutId,
}: {
  field: FileInputFieldShape;
  limit: number;
  multiple?: boolean;
  onDelete?: (imageId: string, index: number) => void;
  aboutId?: string;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []) as File[];
    const currentFiles = Array.isArray(field.value) ? field.value : [];
    const mergedFiles: ImageValue[] = [...currentFiles, ...selected];
    field.onChange(mergedFiles.slice(0, limit));
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        hidden
        multiple={!!multiple}
        accept="image/*"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        className="flex items-center gap-2 cursor-pointer bg-transparent"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="w-4 h-4" /> Upload Image{multiple ? "s" : ""}
      </Button>

      <FilePreview
        files={Array.isArray(field.value) ? field.value : []}
        onRemove={(idx) => {
          const currentFiles = Array.isArray(field.value) ? field.value : [];
          const updated = [...currentFiles];
          updated.splice(idx, 1);
          field.onChange(updated);
        }}
        onDelete={onDelete}
        aboutId={aboutId}
      />
    </div>
  );
};

export default function Abouts() {
  const form = useForm<AboutFormValues>({
    resolver: zodResolver(AboutSchema),
    defaultValues: {
      section1: { title: "", description: "", images: [] },
      section2: { title: "", description: "", images: [] },
      section3: { title: "", description: "", images: [] },
      section4: { title: "", description: "" },
      section5: { title: "", description: "" },
      team: [
        {
          title: "",
          possition: "",
          description: "",
          quote: "",
          features: [""],
          image: [],
        },
      ],
      galleryImages: [],
    },
    mode: "onSubmit",
  });

  const { data, isLoading, error } = useAbout();
  const updateAbout = useUpdateAbout();
  const deleteGalleryImage = useGalleryImageDelete();
  const [aboutData, setAboutData] = useState<AboutApiResponse | null>(null);

  const {
    fields: teamFields,
    append: addMember,
    remove: removeMember,
  } = useFieldArray({
    control: form.control,
    name: "team" ,
  });

  // Debug form state
  useEffect(() => {
    const subscription = form.watch( () => {
      // console.log("Form values changed:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleGalleryImageDelete = (imageId: string, index: number) => {
    if (!aboutData?._id) return;

    deleteGalleryImage.mutate(
      { aboutId: aboutData._id, imageId },
      {
        onSuccess: () => {
          const currentImages = form.getValues("galleryImages") || [];
          const updated = currentImages.filter((_, i) => i !== index);
          form.setValue("galleryImages", updated);
        },
        onError: (err) => {
          console.error("Failed to delete gallery image:", err);
        },
      }
    );
  };

  // Handle team member image removal (mark for removal, don't delete immediately)
  const handleTeamImageRemove = (memberIndex: number) => {
    const currentMember = form.getValues(`team.${memberIndex}`);

    // If member has _id (existing member), mark for image removal
    if (currentMember._id) {
      form.setValue(`team.${memberIndex}._removeImage`, true);
    }

    // Clear the image from form
    form.setValue(`team.${memberIndex}.image`, []);
  };

  // Load existing data
  useEffect(() => {
    if (data?.data?.[0]) {
      const about: AboutApiResponse = data.data[0];
      setAboutData(about);

      form.reset({
        section1: {
          title: about.section1?.title || "",
          description: about.section1?.description || "",
          images: about.section1?.images || [],
        },
        section2: {
          title: about.section2?.title || "",
          description: about.section2?.description || "",
          images: about.section2?.images || [],
        },
        section3: {
          title: about.section3?.title || "",
          description: about.section3?.description || "",
          images: about.section3?.images || [],
        },
        section4: {
          title: about.section4?.title || "",
          description: about.section4?.description || "",
        },
        section5: {
          title: about.section5?.title || "",
          description: about.section5?.description || "",
        },
        team: Array.isArray(about.team?.card)
          ? about.team.card.map((m) => ({
              _id: m._id,
              title: m?.title || "",
              possition: m?.possition || "",
              description: m?.description || "",
              quote: m?.quote || "",
              features: m?.features || [""],
              // This ensures existing members always have a valid image array
              // Schema validation now properly recognizes this as valid for existing members
              image: m?.image ? [m.image] : [],
              _delete: false,
              _isNew: false,
              _removeImage: false,
            }))
          : [
              {
                title: "",
                possition: "",
                description: "",
                quote: "",
                features: [""],
                image: [],
                _delete: false,
                _isNew: false,
                _removeImage: false,
              },
            ],
        galleryImages: about.galleryImages || [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSubmit = async (values: AboutFormValues) => {
    // console.log("=== FORM SUBMISSION START ===");
    // console.log("Form submitted with values:", values);

    if (!aboutData) {
      console.error("No aboutData available");
      return;
    }

    const formData = new FormData();

    // --- Build team card data structure ---
    const teamCards: any[] = [];
    const teamCardIdsForImages: string[] = [];
    const teamImagesToUpload: File[] = [];

    values.team.forEach((member, index) => {
      // console.log(`Processing team member ${index}:`, member);

      // Case 1: Delete existing card
      if (member._delete && member._id) {
        console.log(`Member ${index} marked for deletion`);
        teamCards.push({
          _id: member._id,
          _delete: true,
        });
        return;
      }

      // Case 2: Add new card
      if (member._isNew) {
        // console.log(`Member ${index} is NEW`);
        const newCard: any = {
          title: member.title,
          possition: member.possition,
          description: member.description,
          quote: member.quote,
          features: member.features,
        };

        teamCards.push(newCard);

        // Add new image if provided
        member.image?.forEach((img) => {
          if (img instanceof File) {
            // console.log(`Adding new image for new member ${index}`);
            teamImagesToUpload.push(img);
          }
        });
        return;
      }

      // Case 3: Update existing card - remove image
      if (member._removeImage && member._id) {
        // console.log(`Member ${index} removing image`);
        teamCards.push({
          _id: member._id,
          title: member.title,
          possition: member.possition,
          description: member.description,
          quote: member.quote,
          features: member.features,
          image: null,
        });
        return;
      }

      // Case 4: Update existing card - add/update image OR keep existing
      if (member._id) {
        const hasNewImage = member.image?.some((img) => img instanceof File);

        const cardData: any = {
          _id: member._id,
          title: member.title,
          possition: member.possition,
          description: member.description,
          quote: member.quote,
          features: member.features,
        };

        teamCards.push(cardData);

        if (hasNewImage) {
          // console.log(`Member ${index} has new image to upload`);
          teamCardIdsForImages.push(member._id);

          member?.image!.forEach((img) => {
            if (img instanceof File) {
              teamImagesToUpload.push(img);
            }
          });
        }
        // The card data is already added above, server will keep existing image
        return;
      }
    });

    // --- Build main data object ---
    const jsonData: any = {
      section1: {
        title: values.section1.title || aboutData.section1?.title,
        description:
          values.section1.description || aboutData.section1?.description,
      },
      section2: {
        title: values.section2.title || aboutData.section2?.title,
        description:
          values.section2.description || aboutData.section2?.description,
      },
      section3: {
        title: values.section3.title || aboutData.section3?.title,
        description:
          values.section3.description || aboutData.section3?.description,
      },
      section4: {
        title: values.section4.title || aboutData.section4?.title,
        description:
          values.section4.description || aboutData.section4?.description,
      },
      section5: {
        title: values.section5.title || aboutData.section5?.title,
        description:
          values.section5.description || aboutData.section5?.description,
      },
      team: {
        card: teamCards,
      },
    };

    // --- Add teamCardIds inside data object if there are images to update ---
    if (teamCardIdsForImages.length > 0) {
      jsonData.teamCardIds = teamCardIdsForImages;
    }

    formData.append("data", JSON.stringify(jsonData));

    // --- Append team images ---
    teamImagesToUpload.forEach((file) => {
      formData.append("teamImages", file);
    });

    // --- Section images (unchanged) ---
    const appendFiles = (files: ImageValue[], fieldName: string) => {
      const onlyFiles = files.filter((f): f is File => f instanceof File);
      onlyFiles.forEach((file) => formData.append(fieldName, file));
    };

    appendFiles(
      (values?.section1?.images || []).filter(
        (img) => typeof img !== "string"
      ),
      "section1Images"
    );
    appendFiles(
      (values?.section2?.images || []).filter(
        (img) => typeof img !== "string"
      ),
      "section2Images"
    );
    appendFiles(
      (values.section3?.images || []).filter(
        (img) => typeof img !== "string"
      ),
      "section3Images"
    );
    appendFiles(
      (values.galleryImages || []).filter(
        (img) => typeof img !== "string"
      ),
      "galleryImages"
    );

    console.log("=== FORMDATA CONTENTS ===");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // console.log(key, "File:", value.name);
      } else {
        console.log(key, value);
      }
    }
    // console.log("=== CALLING API ===");

    updateAbout.mutate(
      { data: formData, id: aboutData._id },
      {
        onSuccess: (responseData) => {
          console.log("Update successful!", responseData);

          // Reset form flags after successful update
          const updatedTeam = values.team
            .filter((member) => !member._delete) // Remove deleted members
            .map((member) => ({
              ...member,
              _isNew: false,
              _delete: false,
              _removeImage: false,
            }));

          form.setValue("team", updatedTeam);
        },
        onError: (error) => {
          console.error("Update failed:", error);
        },
      }
    );
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-teal-50">
          <Loader2 className="animate-spin text-[#0694A2] w-8 h-8" />
        </div>
        <p className="mt-4 text-teal-700 font-medium text-sm animate-pulse">
          Loading, please wait...
        </p>
      </div>
    );

  if (error) return <p>Error loading data</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Update About Page</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.error("Form validation errors:", errors);
          })}
          className="space-y-6"
        >
          {/* ---- Section 1 ---- */}
          <Card>
            <CardHeader>
              <CardTitle>Our Story (Section 1)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="section1.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="section1.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl className="mb-10">
                      <ReactQuill
                        value={field.value}
                        onChange={field.onChange}
                        className="h-96"
                        theme="snow"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="section1.images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload 1 Image</FormLabel>
                    <FileInput
                      field={{
                        ...field,
                        value: Array.isArray(field.value)
                          ? field.value.filter((v) => typeof v !== "string")
                          : [],
                      }}
                      limit={1}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ---- Section 2 ---- */}
          <Card>
            <CardHeader>
              <CardTitle>Mission (Section 2)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="section2.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="section2.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl className="mb-10">
                      <ReactQuill
                        value={field.value}
                        onChange={field.onChange}
                        className="h-96"
                        theme="snow"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="section2.images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload 1 Image</FormLabel>
                    <FileInput
                      field={{
                        ...field,
                        value: Array.isArray(field.value)
                          ? field.value.filter((v) => typeof v !== "string")
                          : [],
                      }}
                      limit={1}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ---- Section 3 ---- */}
          <Card>
            <CardHeader>
              <CardTitle>Vision (Section 3)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="section3.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="section3.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl className="mb-10">
                      <ReactQuill
                        value={field.value}
                        onChange={field.onChange}
                        className="h-96"
                        theme="snow"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="section3.images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload 1 Image</FormLabel>
                    <FileInput
                      field={{
                        ...field,
                        value: Array.isArray(field.value)
                          ? field.value.filter((v) => typeof v !== "string")
                          : [],
                      }}
                      limit={1}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ---- Section 4 ---- */}
          <Card>
            <CardHeader>
              <CardTitle>Values (Section 4)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="section4.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="section4.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl className="mb-10">
                      <ReactQuill
                        value={field.value}
                        onChange={field.onChange}
                        className="h-96"
                        theme="snow"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ---- Section 5 ---- */}
          <Card>
            <CardHeader>
              <CardTitle>Future Goals (Section 5)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="section5.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="section5.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl className="mb-10">
                      <ReactQuill
                        value={field.value}
                        onChange={field.onChange}
                        className="h-96"
                        theme="snow"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ---- Team Section  ---- */}
          <Card>
            <CardHeader>
              <CardTitle>Meet The Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {teamFields.map((member, index) => {
                const memberData = form.watch(`team.${index}`);
                const isMarkedForDeletion = memberData?._delete;
                const isNew = memberData?._isNew;

                return (
                  <div
                    key={member.id}
                    className={`border rounded-lg p-4 space-y-4 ${
                      isMarkedForDeletion ? "opacity-50 bg-red-50" : ""
                    } ${isNew ? "bg-green-50" : ""}`}
                  >
                    {isNew && (
                      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
                        ✨ New Team Member (will be added on save)
                      </div>
                    )}
                    {isMarkedForDeletion && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded flex justify-between items-center">
                        <span>⚠️ This member will be deleted on save</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            form.setValue(`team.${index}._delete`, false);
                          }}
                        >
                          Undo
                        </Button>
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name={`team.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isMarkedForDeletion} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`team.${index}.possition`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter position"
                              disabled={isMarkedForDeletion}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`team.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl className="mb-10">
                            <ReactQuill
                              value={field.value}
                              onChange={field.onChange}
                              className="h-96"
                              theme="snow"
                              readOnly={isMarkedForDeletion}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`team.${index}.quote`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quote</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isMarkedForDeletion} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Features Dynamic Array */}
                    <div className="space-y-2">
                      <FormLabel>Features</FormLabel>
                      {form
                        .watch(`team.${index}.features`)
                        .map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex gap-2">
                            <FormField
                              control={form.control}
                              name={`team.${index}.features.${featureIndex}`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter feature"
                                      disabled={isMarkedForDeletion}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="cursor-pointer bg-transparent"
                              disabled={isMarkedForDeletion}
                              onClick={() => {
                                const currentFeatures = form.getValues(
                                  `team.${index}.features`
                                );
                                if (currentFeatures.length > 1) {
                                  const updatedFeatures =
                                    currentFeatures.filter(
                                      (_, i) => i !== featureIndex
                                    );
                                  form.setValue(
                                    `team.${index}.features`,
                                    updatedFeatures
                                  );
                                }
                              }}
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isMarkedForDeletion}
                        className="cursor-pointer bg-transparent"
                        onClick={() => {
                          const currentFeatures = form.getValues(
                            `team.${index}.features`
                          );
                          form.setValue(`team.${index}.features`, [
                            ...currentFeatures,
                            "",
                          ]);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Feature
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name={`team.${index}.image`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload Image</FormLabel>
                          <div className="space-y-2 flex gap-4">
                            {!isMarkedForDeletion && (
                              <FileInput
                                field={{
                                  ...field,
                                  value: Array.isArray(field.value)
                                    ? field.value.filter((v) => typeof v !== "string")
                                    : [],
                                }}
                                limit={1}
                                aboutId={aboutData?._id}
                              />
                            )}
                            {Array.isArray(memberData?.image) && memberData.image.length > 0 &&
                              memberData._id &&
                              !isNew &&
                              !isMarkedForDeletion && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleTeamImageRemove(index)}
                                  className="text-red-600 hover:text-red-70 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remove Image Only
                                </Button>
                              )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2 pt-4 border-t">
                      {!isMarkedForDeletion && memberData?._id && !isNew && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => {
                            form.setValue(`team.${index}._delete`, true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Mark for Deletion
                        </Button>
                      )}
                      {(isNew || !memberData?._id) && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => removeMember(index)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Member
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
              <Button
                type="button"
                onClick={() =>
                  addMember({
                    title: "",
                    possition: "",
                    description: "",
                    quote: "",
                    features: [""],
                    image: [],
                    _isNew: true,
                    _delete: false,
                    _removeImage: false,
                  })
                }
                className=""
              >
                <Plus className="w-4 h-4 mr-1" />
                Add New Team Member
              </Button>
            </CardContent>
          </Card>

          {/* Gallery Images */}
          <Card>
            <CardHeader>
              <CardTitle>Gallery Images</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="galleryImages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Gallery Images</FormLabel>
                    <FileInput
                      field={{
                        ...field,
                        value: Array.isArray(field.value)
                          ? field.value.filter((v) => typeof v !== "string")
                          : [],
                      }}
                      limit={500}
                      multiple
                      onDelete={handleGalleryImageDelete}
                      aboutId={aboutData?._id}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full"
            disabled={updateAbout.isPending}
          >
            {updateAbout.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update About Us Page"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
