import { AxiosError } from "axios";

export type ApiErrorKind =
  | "network" | "cors" | "badRequest" | "unauthorized" | "forbidden"
  | "notFound" | "conflict" | "server" | "unknown";

const STATUS_KIND: Record<number, ApiErrorKind> = {
  400: "badRequest",
  401: "unauthorized",
  403: "forbidden",
  404: "notFound",
  409: "conflict",
};

const KIND_MESSAGE: Record<ApiErrorKind, string> = {
  network: "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
  cors: "O servidor recusou a requisição (possível bloqueio de origem/CORS).",
  badRequest: "Requisição inválida. Revise os dados informados.",
  unauthorized: "E-mail ou senha inválidos.",
  forbidden: "Você não tem permissão para esta ação.",
  notFound: "Recurso não encontrado.",
  conflict: "Este registro já existe ou está em uso.",
  server: "O servidor encontrou um erro. Tente novamente em instantes.",
  unknown: "Algo deu errado. Tente novamente.",
};

/** Classifica o erro em uma categoria estável, útil para o chamador ramificar. */
export function apiErrorKind(err: unknown): ApiErrorKind {
  if (err instanceof AxiosError) {
    if (!err.response) {
      // Sem resposta HTTP = falha de rede ou CORS. O navegador oculta CORS como
      // erro de rede; não há como distinguir com 100% de certeza no cliente.
      return "network";
    }
    const s = err.response.status;
    return STATUS_KIND[s] ?? (s >= 500 ? "server" : "unknown");
  }
  return "unknown";
}

/**
 * Mensagem amigável ao usuário. Prioriza a mensagem confiável vinda da API;
 * na ausência dela, mapeia por categoria. Nunca cai em genérico se houver detalhe útil.
 */
export function apiError(err: unknown, fallback?: string): string {
  if (err instanceof AxiosError) {
    const apiMsg = err.response?.data?.message;
    if (typeof apiMsg === "string" && apiMsg.trim().length > 0) return apiMsg.trim();
    return KIND_MESSAGE[apiErrorKind(err)];
  }
  return fallback ?? KIND_MESSAGE.unknown;
}

/**
 * Erros de validação por campo. O backend, em falha de validação, retorna
 * ApiResponse com `data` = { campo: mensagem }.
 */
export function apiFieldErrors(err: unknown): Record<string, string> {
  if (err instanceof AxiosError) {
    const data = err.response?.data?.data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      return data as Record<string, string>;
    }
  }
  return {};
}
