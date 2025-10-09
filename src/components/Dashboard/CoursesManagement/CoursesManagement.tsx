"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import CourseManageTable from "../Table/CourseManageTable";

export default function CoursesManagement() {
  const [searchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  return (
    <div>
      <div className="">
        {/* Search and Sort */}
        <div className="flex flex-col justify-between w-full sm:flex-row gap-4 mb-6">
          {/* <div className="relative flex-1 max-w-65">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div> */}
          <div className=" max-w-65">
            <Link href="/courses-management/add/">
              <Button className="cursor-pointer">
                <Plus /> Add Course
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="">
        <CourseManageTable searchTerm={debouncedSearchTerm} />
      </div>
      <div className=""></div>
    </div>
  );
}
