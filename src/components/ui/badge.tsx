import { cn } from "@/lib/cn";
import type { BookStatus, RentalStatus } from "@/types";

const labels: Record<string, { text: string; cls: string }> = {
  AVAILABLE:   { text: "Disponível", cls: "bg-green-100 text-green-800" },
  RESERVED:    { text: "Reservado",  cls: "bg-blue-100 text-blue-800" },
  RENTED:      { text: "Alugado",    cls: "bg-amber-100 text-amber-800" },
  UNAVAILABLE: { text: "Indisponível", cls: "bg-gray-100 text-gray-600" },
  PENDING:  { text: "Pendente",  cls: "bg-amber-100 text-amber-800" },
  APPROVED: { text: "Aprovado",  cls: "bg-blue-100 text-blue-800" },
  ACTIVE:   { text: "Ativo",     cls: "bg-green-100 text-green-800" },
  RETURN_REQUESTED: { text: "Devolução pendente", cls: "bg-orange-100 text-orange-800" },
  RETURNED: { text: "Devolvido", cls: "bg-gray-100 text-gray-700" },
  OVERDUE:  { text: "Atrasado",  cls: "bg-red-100 text-red-800" },
  LATE:     { text: "Atrasado",  cls: "bg-red-100 text-red-800" },
  REJECTED: { text: "Rejeitado", cls: "bg-red-100 text-red-800" },
  CANCELLED:{ text: "Cancelado", cls: "bg-gray-100 text-gray-600" },
};

export function StatusBadge({ status }: { status: BookStatus | RentalStatus }) {
  const item = labels[status] ?? { text: status, cls: "bg-gray-100 text-gray-700" };
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", item.cls)}>
      {item.text}
    </span>
  );
}
