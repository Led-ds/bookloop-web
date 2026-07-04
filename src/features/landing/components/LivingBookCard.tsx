import { BookMarked, Repeat, Star, Users } from "lucide-react";
import type { LivingBook } from "../data/types";
import { genreLabel } from "@/lib/constants";

/** Cartão de "livro vivo": mostra o livro com suas estatísticas de circulação.
 *  Display-only (landing pública) — não navega para rotas autenticadas. */
export function LivingBookCard({ book }: { book: LivingBook }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex aspect-[3/4] items-center justify-center bg-brand-50">
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={`Capa de ${book.title}`} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <BookMarked className="h-12 w-12 text-brand-300" aria-hidden="true" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">{book.title}</h3>
        <p className="text-xs text-gray-500">{book.author}</p>
        <span className="mt-1 inline-block w-fit rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
          {genreLabel(book.genre)}
        </span>
        <dl className="mt-3 grid grid-cols-3 gap-1 border-t border-gray-100 pt-3 text-center text-[11px] text-gray-600">
          <div>
            <dt className="sr-only">Emprestado</dt>
            <dd className="flex flex-col items-center gap-0.5">
              <Repeat className="h-3.5 w-3.5 text-brand-500" /> {book.timesLent}x
            </dd>
          </div>
          <div>
            <dt className="sr-only">Leitores</dt>
            <dd className="flex flex-col items-center gap-0.5">
              <Users className="h-3.5 w-3.5 text-brand-500" /> {book.readers}
            </dd>
          </div>
          <div>
            <dt className="sr-only">Avaliação</dt>
            <dd className="flex flex-col items-center gap-0.5">
              <Star className="h-3.5 w-3.5 text-amber-500" /> {book.rating.toFixed(1)}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
