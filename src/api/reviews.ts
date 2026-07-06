import { api } from "@/lib/api";
import type { ApiResponse, PageResponse } from "@/types";

/** Espelha o ReviewResponse do backend. */
export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  targetType: "BOOK" | "USER";
  targetId: string;
  targetName: string;
  createdAt: string;
}

/** Avaliações de um livro (rota pública, sem autenticação). */
export async function getBookReviews(bookId: string, page = 0, size = 10) {
  const res = await api.get<ApiResponse<PageResponse<Review>>>(
    `/public/books/${bookId}/reviews`,
    { params: { page, size } },
  );
  return res.data.data;
}

/** Avaliações recebidas por uma pessoa (rota pública). */
export async function getUserReviews(userId: string, page = 0, size = 10) {
  const res = await api.get<ApiResponse<PageResponse<Review>>>(
    `/public/users/${userId}/reviews`,
    { params: { page, size } },
  );
  return res.data.data;
}
