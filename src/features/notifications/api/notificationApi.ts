import { api } from "@/lib/api";
import type { ApiResponse, PageResponse } from "@/types";
import type { AppNotification, UnreadCount } from "../types";

export async function getNotifications(page = 0, size = 20) {
  const res = await api.get<ApiResponse<PageResponse<AppNotification>>>("/notifications", {
    params: { page, size },
  });
  return res.data.data;
}

export async function getUnreadNotifications() {
  const res = await api.get<ApiResponse<AppNotification[]>>("/notifications/unread");
  return res.data.data;
}

export async function getUnreadCount() {
  const res = await api.get<ApiResponse<UnreadCount>>("/notifications/unread/count");
  return res.data.data.count;
}

export async function markAsRead(id: string) {
  const res = await api.patch<ApiResponse<{ id: string; read: boolean; readAt: string | null }>>(
    `/notifications/${id}/read`,
  );
  return res.data.data;
}

export async function markAllAsRead() {
  const res = await api.patch<ApiResponse<UnreadCount>>("/notifications/read-all");
  return res.data.data.count;
}
