import { Bookmark, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { apiError } from "@/lib/apiError";
import type { ReservationStatus } from "@/api/reservations";
import {
  useAcceptReservation, useDeclineReservation, useLeaveReservation, useMyReservations,
} from "./useReservations";
import { OfferCountdown } from "./OfferCountdown";

const STATUS: Record<ReservationStatus, { text: string; cls: string }> = {
  WAITING:  { text: "Na fila",               cls: "bg-amber-100 text-amber-800" },
  OFFERED:  { text: "Disponível para você",  cls: "bg-green-100 text-green-800" },
  ACCEPTED: { text: "Aceita",                cls: "bg-blue-100 text-blue-800" },
  DECLINED: { text: "Recusada",              cls: "bg-gray-100 text-gray-600" },
  EXPIRED:  { text: "Expirada",              cls: "bg-gray-100 text-gray-600" },
};

export function MyReservationsPage() {
  const { data: reservations = [], isLoading } = useMyReservations();
  const accept = useAcceptReservation();
  const decline = useDeclineReservation();
  const leave = useLeaveReservation();
  const { success, error } = useToast();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
        <Bookmark className="h-5 w-5 text-primary" /> Minhas reservas
      </h1>

      {isLoading ? (
        <div className="flex justify-center py-12 text-primary"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : reservations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-muted-foreground">
          Você não tem reservas. Ao encontrar um livro indisponível, entre na fila pelo detalhe do livro.
        </div>
      ) : (
        <ul className="space-y-3">
          {reservations.map((r) => (
            <li key={r.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <Link to={`/app/books/${r.bookId}`} className="min-w-0 flex-1 truncate font-medium text-foreground hover:underline">
                  {r.bookTitle}
                </Link>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS[r.status].cls}`}>
                  {STATUS[r.status].text}
                </span>
              </div>

              {r.status === "WAITING" && (
                <p className="mt-1 text-sm text-muted-foreground">Posição na fila: <strong className="text-foreground">Nº {r.position}</strong></p>
              )}
              {r.status === "OFFERED" && r.offerExpiresAt && (
                <p className="mt-1 text-xs text-muted-foreground"><OfferCountdown expiresAt={r.offerExpiresAt} /></p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {r.status === "OFFERED" && (
                  <>
                    <Button onClick={() => accept.mutate(r.id, { onSuccess: () => success("Reserva aceita!"), onError: (e) => error(apiError(e)) })} disabled={accept.isPending}>Aceitar</Button>
                    <Button variant="outline" onClick={() => decline.mutate(r.id, { onSuccess: () => success("Você recusou."), onError: (e) => error(apiError(e)) })} disabled={decline.isPending}>Recusar</Button>
                  </>
                )}
                {r.status === "WAITING" && (
                  <Button variant="outline" onClick={() => leave.mutate(r.id, { onSuccess: () => success("Você saiu da fila."), onError: (e) => error(apiError(e)) })} disabled={leave.isPending}>Sair da fila</Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
