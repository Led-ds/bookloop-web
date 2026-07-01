import { Loader2, BookX, Calendar } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMyRentals, useRentalAction } from "./useRentals";
import type { Rental } from "@/types";

function fmt(d?: string) {
  return d ? new Date(d).toLocaleDateString("pt-BR") : "—";
}

export function MyRentalsPage() {
  const { data, isLoading } = useMyRentals();
  const action = useRentalAction();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-brand-600">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const rentals = data?.content ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Meus aluguéis</h1>
      <p className="mb-6 text-sm text-gray-500">Livros que você solicitou.</p>

      {rentals.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20 text-gray-400">
          <BookX className="h-10 w-10" />
          <p className="text-sm">Você ainda não solicitou nenhum livro.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rentals.map((r) => (
            <RentalRow key={r.id} rental={r} role="renter" onAction={(a) => action.mutate({ id: r.id, action: a })} busy={action.isPending} />
          ))}
        </div>
      )}
    </div>
  );
}

export function RentalRow({
  rental: r, role, onAction, busy,
}: {
  rental: Rental;
  role: "renter" | "owner";
  onAction: (a: "approve" | "reject" | "activate" | "cancel" | "return") => void;
  busy: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900">{r.bookTitle}</h3>
          <p className="text-sm text-gray-500">
            {role === "renter" ? `Dono: ${r.ownerName}` : `Solicitante: ${r.renterName}`}
          </p>
        </div>
        <StatusBadge status={r.status} />
      </div>

      <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
        <Calendar className="h-3.5 w-3.5" /> {fmt(r.startDate)} → {fmt(r.endDate)}
        {r.returnDate && <span className="ml-2">· devolvido {fmt(r.returnDate)}</span>}
      </div>

      {r.message && <p className="mt-2 rounded bg-gray-50 p-2 text-sm text-gray-600">{r.message}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {role === "owner" && r.status === "PENDING" && (
          <>
            <Button onClick={() => onAction("approve")} disabled={busy}>Aprovar</Button>
            <Button variant="danger" onClick={() => onAction("reject")} disabled={busy}>Rejeitar</Button>
          </>
        )}
        {role === "owner" && r.status === "APPROVED" && (
          <Button onClick={() => onAction("activate")} disabled={busy}>Marcar como entregue</Button>
        )}
        {role === "owner" && (r.status === "ACTIVE" || r.status === "LATE") && (
          <Button onClick={() => onAction("return")} disabled={busy}>Registrar devolução</Button>
        )}
        {role === "renter" && (r.status === "PENDING" || r.status === "APPROVED") && (
          <Button variant="outline" onClick={() => onAction("cancel")} disabled={busy}>Cancelar</Button>
        )}
      </div>
    </div>
  );
}
