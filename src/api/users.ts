import { api } from "@/lib/api";
import type { ApiResponse, User } from "@/types";

export interface ProfileInput {
  name?: string;
  bio?: string;
  city?: string;
  state?: string;
  addressLine?: string;
  neighborhood?: string;
  postalCode?: string;
  avatarUrl?: string;
}

export async function getMe() {
  const res = await api.get<ApiResponse<User>>("/users/me");
  return res.data.data;
}

export async function updateProfile(input: ProfileInput) {
  const res = await api.put<ApiResponse<User>>("/users/me", input);
  return res.data.data;
}
