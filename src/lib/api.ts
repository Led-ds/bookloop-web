import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";
import { API_BASE_URL } from "@/lib/env";
import type { ApiResponse, AuthResponse } from "@/types";

export const api = axios.create({ baseURL: API_BASE_URL });

// Handler acionado quando a sessão não pode ser recuperada (refresh falhou/ausente).
// Registrado pela camada de UI para redirecionar sem acoplar o axios ao router.
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn;
}

// Anexa o access token a cada requisição.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh transparente, deduplicado: 401s concorrentes compartilham a MESMA promise,
// evitando múltiplas chamadas e loops.
let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function doRefresh(): Promise<string | null> {
  const { refreshToken, setAccessToken } = useAuthStore.getState();
  if (!refreshToken) return null;
  try {
    // Instância "crua" (sem interceptors) para o refresh não se auto-disparar.
    const res = await axios.post<ApiResponse<AuthResponse>>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken },
    );
    const newToken = res.data.data.accessToken;
    setAccessToken(newToken);
    return newToken;
  } catch {
    return null;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;
    const isAuthCall = original?.url?.includes("/auth/");
    const status = error.response?.status;

    if (status === 401 && original && !original._retried && !isAuthCall) {
      original._retried = true;
      const token = await refreshAccessToken();
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
      // Refresh falhou: sessão encerrada de forma limpa + redirecionamento.
      useAuthStore.getState().logout();
      onUnauthorized?.();
    }

    return Promise.reject(error);
  },
);
