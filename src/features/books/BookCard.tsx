import { Link } from "react-router-dom";
import { BookMarked, User } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import type { BookSummary } from "@/types";

export function BookCard({ book }: { book: BookSummary }) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative flex aspect-[3/4] items-center justify-center bg-brand-50">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <BookMarked className="h-12 w-12 text-brand-300" />
        )}
        <div className="absolute right-2 top-2">
          <StatusBadge status={book.status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-brand-700">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500">{book.author}</p>
        <span className="mt-1 inline-block w-fit rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
          {book.genre}
        </span>
        <div className="mt-auto flex items-center gap-1 pt-2 text-xs text-gray-500">
          <User className="h-3.5 w-3.5" /> {book.ownerName}
        </div>
      </div>
    </Link>
  );
}
