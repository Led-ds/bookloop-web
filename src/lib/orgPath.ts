import { useOrganizationStore } from "@/store/organizationStore";

/**
 * Prefixa uma rota de recurso com a comunidade ativa: "/books" -> "/orgs/{orgId}/books".
 * Lê o orgId direto do store (fora de componente), então as funções de api/*
 * não precisam receber orgId manualmente.
 */
export function orgPath(path: string): string {
  const orgId = useOrganizationStore.getState().activeOrgId;
  if (!orgId) {
    throw new Error("Nenhuma comunidade ativa: operação exige uma comunidade selecionada.");
  }
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/orgs/${orgId}${clean}`;
}

/** Para uso em queryKeys: o orgId ativo (ou 'none'), garantindo cache por comunidade. */
export function activeOrgKey(): string {
  return useOrganizationStore.getState().activeOrgId ?? "none";
}

/** Monta uma queryKey escopada pela comunidade ativa: orgKey("books", filters). */
export function orgKey(...parts: unknown[]): unknown[] {
  return ["org", activeOrgKey(), ...parts];
}

/** Base de rota da comunidade ativa para navegação: "/app/{orgId}". */
export function orgBase(): string {
  const orgId = useOrganizationStore.getState().activeOrgId;
  return orgId ? `/app/${orgId}` : "/app";
}
