import { api } from "@/lib/api";
import type { ApiResponse, AuthResponse, User } from "@/types";

export async function login(email: string, password: string) {
  const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", { email, password });
  return res.data.data;
}

export async function register(name: string, email: string, password: string) {
  const res = await api.post<ApiResponse<AuthResponse>>("/auth/register", { name, email, password });
  return res.data.data;
}

export async function getMe() {
  const res = await api.get<ApiResponse<User>>("/users/me");
  return res.data.data;
}
