import { Loader2, MessagesSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import type { Review } from "@/api/reviews";

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
        <li key={r.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={r.authorAvatarUrl} alt={r.authorName} />
              <AvatarFallback>{r.authorName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{r.authorName}</p>
              <p className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</p>
            </div>
            <StarRating value={r.rating} size={14} />
          </div>
          {r.comment && (
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">"{r.comment}"</p>
          )}
        </li>
      ))}
    </ul>
  );
}
