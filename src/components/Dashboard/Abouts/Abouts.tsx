"use client";

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
import { Loader2, Plus, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAbout, useUpdateAbout } from "@/hooks/useAbout";
import Image from "next/image";
import dynamic from "next/dynamic";

// ✅ Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

// ---- Schema ----
const FileSchema =
  typeof window !== "undefined"
    ? z.union([z.instanceof(File), z.string()])
    : z.string();

const AboutSchema = z.object({
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
    z.object({
      title: z.string().min(2, "Member name required"),
      possition: z.string().min(2, "Position required"),
      description: z.string().min(5, "Description required"),
      quote: z.string().min(2, "Quote required"),
      features: z.array(z.string().min(2)).min(1, "At least 1 feature"),
      image: z.array(FileSchema),
    })
  ),
  galleryImages: z.array(z.union([z.string(), z.instanceof(File)])).optional(),
});

export type AboutFormValues = z.infer<typeof AboutSchema>;

type AboutApiResponse = {
  _id: string;
  section1?: {
    title?: string;
    description?: string;
    images?: { url: string }[];
  };
  section2?: {
    title?: string;
    description?: string;
    images?: { url: string }[];
  };
  section3?: {
    title?: string;
    description?: string;
    images?: { url: string }[];
  };
  section4?: { title?: string; description?: string };
  section5?: { title?: string; description?: string };
  team?: {
    card: {
      title?: string;
      possition?: string;
      description?: string;
      quote?: string;
      features?: string[];
      image?: { url: string };
    }[];
  };
  galleryImages?: { url: string }[];
};

// ---- File Preview ----
const FilePreview = ({
  files,
  onRemove,
}: {
  files?: (File | string)[];
  onRemove: (index: number) => void;
}) => {
  if (!files || files.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {files.map((file, idx) => {
        let src: string | undefined;
        if (typeof file === "string") src = file;
        else if (file instanceof File) src = URL.createObjectURL(file);

        return (
          <div key={idx} className="relative">
            {src && (
              <Image
                src={src}
                alt="preview"
                width={96}
                height={96}
                className="w-24 h-24 object-cover rounded-lg border"
              />
            )}
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
};

// ---- File Input ----
type FileInputFieldShape = {
  value?: (File | string)[];
  onChange: (v: (File | string)[]) => void;
  name?: string;
};

const FileInput = ({
  field,
  limit,
  multiple,
}: {
  field: FileInputFieldShape;
  limit: number;
  multiple?: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []) as File[];

    const currentFiles = Array.isArray(field.value) ? field.value : [];

    const currentFilesFiltered = currentFiles.filter(
      (f): f is File | string => typeof f === "string" || f instanceof File
    );

    const mergedFiles: (File | string)[] = [
      ...currentFilesFiltered,
      ...selected,
    ];

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
        className="flex items-center gap-2 cursor-pointer"
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
  });

  const { data, isLoading, error } = useAbout();
  const updateAbout = useUpdateAbout();
  const [aboutData, setAboutData] = useState<AboutApiResponse | null>(null);

  const {
    fields: teamFields,
    append: addMember,
    remove: removeMember,
  } = useFieldArray({
    control: form.control,
    name: "team",
  });

  // Load existing data
  useEffect(() => {
    if (data?.data?.[0]) {
      const about: AboutApiResponse = data.data[0];
      setAboutData(about);
      form.reset({
        section1: {
          title: about.section1?.title || "",
          description: about.section1?.description || "",
          images: (about.section1?.images || []).map((img) => img.url),
        },
        section2: {
          title: about.section2?.title || "",
          description: about.section2?.description || "",
          images: (about.section2?.images || []).map((img) => img.url),
        },
        section3: {
          title: about.section3?.title || "",
          description: about.section3?.description || "",
          images: (about.section3?.images || []).map((img) => img.url),
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
              title: m?.title || "",
              possition: m?.possition || "",
              description: m?.description || "",
              quote: m?.quote || "",
              features: m?.features || [""],
              image: m?.image ? [m.image.url] : [],
            }))
          : [
              {
                title: "",
                possition: "",
                description: "",
                quote: "",
                features: [""],
                image: [],
              },
            ],
        galleryImages: (about.galleryImages || []).map((img) => img.url),
      });
    }
  }, [data, form]);

  const onSubmit = (values: AboutFormValues) => {
    if (!aboutData) return;

    const formData = new FormData();

    const jsonData = {
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
        card: values.team.map((member, i) => ({
          title: member.title || aboutData.team?.card?.[i]?.title,
          possition: member.possition || aboutData.team?.card?.[i]?.possition,
          description:
            member.description || aboutData.team?.card?.[i]?.description,
          quote: member.quote || aboutData.team?.card?.[i]?.quote,
          features: member.features.length
            ? member.features
            : aboutData.team?.card?.[i]?.features,
        })),
      },
    };

    formData.append("data", JSON.stringify(jsonData));

    const appendFiles = (files: (File | string)[], fieldName: string) => {
      const onlyFiles = files.filter((f): f is File => f instanceof File);
      onlyFiles.forEach((file) => formData.append(fieldName, file));
    };

    appendFiles(values.section1.images, "section1Images");
    appendFiles(values.section2.images, "section2Images");
    appendFiles(values.section3.images, "section3Images");

    values.team.forEach((member) => appendFiles(member.image, "teamImages"));

    appendFiles(values.galleryImages || [], "galleryImages");

    updateAbout.mutate({ data: formData, id: aboutData._id });
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="animate-spin text-gray-500 w-6 h-6" />
      </div>
    );

  if (error) return <p>Error loading data</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Update About Page</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <FileInput field={field} limit={1} />
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
                    <FileInput field={field} limit={1} />
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
                    <FileInput field={field} limit={1} />
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

          {/* ---- Team Section ---- */}
          <Card>
            <CardHeader>
              <CardTitle>Meet The Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {teamFields.map((member, index) => (
                <div
                  key={member.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <FormField
                    control={form.control}
                    name={`team.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} placeholder="Enter position" />
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
                          <Input {...field} />
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
                            onClick={() => {
                              const currentFeatures = form.getValues(
                                `team.${index}.features`
                              );
                              if (currentFeatures.length > 1) {
                                const updatedFeatures = currentFeatures.filter(
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
                        <FileInput field={field} limit={1} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {teamFields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => removeMember(index)}
                    >
                      Remove Member
                    </Button>
                  )}
                </div>
              ))}
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
                  })
                }
              >
                <Plus className="w-4 h-4 mr-2" /> Add Member
              </Button>
            </CardContent>
          </Card>

          {/* ---- Gallery ---- */}
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
                    <FileInput field={field} limit={20} multiple />
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
            {updateAbout.isPending ? "Updating..." : "Update About Us Page"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
