import { AxiosError } from "axios";

/** Extracts the human-friendly message from our ApiResponse error envelope. */
export function apiError(err: unknown, fallback = "Algo deu errado."): string {
  if (err instanceof AxiosError) {
    return err.response?.data?.message ?? fallback;
  }
  return fallback;
}
