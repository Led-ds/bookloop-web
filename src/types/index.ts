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
  city?: string;
  state?: string;
  addressLine?: string;
  neighborhood?: string;
  postalCode?: string;
  profileCompleted?: boolean;
  penaltiesCount: number;
  role: "USER" | "ADMIN";
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInMs: number;
  user: User;
}

export type BookStatus = "AVAILABLE" | "RESERVED" | "RENTED";
export type RentalStatus =
  | "PENDING" | "APPROVED" | "ACTIVE" | "RETURN_REQUESTED" | "RETURNED" | "OVERDUE" | "REJECTED" | "CANCELLED";

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
  renewalStatus?: "REQUESTED" | "APPROVED" | "REJECTED";
  renewalRequestedUntil?: string;
  createdAt: string;
}
