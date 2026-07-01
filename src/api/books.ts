import { api } from "@/lib/api";
import type { ApiResponse, Book, BookSummary, PageResponse } from "@/types";

export interface BookFilters {
  q?: string;
  genre?: string;
  status?: string;
  page?: number;
  size?: number;
}

export async function searchBooks(filters: BookFilters) {
  const res = await api.get<ApiResponse<PageResponse<BookSummary>>>("/books", { params: filters });
  return res.data.data;
}

export async function getBook(id: string) {
  const res = await api.get<ApiResponse<Book>>(`/books/${id}`);
  return res.data.data;
}

export interface BookInput {
  title: string;
  author: string;
  isbn?: string;
  genre: string;
  description?: string;
  condition: string;
  coverUrl?: string;
  isPublic: boolean;
}

export async function createBook(input: BookInput) {
  const res = await api.post<ApiResponse<Book>>("/books", input);
  return res.data.data;
}
