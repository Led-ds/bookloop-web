import { BellOff } from "lucide-react";

export function NotificationEmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
      <BellOff className="h-8 w-8 text-gray-300" aria-hidden="true" />
      <p className="text-sm text-gray-500">Você ainda não possui notificações.</p>
    </div>
  );
}
