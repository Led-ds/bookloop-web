import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { apiError } from "@/lib/apiError";
import type { PendingReview } from "@/api/reviews";
import { useCreateReview } from "./useReviews";
import { StarRatingInput } from "./StarRatingInput";

function ReviewForm({
  title,
  busy,
  onSubmit,
}: {
  title: string;
  busy: boolean;
  onSubmit: (rating: number, comment?: string) => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { error } = useToast();

  const submit = () => {
    if (rating < 1) {
      error("Escolha de 1 a 5 estrelas.");
      return;
    }
    onSubmit(rating, comment.trim() || undefined);
  };

  return (
    <div className="mb-4 rounded-xl border border-border p-4">
      <p className="mb-2 text-sm font-medium text-foreground">{title}</p>
      <StarRatingInput value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, 150))}
        maxLength={150}
        rows={3}
        placeholder="Comentário (opcional, até 150 caracteres)"
        className="mt-3 w-full resize-none rounded-lg border border-input bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="mt-1 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{comment.length}/150</span>
        <Button onClick={submit} disabled={busy}>Enviar avaliação</Button>
      </div>
    </div>
  );
}

/** Modal que reúne as avaliações possíveis de um aluguel devolvido (livro e/ou contraparte). */
export function ReviewDialog({
  pending,
  onClose,
}: {
  pending: PendingReview;
  onClose: () => void;
}) {
  const create = useCreateReview();
  const { success, error } = useToast();
  const [bookDone, setBookDone] = useState(!pending.canReviewBook);
  const [userDone, setUserDone] = useState(!pending.canReviewUser);

  const submitBook = (rating: number, comment?: string) =>
    create.mutate(
      { rentalId: pending.rentalId, type: "BOOK", rating, comment },
      {
        onSuccess: () => { setBookDone(true); success("Avaliação do livro registrada."); },
        onError: (e) => error(apiError(e)),
      },
    );

  const submitUser = (rating: number, comment?: string) =>
    create.mutate(
      { rentalId: pending.rentalId, type: "USER", targetUserId: pending.counterpartId, rating, comment },
      {
        onSuccess: () => { setUserDone(true); success("Avaliação registrada."); },
        onError: (e) => error(apiError(e)),
      },
    );

  // Fecha sozinho quando não há mais nada a avaliar.
  useEffect(() => {
    if (bookDone && userDone) onClose();
  }, [bookDone, userDone, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Avaliar</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-muted" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        {pending.canReviewBook && !bookDone && (
          <ReviewForm title={`Livro "${pending.bookTitle}"`} busy={create.isPending} onSubmit={submitBook} />
        )}
        {pending.canReviewUser && !userDone && (
          <ReviewForm title={pending.counterpartName} busy={create.isPending} onSubmit={submitUser} />
        )}
      </div>
    </div>
  );
}
