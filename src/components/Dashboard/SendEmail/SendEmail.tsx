"use client";
import { useState } from "react";
import Link from "next/link";
import { useGetTemplates } from "@/hooks/templates";
import TemplateTable from "./TemplateTable/TemplateTable";
// import TemplateTable from "./TemplateTable";

export default function SendEmail() {
  const [activeTab, setActiveTab] = useState("courses");
  const { data: templates, isLoading, isError } = useGetTemplates();

  const tabs = [
    { key: "courses", label: "Courses" },
    { key: "trips", label: "Trips" },
    { key: "product", label: "Product" },
  ];

  // Filter templates by type
  const filteredTemplates =
    templates?.filter((t) => t.type === activeTab) || [];

  // console.log(templates)

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-teal-800 text-transparent bg-clip-text">
          Email Templates
        </h1>
        <Link
          href={"/send-email/add-templates"}
          className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-teal-600 transition"
        >
          + New Template
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`capitalize px-4 py-2 font-medium rounded-t-lg transition cursor-pointer ${
              activeTab === tab.key
                ? "border-b-2 border-teal-600 text-teal-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6 animate-fadeIn">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-sm text-gray-600">Loading templates...</p>
          </div>
        )}
        {isError && <p>Failed to load templates.</p>}
        {!isLoading && !isError && filteredTemplates.length === 0 && (
          <p>No templates found for {activeTab}.</p>
        )}
        {!isLoading && !isError && filteredTemplates.length > 0 && (
          <TemplateTable templates={filteredTemplates} type={activeTab} />
        )}
      </div>
    </div>
  );
}
