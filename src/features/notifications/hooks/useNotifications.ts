import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import {
  getNotifications, getUnreadNotifications, getUnreadCount, markAsRead, markAllAsRead,
} from "../api/notificationApi";

const KEY = ["notifications"] as const;
const POLL_MS = 30_000; // contador de não lidas atualiza a cada 30s

/** Contador de não lidas com polling — desligado quando não autenticado. */
export function useUnreadCount() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: [...KEY, "unread-count"],
    queryFn: getUnreadCount,
    enabled: isAuthenticated,
    refetchInterval: isAuthenticated ? POLL_MS : false,
    refetchIntervalInBackground: false,
  });
}

export function useNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: [...KEY, "list"],
    queryFn: () => getNotifications(0, 20),
    enabled: isAuthenticated,
  });
}

export function useUnreadNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: [...KEY, "unread"],
    queryFn: getUnreadNotifications,
    enabled: isAuthenticated,
  });
}

export function useMarkNotificationAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useMarkAllNotificationsAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
