import { api } from "@/lib/api";
import { orgPath } from "@/lib/orgPath";
import type { ApiResponse } from "@/types";

export interface Member {
  membershipId: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  since: string;
}

export async function listMembers() {
  const res = await api.get<ApiResponse<Member[]>>(orgPath("/members"));
  return res.data.data;
}

export async function promoteMember(membershipId: string) {
  const res = await api.patch<ApiResponse<Member>>(orgPath(`/members/${membershipId}/promote`));
  return res.data.data;
}

export async function demoteMember(membershipId: string) {
  const res = await api.patch<ApiResponse<Member>>(orgPath(`/members/${membershipId}/demote`));
  return res.data.data;
}

export async function removeMember(membershipId: string) {
  await api.delete(orgPath(`/members/${membershipId}`));
}
