// Resolução e validação da URL base da API.
// Regra: nunca usar localhost em produção; fallback local só em desenvolvimento.

function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL?.trim();

  if (raw) {
    const isLocal = /localhost|127\.0\.0\.1/.test(raw);
    if (import.meta.env.PROD && isLocal) {
      // Build de produção apontando para localhost é quase sempre erro de build.
      // O Dockerfile também bloqueia isso; aqui é a última linha de defesa em runtime.
      console.error(
        "[BookLoop] VITE_API_URL aponta para localhost em um build de produção. " +
          "Gere o build com a URL pública da API (ex.: docker build --build-arg VITE_API_URL=...).",
      );
    }
    return raw.replace(/\/+$/, "");
  }

  if (import.meta.env.DEV) {
    return "http://localhost:8080/api/v1";
  }

  // Produção sem URL definida: não caímos em localhost. Usamos caminho relativo
  // (que falhará de forma visível e tratável) e registramos o erro de configuração.
  console.error(
    "[BookLoop] VITE_API_URL não foi definida no build de produção. " +
      "A aplicação não conseguirá falar com a API até ser rebuildada com a URL correta.",
  );
  return "/api/v1";
}

export const API_BASE_URL = resolveApiBaseUrl();
export const IS_DEV = import.meta.env.DEV;
