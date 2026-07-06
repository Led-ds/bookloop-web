import { api } from "@/lib/api";
import type { ApiResponse } from "@/types";
import type { CommunityRepository } from "./CommunityRepository";
import type {
  ActivityItem, ActivityKind, CommunityReview, CommunityStats, LivingBook, TopReader,
} from "./types";

/** Forma do GET /api/v1/public/home. */
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
  reviews: PublicReview[];
  topReaders: PublicTopReader[];
  bookOfTheWeek: PublicBook | null;
}
interface PublicBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverUrl?: string;
  status: string;
  ratingAvg?: number;
  ratingCount?: number;
}
interface PublicReview {
  id: string;
  rating: number;
  comment: string | null;
  authorName: string;
  authorAvatarUrl?: string;
  targetType: "BOOK" | "USER";
  targetName: string;
}
interface PublicTopReader {
  id: string;
  name: string;
  avatarUrl?: string;
  ratingAvg: number;
  ratingCount: number;
}

let cache: Promise<PublicHome> | null = null;
function fetchHome(): Promise<PublicHome> {
  if (!cache) {
    cache = api.get<ApiResponse<PublicHome>>("/public/home").then((r) => r.data.data);
  }
  return cache;
}

const KIND_BY_TYPE: Record<string, ActivityKind> = {
  BOOK_ADDED: "joined",
  RENTAL: "lent",
  RETURN: "returned",
  REVIEW: "rated",
};

function toLivingBook(b: PublicBook): LivingBook {
  return {
    id: b.id,
    title: b.title,
    author: b.author,
    genre: b.genre,
    coverUrl: b.coverUrl,
    timesLent: 0,
    readers: 0,
    rating: b.ratingAvg ?? 0,   // nota real por livro (denormalizada no backend)
  };
}

/**
 * Consome o endpoint público real. Sem fallback para mock: em caso de
 * indisponibilidade, a landing exibe estados vazios (nunca dado falso).
 */
export const apiCommunityRepository: CommunityRepository = {
  async getStats(): Promise<CommunityStats> {
    const h = await fetchHome();
    return {
      readers: h.stats.totalUsers,
      booksShared: h.stats.totalBooks,
      rentalsCompleted: h.stats.totalRentals,
      ratings: h.reviews.length,
      returnRate: 1,
      averageRating: h.stats.averageRating,
    };
  },

  async getLivingBooks(): Promise<LivingBook[]> {
    const h = await fetchHome();
    const source = h.featuredBooks.length ? h.featuredBooks : h.communityBooks;
    return source.map(toLivingBook);
  },

  async getActivity(): Promise<ActivityItem[]> {
    const h = await fetchHome();
    return h.recentActivities.map((a, i) => ({
      id: `act-${i}`,
      kind: KIND_BY_TYPE[a.type] ?? "joined",
      actor: a.message,
      at: a.at ?? new Date().toISOString(),
    }));
  },

  async getReviews(): Promise<CommunityReview[]> {
    const h = await fetchHome();
    return h.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment ?? "",
      authorName: r.authorName,
      authorAvatarUrl: r.authorAvatarUrl,
      targetName: r.targetName,
      targetType: r.targetType,
    }));
  },

  async getTopReaders(): Promise<TopReader[]> {
    const h = await fetchHome();
    return h.topReaders.map((u) => ({
      id: u.id,
      name: u.name,
      avatarUrl: u.avatarUrl,
      ratingAvg: u.ratingAvg,
      ratingCount: u.ratingCount,
    }));
  },
};
