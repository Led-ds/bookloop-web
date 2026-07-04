import type { ActivityItem, CommunityStats, LivingBook } from "./types";

/**
 * Porta de acesso aos dados da comunidade. A landing depende SOMENTE desta
 * interface — nunca de um mock concreto. Trocar para REST = nova implementação.
 */
export interface CommunityRepository {
  getStats(): Promise<CommunityStats>;
  getActivity(): Promise<ActivityItem[]>;
  getLivingBooks(): Promise<LivingBook[]>;
}
