const SPINES = [
  "bg-spine-forest", "bg-spine-leather", "bg-spine-burgundy", "bg-spine-indigo",
  "bg-spine-olive", "bg-spine-plum", "bg-spine-teal", "bg-spine-mustard",
] as const;

/** Cor de lombada determinística a partir do código da comunidade. */
export function spineClassOf(code: string): string {
  let h = 0;
  for (const ch of code) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return SPINES[h % SPINES.length];
}
