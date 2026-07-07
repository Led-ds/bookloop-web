import { useState } from "react";
import { Link } from "react-router-dom";
import { BookX, Calendar, Library, Star } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RowListSkeleton, EmptyState } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { apiError } from "@/lib/apiError";
import { useMyRentals, useRentalAction, type RentalActionType } from "./useRentals";
import type { Rental } from "@/types";
import { usePendingReviews } from "@/features/reviews/useReviews";
import { ReviewDialog } from "@/features/reviews/ReviewDialog";

function fmt(d?: string) {
  return d ? new Date(d).toLocaleDateString("pt-BR") : "—";
}

const ACTION_DONE: Record<RentalActionType, string> = {
  approve: "Solicitação aprovada.",
  reject: "Solicitação rejeitada.",
  activate: "Empréstimo marcado como entregue.",
  cancel: "Solicitação cancelada.",
  return: "Devolução registrada.",
  "return-request": "Devolução marcada. Aguardando o dono confirmar o recebimento.",
  "return-confirm": "Recebimento confirmado. Empréstimo devolvido.",
};

/** Hook local que aplica uma ação e dá feedback via toast. Reusado por MyRentals e Lendings. */
export function useRentalActionWithToast() {
  const action = useRentalAction();
  const { success, error } = useToast();
  const run = (id: string, a: RentalActionType) =>
    action.mutate(
      { id, action: a },
      { onSuccess: () => success(ACTION_DONE[a]), onError: (err) => error(apiError(err)) },
    );
  return { run, busy: action.isPending };
}

export function MyRentalsPage() {
  const { data, isLoading } = useMyRentals();
  const { run, busy } = useRentalActionWithToast();
  const rentals = data?.content ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Meus aluguéis</h1>
      <p className="mb-6 text-sm text-gray-500">Livros que você solicitou.</p>

      {isLoading ? (
        <RowListSkeleton />
      ) : rentals.length === 0 ? (
        <EmptyState
          icon={<BookX className="h-10 w-10" />}
          title="Você ainda não solicitou nenhum livro"
          hint="Encontre um título no acervo e faça sua primeira solicitação."
          action={
            <Link to="/app">
              <Button variant="outline"><Library className="h-4 w-4" /> Explorar acervo</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {rentals.map((r) => (
            <RentalRow key={r.id} rental={r} role="renter" onAction={(a) => run(r.id, a)} busy={busy} />
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
  onAction: (a: RentalActionType) => void;
  busy: boolean;
}) {
  const [reviewing, setReviewing] = useState(false);
  const { data: pending = [] } = usePendingReviews();
  const canReview = pending.find((p) => p.rentalId === r.id);
  const showReview = r.status === "RETURNED" && !!canReview && (canReview.canReviewBook || canReview.canReviewUser);

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
        {role === "renter" && (r.status === "ACTIVE" || r.status === "OVERDUE") && (
          <Button onClick={() => onAction("return-request")} disabled={busy}>Devolvi</Button>
        )}
        {role === "owner" && (r.status === "ACTIVE" || r.status === "OVERDUE") && (
          <Button onClick={() => onAction("return")} disabled={busy}>Registrar devolução</Button>
        )}
        {role === "owner" && r.status === "RETURN_REQUESTED" && (
          <Button onClick={() => onAction("return-confirm")} disabled={busy}>Confirmar recebimento</Button>
        )}
        {role === "renter" && (r.status === "PENDING" || r.status === "APPROVED") && (
          <Button variant="outline" onClick={() => onAction("cancel")} disabled={busy}>Cancelar</Button>
        )}
        {showReview && (
          <Button variant="outline" onClick={() => setReviewing(true)}>
            <Star className="h-4 w-4" /> Avaliar
          </Button>
        )}
      </div>

      {reviewing && canReview && (
        <ReviewDialog pending={canReview} onClose={() => setReviewing(false)} />
      )}
    </div>
  );
}
