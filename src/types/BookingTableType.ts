// src/types/BookingTableTypes.ts

// ─── Participant & Medical Document ──────────────────────────────
export type Participant = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
};

export type MedicalDocument = {
  _id: string;
  public_id: string;
  url: string;
};

// ─── Auth Session Types ──────────────────────────────────────────
export interface UserSession {
  id: string;
  email: string;
  role: string;
  accessToken: string;
}

export interface CustomSession {
  user: UserSession;
  accessToken?: string;
}

// ─── Booking Type ────────────────────────────────────────────────
export type Booking = {
  customerId: { _id?: string; email?: string };
  id: string;
  invoice: string;
  customerName: string;
  customerEmail: string;
  location: string;
  price: number;
  status: "Paid" | "Cancelled" | "Pending" | "Success";
  date?: string;
  dates?: string[];
  avatar: string;
  classImage?: string;
  participants?: Participant[];
  emergencyName?: string[];
  emergencyPhoneNumber?: string[];
  medicalDocuments?: MedicalDocument[];
  courseIncludes?: string[];
  divingExperience?: string;
  fitnessLevel?: string;
  PhoneNumber?: string;
  gender?: string;
  hight?: string | number;
  weight?: number;
  shoeSize?: number | string;
  lastPhysicalExamination?: string;
  description?: string;
  duration?: string;
  classId?: string | null;
  totalParticipates?: number;
  avgRating?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  medicalHistory?: string[];
  activityLevelSpecificQuestions?: string[];
  canSwim?: string;
  scheduleId?: string;
  age?: number | string;
};

// ─── Booking API Response Type ───────────────────────────────────
export type BookingAPIResponse = {
  _id: string;
  userId?: { _id?: string; email?: string };
  totalPrice?: number;
  status?: "paid" | "success" | "cancelled" | string;
  classDate?: string[];
  classId?: {
    _id?: string;
    image?: { public_id?: string; url?: string };
    classDates?: string[];
    title?: string;
    description?: string;
    price?: number[];
    courseIncludes?: string[];
    duration?: string;
    totalReviews?: number;
    avgRating?: number;
    participates?: number;
    totalParticipates?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    index?: number;
  };
  participant?: number;
  emergencyPhoneNumber?: string[];
  phoneNumber?: string;
  divingExperience?: string;
  lastPhysicalExamination?: string;
  fitnessLevel?: string;
  emergencyName?: string[];
  medicalDocuments?: { _id: string; public_id: string; url: string }[];
  gender?: string;
  shoeSize?: number | string;
  hight?: number;
  weight?: number;
  createdAt?: string;
  updatedAt?: string;
  scheduleId?: string;
  email?: string;
  Username?: string;
  age?: number | string;
};

// ─── Schedule Types ──────────────────────────────────────────────
export interface ScheduleDate {
  _id?: string;
  date: string;
  location: string;
  type?: string;
  isActive?: boolean;
}

export interface ScheduleSet {
  _id: string;
  title: string;
  description: string;
  participents: number;
  totalParticipents?: number;
  sets: ScheduleDate[];
}

// ─── Trip Booking Type ───────────────────────────────────────────
export interface TripBooking {
  _id: string;
  participants: Participant[];
  status: string;
  mobile?: string;
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}
