// import type ScheduleSet from "@/components/Dashboard/Table/BookingTable";
import { ScheduleSet } from "./BookingTableType";

export interface ApiImage {
  public_id: string;
  url: string;
}

export interface ApiCourse {
  classDates: string[];
  _id: string;
  title: string;
  description: string;
  image?: ApiImage;
  images?: ApiImage[];
  shortDescription?: string;
  longDescription?: string;
  courseLevel: "beginner" | "intermediate" | "advanced";
  features?: string[];
  courseIncludes?: string[];
  price: number | number[];
  courseDate?: string;
  location?: string;
  requiredAge?: number;
  maxDepth?: number;
  courseDuration?: string;
  duration?: string;
  avgRating?: number;
  totalReviews?: number;
  totalParticipates?: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  index: number;

  /** 👇 Add this */
  schedule?: ScheduleSet[];
}


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
  meta?: {
    limit: number;
    page: number;
    total: number;
    totalPage: number;
  };
}

export interface CourseCardProps {
  location?: string;
  image: string;
  title: string;
  description: string;
  rating: number;
  reviews: number;
  duration: string;
  maxDepth: string;
  features: string[];
  price: string;
  ageRestriction?: string;
  onSeeMore?: () => void;
  onBookNow?: () => void;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface CourseFilters {
  search?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
}

// /types/course.ts

export interface CourseImage {
  url: string;
  alt?: string;
}

export interface Course {
  _id: string;
  title: string;
  description?: string;
  price?: number[];
  image?: CourseImage;
  classDates?: string[];
}
