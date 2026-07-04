// Validação do cliente, espelhando as constraints dos DTOs do backend.
// A validação do servidor continua sendo a fonte da verdade; esta dá feedback rápido.

export interface FieldConstraint {
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  url?: boolean;
  email?: boolean;
}

export const BOOK_CONSTRAINTS: Record<string, FieldConstraint> = {
  title: { label: "Título", required: true, maxLength: 200 },
  author: { label: "Autor", required: true, maxLength: 160 },
  isbn: { label: "ISBN", maxLength: 20 },
  description: { label: "Descrição", maxLength: 2000 },
  coverUrl: { label: "URL da capa", maxLength: 500, url: true },
};

export const REGISTER_CONSTRAINTS: Record<string, FieldConstraint> = {
  name: { label: "Nome", required: true, maxLength: 120 },
  email: { label: "E-mail", required: true, email: true, maxLength: 160 },
  password: { label: "Senha", required: true, minLength: 8, maxLength: 64 },
};

export const LOGIN_CONSTRAINTS: Record<string, FieldConstraint> = {
  email: { label: "E-mail", required: true, email: true },
  password: { label: "Senha", required: true },
};

export type CounterState = "ok" | "warn" | "error";

export function counterState(len: number, max: number): CounterState {
  if (len > max) return "error";
  if (len >= Math.floor(max * 0.9)) return "warn";
  return "ok";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateField(value: string, c: FieldConstraint): string | null {
  const v = value ?? "";
  const trimmed = v.trim();
  if (c.required && trimmed.length === 0) return "Campo obrigatório.";
  if (trimmed.length === 0) return null; // opcional e vazio: ok
  if (c.minLength && v.length < c.minLength) return `Mínimo de ${c.minLength} caracteres.`;
  if (c.maxLength && v.length > c.maxLength) {
    return `Máximo de ${c.maxLength} caracteres — você excedeu em ${v.length - c.maxLength}.`;
  }
  if (c.email && !EMAIL_RE.test(trimmed)) return "Informe um e-mail válido.";
  if (c.url && !isValidUrl(trimmed)) return "Informe uma URL válida (http:// ou https://).";
  return null;
}

export function validateAll<T extends object>(
  values: T,
  constraints: Record<string, FieldConstraint>,
): Record<string, string> {
  const bag = values as Record<string, unknown>;
  const errors: Record<string, string> = {};
  for (const [key, c] of Object.entries(constraints)) {
    const msg = validateField(String(bag[key] ?? ""), c);
    if (msg) errors[key] = msg;
  }
  return errors;
}
