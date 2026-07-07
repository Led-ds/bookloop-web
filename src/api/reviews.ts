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
  edited?: boolean;
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

/** Espelha o PendingReviewResponse: o que o usuário logado ainda pode avaliar. */
export interface PendingReview {
  rentalId: string;
  bookId: string;
  bookTitle: string;
  bookCoverUrl?: string;
  counterpartId: string;
  counterpartName: string;
  canReviewBook: boolean;
  canReviewUser: boolean;
}

export interface CreateReviewInput {
  rentalId: string;
  type: "BOOK" | "USER";
  targetUserId?: string;
  rating: number;
  comment?: string;
}

/** Aluguéis devolvidos com algo ainda a avaliar (JWT). */
export async function getPendingReviews(): Promise<PendingReview[]> {
  const res = await api.get<ApiResponse<PendingReview[]>>("/reviews/pending");
  return res.data.data;
}

/** Cria uma avaliação (JWT). */
export async function createReview(input: CreateReviewInput): Promise<Review> {
  const res = await api.post<ApiResponse<Review>>("/reviews", input);
  return res.data.data;
}

export interface UpdateReviewInput {
  id: string;
  rating: number;
  comment?: string;
}

/** Edita uma avaliação existente (apenas o autor; JWT). */
export async function updateReview(input: UpdateReviewInput): Promise<Review> {
  const res = await api.put<ApiResponse<Review>>(`/reviews/${input.id}`, {
    rating: input.rating,
    comment: input.comment,
  });
  return res.data.data;
}
