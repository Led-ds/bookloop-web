// Fonte única de verdade dos enums compartilhados com o backend (bookloop-api).
// Manter em sincronia com os enums Java (Genre, BookCondition).

export const GENRES = [
  "FICCAO", "NAO_FICCAO", "FANTASIA", "ROMANCE", "SUSPENSE", "TERROR",
  "BIOGRAFIA", "TECNICO", "INFANTOJUVENIL", "HISTORIA", "AUTOAJUDA", "OUTRO",
] as const;
export type Genre = (typeof GENRES)[number];

export const GENRE_LABEL: Record<string, string> = {
  FICCAO: "Ficção", NAO_FICCAO: "Não-ficção", FANTASIA: "Fantasia",
  ROMANCE: "Romance", SUSPENSE: "Suspense", TERROR: "Terror",
  BIOGRAFIA: "Biografia", TECNICO: "Técnico", INFANTOJUVENIL: "Infantojuvenil",
  HISTORIA: "História", AUTOAJUDA: "Autoajuda", OUTRO: "Outro",
};

export const CONDITIONS = ["NOVO", "OTIMO", "BOM", "REGULAR", "DESGASTADO"] as const;
export type Condition = (typeof CONDITIONS)[number];

export const CONDITION_LABEL: Record<string, string> = {
  NOVO: "Novo", OTIMO: "Ótimo", BOM: "Bom", REGULAR: "Regular", DESGASTADO: "Desgastado",
};

/** Rótulo legível para um valor de enum, com fallback para o próprio valor. */
export function genreLabel(v: string): string {
  return GENRE_LABEL[v] ?? v;
}
export function conditionLabel(v: string): string {
  return CONDITION_LABEL[v] ?? v;
}
