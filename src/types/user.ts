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
  city?: string;
  state?: string;
  postalCode?: string;
  street?: string;

  age?: number | string;
  weight?: number | string;
  hight?: number | string;
  shoeSize?: number | string;

  createdAt?: string;
  updatedAt?: string;
}
