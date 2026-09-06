import { api } from "@/lib/api";
import type { ApiResponse } from "@/types";
import type { BookInput } from "@/api/books";

export interface Organization {
  id: string;
  code: string;
  name: string;
  description: string;
  avatarUrl?: string;
  plan: string;
  memberLimit: number;
  status: string;
  myRole: "OWNER" | "ADMIN" | "MEMBER";
  createdAt: string;
}

export interface CreateOrganizationInput {
  name: string;
  description: string;
  firstBook: BookInput;
}

export async function createOrganization(input: CreateOrganizationInput) {
  const res = await api.post<ApiResponse<Organization>>("/organizations", input);
  return res.data.data;
}

export async function myOrganizations() {
  const res = await api.get<ApiResponse<Organization[]>>("/organizations");
  return res.data.data;
}

export async function getOrganization(orgId: string) {
  const res = await api.get<ApiResponse<Organization>>(`/orgs/${orgId}`);
  return res.data.data;
}
