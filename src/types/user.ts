// types/user.ts

export interface UserImage {
  public_id?: string;
  url?: string;
}

export interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: "user" | "admin";
  isVerified?: boolean;

  phone?: string;
  image?: UserImage;

  dateOfBirth?: string;
  location?: string;
  postalCode?: string;
  street?: string;

  createdAt?: string;
  updatedAt?: string;
}
