import type { ActivityItem, CommunityReview, CommunityStats, LivingBook, TopReader } from "./types";

/**
 * Porta de acesso aos dados da comunidade. A landing depende SOMENTE desta
 * interface. Implementação real consome o endpoint público /public/home.
 */
export interface CommunityRepository {
  getStats(): Promise<CommunityStats>;
  getActivity(): Promise<ActivityItem[]>;
  getLivingBooks(): Promise<LivingBook[]>;
  getReviews(): Promise<CommunityReview[]>;
  getTopReaders(): Promise<TopReader[]>;
}
