import { useState } from "react";
import { Link } from "react-router-dom";
import { BookX, Calendar, Library, Star } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RowListSkeleton, EmptyState } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { apiError, apiErrorCode } from "@/lib/apiError";
import { useMyRentals, useRentalAction, useRequestRenewal, type RentalActionType } from "./useRentals";
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
  "renewal-approve": "Renovação aprovada.",
  "renewal-reject": "Renovação rejeitada.",
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
  const [renewOpen, setRenewOpen] = useState(false);
  const [newEndDate, setNewEndDate] = useState("");
  const renewal = useRequestRenewal();
  const { success, error } = useToast();
  const submitRenewal = () => {
    if (!newEndDate) { error("Escolha a nova data de devolução."); return; }
    renewal.mutate({ id: r.id, newEndDate }, {
      onSuccess: () => { success("Pedido de renovação enviado ao dono."); setRenewOpen(false); },
      onError: (e) => {
        if (apiErrorCode(e) === "RENEWAL_BLOCKED_BY_QUEUE") {
          error("Não dá pra renovar: há gente na fila de reserva deste livro.");
        } else { error(apiError(e)); }
      },
    });
  };
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
        {role === "renter" && (r.status === "ACTIVE" || r.status === "OVERDUE") && r.renewalStatus !== "REQUESTED" && (
          <Button variant="outline" onClick={() => setRenewOpen((v) => !v)} disabled={busy}>Solicitar renovação</Button>
        )}
        {role === "renter" && r.renewalStatus === "REQUESTED" && (
          <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800">
            Renovação solicitada{r.renewalRequestedUntil ? ` até ${fmt(r.renewalRequestedUntil)}` : ""} — aguardando o dono
          </span>
        )}
        {role === "owner" && r.renewalStatus === "REQUESTED" && (
          <>
            <span className="self-center text-xs text-gray-600">
              Renovação pedida{r.renewalRequestedUntil ? ` até ${fmt(r.renewalRequestedUntil)}` : ""}:
            </span>
            <Button onClick={() => onAction("renewal-approve")} disabled={busy}>Aprovar renovação</Button>
            <Button variant="danger" onClick={() => onAction("renewal-reject")} disabled={busy}>Rejeitar</Button>
          </>
        )}
        {showReview && (
          <Button variant="outline" onClick={() => setReviewing(true)}>
            <Star className="h-4 w-4" /> Avaliar
          </Button>
        )}
      </div>

      {renewOpen && (
        <div className="mt-3 rounded-lg border border-gray-200 p-3">
          <label className="text-sm text-gray-700">Nova data de devolução</label>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={newEndDate}
              min={r.endDate?.slice(0, 10)}
              onChange={(e) => setNewEndDate(e.target.value)}
              className="rounded-lg border border-input bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <Button onClick={submitRenewal} disabled={renewal.isPending}>Enviar pedido</Button>
            <Button variant="outline" onClick={() => setRenewOpen(false)} disabled={renewal.isPending}>Cancelar</Button>
          </div>
        </div>
      )}

      {reviewing && canReview && (
        <ReviewDialog pending={canReview} onClose={() => setReviewing(false)} />
      )}
    </div>
  );
}
