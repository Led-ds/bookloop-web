import { useState } from "react";
import { Search, Loader2, BookX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useBooksSearch } from "./useBooks";
import { BookCard } from "./BookCard";

const GENRES = [
  "", "FICCAO", "NAO_FICCAO", "FANTASIA", "ROMANCE", "SUSPENSE", "TERROR",
  "BIOGRAFIA", "TECNICO", "INFANTOJUVENIL", "HISTORIA", "AUTOAJUDA", "OUTRO",
];

const GENRE_LABEL: Record<string, string> = {
  "": "Todos os gêneros",
  FICCAO: "Ficção", NAO_FICCAO: "Não-ficção", FANTASIA: "Fantasia",
  ROMANCE: "Romance", SUSPENSE: "Suspense", TERROR: "Terror",
  BIOGRAFIA: "Biografia", TECNICO: "Técnico", INFANTOJUVENIL: "Infantojuvenil",
  HISTORIA: "História", AUTOAJUDA: "Autoajuda", OUTRO: "Outro",
};

export function CatalogPage() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("");
  const { data, isLoading, isError } = useBooksSearch({ q: q || undefined, genre: genre || undefined });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Explorar acervo</h1>
        <p className="text-sm text-gray-500">Compartilhar é gerar conexões.</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="Buscar por título ou autor..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          {GENRES.map((g) => (
            <option key={g} value={g}>{GENRE_LABEL[g]}</option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20 text-brand-600">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {isError && (
        <p className="py-20 text-center text-sm text-red-600">
          Não foi possível carregar o acervo.
        </p>
      )}

      {data && data.content.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-20 text-gray-400">
          <BookX className="h-10 w-10" />
          <p className="text-sm">Nenhum livro encontrado.</p>
        </div>
      )}

      {data && data.content.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {data.content.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
