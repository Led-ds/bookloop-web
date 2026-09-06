import { api } from "@/lib/api";
import { orgPath } from "@/lib/orgPath";
import type { ApiResponse, AuthResponse } from "@/types";

export interface Invitation {
  id: string;
  email: string | null;
  token: string;
  role: string;
  status: string;
  expiresAt: string;
  createdAt: string;
}

export interface InvitationPreview {
  organizationName: string | null;
  organizationDescription: string | null;
  invitedByName: string | null;
  valid: boolean;
  reason: string | null;
}

/** Gera convite na comunidade ativa (Owner/Admin). email vazio = código aberto. */
export async function createInvitation(email?: string) {
  const res = await api.post<ApiResponse<Invitation>>(orgPath("/invitations"), { email: email || null });
  return res.data.data;
}

export async function pendingInvitations() {
  const res = await api.get<ApiResponse<Invitation[]>>(orgPath("/invitations"));
  return res.data.data;
}

export async function cancelInvitation(invitationId: string) {
  await api.delete(orgPath(`/invitations/${invitationId}`));
}

/** Prévia pública do convite (sem login). */
export async function previewInvitation(token: string) {
  const res = await api.get<ApiResponse<InvitationPreview>>(`/public/invitations/${token}`);
  return res.data.data;
}

/** Aceita o convite. Novo usuário envia name+password; logado envia vazio. */
export async function acceptInvitation(token: string, body?: { name: string; password: string }) {
  const res = await api.post<ApiResponse<AuthResponse>>(`/invitations/${token}/accept`, body ?? {});
  return res.data.data;
}
