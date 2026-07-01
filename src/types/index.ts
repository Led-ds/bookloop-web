export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  penaltiesCount: number;
  role: "USER" | "ADMIN";
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInMs: number;
  user: User;
}

export type BookStatus = "AVAILABLE" | "RENTED" | "UNAVAILABLE";
export type RentalStatus =
  | "PENDING" | "APPROVED" | "ACTIVE" | "RETURNED" | "LATE" | "REJECTED" | "CANCELLED";

export interface BookSummary {
  id: string;
  title: string;
  author: string;
  genre: string;
  condition: string;
  coverUrl?: string;
  status: BookStatus;
  ownerName: string;
}

export interface BookOwner {
  id: string;
  name: string;
  avatarUrl?: string;
  location?: string;
  penaltiesCount: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  genre: string;
  description?: string;
  condition: string;
  coverUrl?: string;
  isPublic: boolean;
  status: BookStatus;
  owner: BookOwner;
  createdAt: string;
}

export interface Rental {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCoverUrl?: string;
  renterId: string;
  renterName: string;
  ownerId: string;
  ownerName: string;
  message?: string;
  startDate: string;
  endDate: string;
  returnDate?: string;
  status: RentalStatus;
  termAccepted: boolean;
  termSignedAt?: string;
  termSignerName?: string;
  createdAt: string;
}
