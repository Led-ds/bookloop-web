import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CommunityRepository } from "./CommunityRepository";
import { mockCommunityRepository } from "./mockCommunityRepository";
import { apiCommunityRepository } from "./apiCommunityRepository";

const CommunityRepoContext = createContext<CommunityRepository>(apiCommunityRepository);

/**
 * Injeta a implementação do repositório. Hoje `mock`; amanhã, basta passar uma
 * implementação REST — a interface da landing não muda.
 */
export function CommunityProvider({
  repository = apiCommunityRepository,
  children,
}: {
  repository?: CommunityRepository;
  children: ReactNode;
}) {
  return (
    <CommunityRepoContext.Provider value={repository}>{children}</CommunityRepoContext.Provider>
  );
}

function useCommunityRepository() {
  return useContext(CommunityRepoContext);
}

export function useCommunityStats() {
  const repo = useCommunityRepository();
  return useQuery({ queryKey: ["community", "stats"], queryFn: () => repo.getStats() });
}

export function useCommunityActivity() {
  const repo = useCommunityRepository();
  return useQuery({ queryKey: ["community", "activity"], queryFn: () => repo.getActivity() });
}

export function useLivingBooks() {
  const repo = useCommunityRepository();
  return useQuery({ queryKey: ["community", "living-books"], queryFn: () => repo.getLivingBooks() });
}
