import { CheckCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { useNotifications, useMarkAllNotificationsAsRead } from "../hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";
import { NotificationEmptyState } from "./NotificationEmptyState";

export function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { data, isLoading, isError } = useNotifications();
  const markAll = useMarkAllNotificationsAsRead();
  const items = data?.content ?? [];
  const hasUnread = items.some((n) => !n.read);

  return (
    <div
      role="dialog"
      aria-label="Notificações"
      className={cn(
        "absolute right-0 top-full z-50 mt-2 flex max-h-[70vh] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg",
        "sm:w-96",
      )}
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Notificações</h2>
        <button
          onClick={() => markAll.mutate()}
          disabled={!hasUnread || markAll.isPending}
          className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline disabled:cursor-not-allowed disabled:text-gray-300 disabled:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
        >
          <CheckCheck className="h-3.5 w-3.5" /> Marcar todas como lidas
        </button>
      </div>

      <div className="overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando...
          </div>
        ) : isError ? (
          <p className="px-4 py-10 text-center text-sm text-gray-500">
            Não foi possível carregar suas notificações. Tente novamente em instantes.
          </p>
        ) : items.length === 0 ? (
          <NotificationEmptyState />
        ) : (
          <ul className="divide-y divide-gray-100">
            {items.map((n) => (
              <NotificationItem key={n.id} notification={n} onNavigate={onClose} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
