import { useState } from "react";
import { Loader2, MessagesSquare, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { useToast } from "@/components/ui/toast";
import { apiError } from "@/lib/apiError";
import { useAuthStore } from "@/store/authStore";
import type { Review } from "@/api/reviews";
import { useUpdateReview } from "./useReviews";
import { StarRatingInput } from "./StarRatingInput";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch {
    return "";
  }
}

/** Resumo de reputação (média + contagem), calculado a partir das avaliações carregadas. */
export function RatingSummary({ reviews, totalCount }: { reviews: Review[]; totalCount?: number }) {
  const count = totalCount ?? reviews.length;
  if (count === 0) return null;
  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;
  return (
    <div className="flex items-center gap-2">
      <StarRating value={avg} size={16} showValue />
      <span className="text-sm text-muted-foreground">
        · {count} {count === 1 ? "avaliação" : "avaliações"}
      </span>
    </div>
  );
}

function ReviewEditForm({ review, onDone }: { review: Review; onDone: () => void }) {
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment ?? "");
  const update = useUpdateReview();
  const { success, error } = useToast();

  const save = () => {
    if (rating < 1) {
      error("Escolha de 1 a 5 estrelas.");
      return;
    }
    update.mutate(
      { id: review.id, rating, comment: comment.trim() || undefined },
      {
        onSuccess: () => { success("Avaliação atualizada."); onDone(); },
        onError: (e) => error(apiError(e)),
      },
    );
  };

  return (
    <li className="rounded-xl border border-primary/30 bg-card p-4">
      <StarRatingInput value={rating} onChange={setRating} size={22} />
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
        <div className="flex gap-2">
          <Button variant="outline" onClick={onDone} disabled={update.isPending}>Cancelar</Button>
          <Button onClick={save} disabled={update.isPending}>Salvar</Button>
        </div>
      </div>
    </li>
  );
}

function ReviewItem({ review }: { review: Review }) {
  const me = useAuthStore((s) => s.user);
  const isMine = !!me && me.id === review.authorId;
  const [editing, setEditing] = useState(false);

  if (editing) return <ReviewEditForm review={review} onDone={() => setEditing(false)} />;

  return (
    <li className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={review.authorAvatarUrl} alt={review.authorName} />
          <AvatarFallback>{review.authorName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{review.authorName}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(review.createdAt)}
            {review.edited && <span className="ml-1">· (editado)</span>}
          </p>
        </div>
        <StarRating value={review.rating} size={14} />
      </div>
      {review.comment && (
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">"{review.comment}"</p>
      )}
      {isMine && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <Pencil className="h-3.5 w-3.5" /> Editar
          </button>
        </div>
      )}
    </li>
  );
}

/** Lista de avaliações reutilizável (detalhe do livro e perfil). */
export function ReviewList({
  reviews,
  isLoading,
  emptyLabel,
}: {
  reviews: Review[];
  isLoading?: boolean;
  emptyLabel: string;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8 text-primary">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  if (!reviews.length) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-6 py-10 text-center">
        <MessagesSquare className="h-8 w-8 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      {reviews.map((r) => (
        <ReviewItem key={r.id} review={r} />
      ))}
    </ul>
  );
}
