import { api } from "@/lib/api";
import type { ApiResponse } from "@/types";
import type { CommunityRepository } from "./CommunityRepository";
import type { ActivityItem, ActivityKind, CommunityStats, LivingBook } from "./types";
import { mockCommunityRepository } from "./mockCommunityRepository";

/** Forma do GET /api/v1/public/home (backend v1.2). */
interface PublicHome {
  stats: {
    totalBooks: number;
    totalUsers: number;
    totalRentals: number;
    availableBooks: number;
    averageRating: number | null;
  };
  featuredBooks: PublicBook[];
  communityBooks: PublicBook[];
  recentActivities: { type: string; message: string; at: string | null }[];
  bookOfTheWeek: PublicBook | null;
}
interface PublicBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverUrl?: string;
  status: string;
}

let cache: Promise<PublicHome> | null = null;
function fetchHome(): Promise<PublicHome> {
  if (!cache) {
    cache = api
      .get<ApiResponse<PublicHome>>("/public/home")
      .then((r) => r.data.data);
  }
  return cache;
}

const KIND_BY_TYPE: Record<string, ActivityKind> = {
  BOOK_ADDED: "joined",
  RENTAL: "lent",
  RETURN: "returned",
  REVIEW: "rated",
};

function toLivingBook(b: PublicBook, rating: number | null): LivingBook {
  return {
    id: b.id,
    title: b.title,
    author: b.author,
    genre: b.genre,
    coverUrl: b.coverUrl,
    timesLent: 0,
    readers: 0,
    rating: rating ?? 0,
  };
}

/**
 * Consome o endpoint público real. Cada método cai para o mock em caso de falha,
 * para que a landing nunca quebre por indisponibilidade do backend.
 */
export const apiCommunityRepository: CommunityRepository = {
  async getStats(): Promise<CommunityStats> {
    try {
      const h = await fetchHome();
      return {
        readers: h.stats.totalUsers,
        booksShared: h.stats.totalBooks,
        rentalsCompleted: h.stats.totalRentals,
        ratings: 0,
        returnRate: 1,
      };
    } catch {
      return mockCommunityRepository.getStats();
    }
  },

  async getLivingBooks(): Promise<LivingBook[]> {
    try {
      const h = await fetchHome();
      const source = h.featuredBooks.length ? h.featuredBooks : h.communityBooks;
      const books = source.map((b) => toLivingBook(b, h.stats.averageRating));
      return books.length ? books : mockCommunityRepository.getLivingBooks();
    } catch {
      return mockCommunityRepository.getLivingBooks();
    }
  },

  async getActivity(): Promise<ActivityItem[]> {
    try {
      const h = await fetchHome();
      if (!h.recentActivities.length) return mockCommunityRepository.getActivity();
      return h.recentActivities.map((a, i) => ({
        id: `act-${i}`,
        kind: KIND_BY_TYPE[a.type] ?? "joined",
        actor: a.message,
        at: a.at ?? new Date().toISOString(),
      }));
    } catch {
      return mockCommunityRepository.getActivity();
    }
  },
};
