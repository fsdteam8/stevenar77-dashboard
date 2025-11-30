"use client";
import { useState, useEffect } from "react";
import { Pencil, Eye, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TemplateResponse } from "@/types/template";
import { useDeleteTemplate, useUpdateTemplateStatus } from "@/hooks/templates";

interface Props {
  templates: TemplateResponse[];
  type: string;
}

export default function TemplateTable({ templates }: Props) {
  const [localTemplates, setLocalTemplates] = useState<TemplateResponse[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateResponse | null>(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const { mutate: deleteTemplate } = useDeleteTemplate();
  const { mutate: updateStatus } = useUpdateTemplateStatus();

  useEffect(() => {
    setLocalTemplates(templates);
  }, [templates]);

  //  Toggle active/deactivate status
  const handleToggleStatus = async (tpl: TemplateResponse) => {
    if (!tpl._id) return;
    const newStatus = tpl.status === "active" ? "deactivate" : "active";
    setLoadingId(tpl._id);

    updateStatus(
      { id: tpl._id, status: newStatus },
      {
        onSuccess: () => {
          setLoadingId(null);
          toast.success(
            `Template "${tpl.tempName}" ${
              newStatus === "active" ? "activated" : "deactivated"
            } successfully!`
          );
        },
        onError: (error) => {
          setLoadingId(null);
          console.error("❌ Failed to update template status:", error);
          toast.error(`❌ Failed to update status: ${error.message}`);
        },
      }
    );
  };

  const handleDelete = (_id: string) => {
    setLoadingId(_id);
    deleteTemplate(_id, {
      onSuccess: () => {
        setLoadingId(null);
        toast.success("Template deleted successfully!");
      },
      onError: (error) => {
        setLoadingId(null);
        console.error(error);
        toast.error(`❌ Failed to delete template: ${error.message}`);
      },
    });
  };

  return (
    <div className="overflow-x-auto rounded-xl border shadow-sm bg-white">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-700 uppercase text-xs">
            <th className="p-4 text-left">#</th>
            <th className="p-4 text-left">Template Name</th>
            <th className="p-4 text-left">Subject</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {localTemplates.length > 0 ? (
            localTemplates.map((tpl, i) => (
              <tr
                key={tpl._id}
                className="border-b hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="p-4">{i + 1}</td>
                <td className="p-4 font-medium text-gray-900">
                  {tpl.tempName}
                </td>
                <td className="p-4 text-gray-700">{tpl.emailSubject}</td>
                <td className="p-4 text-center">
                  {tpl.status === "active" ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Active
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-semibold">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="p-4 flex justify-center gap-2 flex-wrap">
                  {/* Preview Button */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedTemplate(tpl);
                      setOpenPreview(true);
                    }}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>

                  {/* Edit Button */}
                  <Link
                    href={`/send-email/${tpl._id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Link>

                  {/* ✅ Toggle Switch Button */}
                  <button
                    onClick={() => handleToggleStatus(tpl)}
                    disabled={loadingId === tpl._id}
                    className={`relative w-14 h-7 flex items-center rounded-full transition cursor-pointer ${
                      tpl.status === "active" ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    {loadingId === tpl._id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white mx-auto" />
                    ) : (
                      <span
                        className={`absolute left-1 w-5 h-5 bg-white rounded-full shadow transform transition ${
                          tpl.status === "active" ? "translate-x-7" : ""
                        }`}
                      ></span>
                    )}
                  </button>

                  {/* Delete Button */}
                  <Button
                    onClick={() => handleDelete(tpl._id)}
                    variant="destructive"
                    className="flex items-center gap-1 cursor-pointer hover:bg-red-700"
                    disabled={loadingId === tpl._id}
                  >
                    {loadingId === tpl._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500">
                No templates found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="text-gray-500 text-sm text-center mt-6 p-4">
        Only <strong> active template </strong> will automatically be used for
        sending emails.
        {/* course/trip/product */}
      </div>

      {/* Professional Email Preview Modal */}
      <Dialog open={openPreview} onOpenChange={setOpenPreview}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-xl shadow-xl bg-white">
          <div className="bg-gray-100 p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              {selectedTemplate?.tempName || "Template Preview"}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Subject:{" "}
              <strong>{selectedTemplate?.emailSubject || "No subject"}</strong>
            </p>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto text-gray-800">
            {selectedTemplate ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html:
                    selectedTemplate.messageBody ||
                    "<p class='text-gray-400 italic'>No content available.</p>",
                }}
              />
            ) : (
              <p className="text-gray-500 text-center py-10">
                No template selected.
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 flex justify-end border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setOpenPreview(false)}
              className="cursor-pointer"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
