import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { apiError, apiErrorCode } from "@/lib/apiError";
import {
  useAcceptReservation, useCreateReservation, useDeclineReservation,
  useLeaveReservation, useMyReservations,
} from "./useReservations";
import { OfferCountdown } from "./OfferCountdown";

/** Controle de fila de reserva exibido no detalhe de um livro indisponível. */
export function ReservationControl({ bookId }: { bookId: string }) {
  const { data: reservations = [] } = useMyReservations();
  const mine = reservations.find(
    (r) => r.bookId === bookId && (r.status === "WAITING" || r.status === "OFFERED"),
  );
  const create = useCreateReservation();
  const accept = useAcceptReservation();
  const decline = useDeclineReservation();
  const leave = useLeaveReservation();
  const { success, error } = useToast();

  if (mine?.status === "OFFERED") {
    return (
      <div className="space-y-2 rounded-xl border border-primary/40 bg-secondary/40 p-3">
        <p className="text-sm font-medium text-primary">O livro está disponível para você! 🎉</p>
        {mine.offerExpiresAt && (
          <p className="text-xs text-muted-foreground">
            <OfferCountdown expiresAt={mine.offerExpiresAt} />
          </p>
        )}
        <div className="flex gap-2">
          <Button
            onClick={() => accept.mutate(mine.id, {
              onSuccess: () => success("Reserva aceita! Agora é só combinar o aluguel."),
              onError: (e) => error(apiError(e)),
            })}
            disabled={accept.isPending}
          >
            Aceitar
          </Button>
          <Button
            variant="outline"
            onClick={() => decline.mutate(mine.id, {
              onSuccess: () => success("Você recusou. Passamos a vez para o próximo da fila."),
              onError: (e) => error(apiError(e)),
            })}
            disabled={decline.isPending}
          >
            Recusar
          </Button>
        </div>
      </div>
    );
  }

  if (mine?.status === "WAITING") {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Você é o <strong className="text-foreground">Nº {mine.position}</strong> na fila de reserva.
        </p>
        <Button
          variant="outline"
          onClick={() => leave.mutate(mine.id, {
            onSuccess: () => success("Você saiu da fila."),
            onError: (e) => error(apiError(e)),
          })}
          disabled={leave.isPending}
        >
          Sair da fila
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Indisponível para aluguel no momento.</p>
      <Button
        onClick={() => create.mutate(bookId, {
          onSuccess: (r) => success(`Você entrou na fila (posição ${r.position}).`),
          onError: (e) => {
            const code = apiErrorCode(e);
            if (code === "ALREADY_IN_QUEUE") error("Você já está na fila deste livro.");
            else if (code === "BOOK_AVAILABLE") error("O livro está disponível — é só solicitar o aluguel.");
            else error(apiError(e));
          },
        })}
        disabled={create.isPending}
      >
        Entrar na fila
      </Button>
    </div>
  );
}
