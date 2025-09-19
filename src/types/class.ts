export interface ClassData {
  image: {
    public_id: string;
    url: string;
  };
  _id: string;
  title: string;
  description: string;
  price: number[];
  courseIncludes: string[];
  duration: string;
  totalReviews: number;
  avgRating: number;
  totalParticipates: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingData {
  _id: string;
  classId: ClassData;
  userId: {
    _id: string;
    email: string;
  };
  participant: number;
  classDate: string[];
  medicalHistory: string[];
  canSwim: string;
  divingExperience: string;
  lastPhysicalExamination: string;
  fitnessLevel: string;
  activityLevelSpecificQuestions: string[];
  medicalDocuments: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Session {
  id: string;
  title: string;
  time: string;
  price: string;
  day: number;
  month: number;
  year: number;
}
