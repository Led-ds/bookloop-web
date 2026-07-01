import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBook, type BookInput } from "@/api/books";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiError } from "@/lib/apiError";

const GENRES = [
  "FICCAO", "NAO_FICCAO", "FANTASIA", "ROMANCE", "SUSPENSE", "TERROR",
  "BIOGRAFIA", "TECNICO", "INFANTOJUVENIL", "HISTORIA", "AUTOAJUDA", "OUTRO",
];
const CONDITIONS = ["NOVO", "OTIMO", "BOM", "REGULAR", "DESGASTADO"];

export function NewBookPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState<BookInput>({
    title: "", author: "", isbn: "", genre: "FICCAO",
    description: "", condition: "BOM", coverUrl: "", isPublic: true,
  });

  const mutation = useMutation({
    mutationFn: () => createBook(form),
    onSuccess: (book) => {
      qc.invalidateQueries({ queryKey: ["books"] });
      navigate(`/books/${book.id}`);
    },
  });

  const set = (k: keyof BookInput, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Cadastrar livro</h1>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Título *</label>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Autor *</label>
          <Input value={form.author} onChange={(e) => set("author", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Gênero</label>
            <select
              value={form.genre}
              onChange={(e) => set("genre", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Estado</label>
            <select
              value={form.condition}
              onChange={(e) => set("condition", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">ISBN (opcional)</label>
          <Input value={form.isbn} onChange={(e) => set("isbn", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">URL da capa (opcional)</label>
          <Input value={form.coverUrl} onChange={(e) => set("coverUrl", e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(e) => set("isPublic", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          Visível publicamente no acervo
        </label>

        {mutation.isError && <p className="text-sm text-red-600">{apiError(mutation.error)}</p>}

        <Button
          className="w-full"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || !form.title.trim() || !form.author.trim()}
        >
          {mutation.isPending ? "Salvando..." : "Cadastrar livro"}
        </Button>
      </div>
    </div>
  );
}
