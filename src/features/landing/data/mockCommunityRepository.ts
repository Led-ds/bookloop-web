import type { CommunityRepository } from "./CommunityRepository";
import type { ActivityItem, CommunityStats, LivingBook } from "./types";

// Simula latência para exercitar estados de carregamento (skeletons).
const delay = <T>(value: T, ms = 400): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const iso = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * 86_400_000).toISOString();

export const mockCommunityRepository: CommunityRepository = {
  getStats: () =>
    delay({
      readers: 1284,
      booksShared: 3417,
      rentalsCompleted: 2056,
      ratings: 1890,
      returnRate: 0.98,
    } satisfies CommunityStats),

  getActivity: () =>
    delay<ActivityItem[]>([
      { id: "a1", kind: "lent",     actor: "Maria",  target: "O Hobbit",   at: iso(0) },
      { id: "a2", kind: "returned", actor: "Carlos", target: "Clean Code", at: iso(0) },
      { id: "a3", kind: "rated",    actor: "João",   target: "Ana", rating: 5, at: iso(1) },
      { id: "a4", kind: "lent",     actor: "Beatriz",target: "A Revolução dos Bichos", at: iso(1) },
      { id: "a5", kind: "joined",   actor: "Rafael", at: iso(2) },
      { id: "a6", kind: "returned", actor: "Lucia",  target: "Sapiens", at: iso(2) },
    ]),

  getLivingBooks: () =>
    delay<LivingBook[]>([
      { id: "b1", title: "O Hobbit", author: "J.R.R. Tolkien", genre: "FANTASIA",
        timesLent: 12, readers: 12, rating: 4.8, lastLentAt: iso(0) },
      { id: "b2", title: "Clean Code", author: "Robert C. Martin", genre: "TECNICO",
        timesLent: 9, readers: 9, rating: 4.9, lastLentAt: iso(0) },
      { id: "b3", title: "Sapiens", author: "Yuval Noah Harari", genre: "HISTORIA",
        timesLent: 15, readers: 14, rating: 4.7, lastLentAt: iso(2) },
      { id: "b4", title: "A Revolução dos Bichos", author: "George Orwell", genre: "FICCAO",
        timesLent: 7, readers: 7, rating: 4.6, lastLentAt: iso(1) },
    ]),
};
