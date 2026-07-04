import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { timeAgo } from "../lib/timeAgo";
import { useMarkNotificationAsRead } from "../hooks/useNotifications";
import type { AppNotification } from "../types";

export function NotificationItem({
  notification: n,
  onNavigate,
}: {
  notification: AppNotification;
  onNavigate?: () => void;
}) {
  const navigate = useNavigate();
  const markRead = useMarkNotificationAsRead();

  const go = () => {
    if (!n.read) markRead.mutate(n.id);
    // Só navegamos por rotas internas do app (React Router), nunca window.location.
    if (n.actionUrl && n.actionUrl.startsWith("/")) {
      navigate(n.actionUrl);
      onNavigate?.();
    }
  };

  return (
    <li
      className={cn(
        "flex gap-3 px-4 py-3 transition hover:bg-gray-50",
        !n.read && "bg-brand-50/40",
      )}
    >
      <span
        className={cn(
          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
          n.read ? "bg-transparent" : "bg-brand-500",
        )}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm", n.read ? "text-gray-700" : "font-semibold text-gray-900")}>
          {n.title}
        </p>
        <p className="mt-0.5 text-sm text-gray-600">{n.message}</p>
        <div className="mt-1.5 flex items-center gap-3">
          <span className="text-xs text-gray-400">{timeAgo(n.createdAt)}</span>
          {n.actionUrl && (
            <button
              onClick={go}
              className="text-xs font-medium text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
            >
              Ver
            </button>
          )}
          {!n.read && (
            <button
              onClick={() => markRead.mutate(n.id)}
              disabled={markRead.isPending}
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
            >
              <Check className="h-3 w-3" /> Marcar como lida
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
