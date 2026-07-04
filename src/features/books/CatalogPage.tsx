import { useState } from "react";
import { Search, BookX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CatalogSkeleton, EmptyState } from "@/components/ui/skeleton";
import { useBooksSearch } from "./useBooks";
import { BookCard } from "./BookCard";
import { GENRES, genreLabel } from "@/lib/constants";
import { useDebounce } from "@/lib/useDebounce";

export function CatalogPage() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("");
  const debouncedQ = useDebounce(q);

  const { data, isLoading, isError } = useBooksSearch({
    q: debouncedQ || undefined,
    genre: genre || undefined,
  });

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
            aria-label="Buscar no acervo"
          />
        </div>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          aria-label="Filtrar por gênero"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">Todos os gêneros</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>{genreLabel(g)}</option>
          ))}
        </select>
      </div>

      {isLoading && <CatalogSkeleton />}

      {isError && (
        <p role="alert" className="py-20 text-center text-sm text-red-600">
          Não foi possível carregar o acervo. Tente novamente em instantes.
        </p>
      )}

      {data && data.content.length === 0 && (
        <EmptyState
          icon={<BookX className="h-10 w-10" />}
          title={q || genre ? "Nenhum livro encontrado" : "O acervo ainda está vazio"}
          hint={
            q || genre
              ? "Tente outros termos de busca ou remova o filtro de gênero."
              : "Assim que livros forem cadastrados, eles aparecem aqui."
          }
        />
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
