import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, ImageOff } from "lucide-react";
import { createBook, type BookInput } from "@/api/books";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";
import { apiError, apiFieldErrors } from "@/lib/apiError";
import { GENRES, CONDITIONS, genreLabel, conditionLabel } from "@/lib/constants";
import { BOOK_CONSTRAINTS, counterState, isValidUrl, validateAll } from "@/lib/validation";

const FIELD_ORDER = ["title", "author", "genre", "condition", "isbn", "coverUrl", "description"];

const controlClass = (invalid: boolean) =>
  cn(
    "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1",
    invalid
      ? "border-red-400 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-brand-500 focus:ring-brand-500",
  );

export function NewBookPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { success } = useToast();

  const [form, setForm] = useState<BookInput>({
    title: "", author: "", isbn: "", genre: "FICCAO",
    description: "", condition: "BOM", coverUrl: "", isPublic: true,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: (payload: BookInput) => createBook(payload),
    onSuccess: (book) => {
      qc.invalidateQueries({ queryKey: ["books"] });
      success("Livro cadastrado com sucesso.");
      navigate(`/books/${book.id}`);
    },
    onError: (err) => setServerErrors(apiFieldErrors(err)),
  });

  const clientErrors = useMemo(() => validateAll(form, BOOK_CONSTRAINTS), [form]);

  const set = (k: keyof BookInput, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    setServerErrors((e) => {
      if (!(k in e)) return e;
      const { [k]: _drop, ...rest } = e;
      return rest;
    });
  };
  const markTouched = (k: string) => setTouched((t) => ({ ...t, [k]: true }));

  const errorFor = (k: string): string | undefined => {
    const live = touched[k] || submitAttempted ? clientErrors[k] : undefined;
    return live ?? serverErrors[k];
  };

  const counter = (k: string) => {
    const max = BOOK_CONSTRAINTS[k]?.maxLength;
    if (!max) return undefined;
    const value = String(form[k as keyof BookInput] ?? "").length;
    return { value, max, state: counterState(value, max) };
  };

  const summary = useMemo(() => {
    const merged: Record<string, string> = { ...serverErrors };
    if (submitAttempted) Object.assign(merged, clientErrors);
    return FIELD_ORDER.filter((k) => merged[k]).map((k) => ({
      field: k,
      label: BOOK_CONSTRAINTS[k]?.label ?? k,
      message: merged[k],
    }));
  }, [clientErrors, serverErrors, submitAttempted]);

  const generalError =
    mutation.isError && Object.keys(serverErrors).length === 0 ? apiError(mutation.error) : null;

  const focusField = (id: string) =>
    requestAnimationFrame(() => document.getElementById(id)?.focus());

  const onSubmit = () => {
    setSubmitAttempted(true);
    const errs = validateAll(form, BOOK_CONSTRAINTS);
    if (Object.keys(errs).length > 0) {
      const first = FIELD_ORDER.find((k) => errs[k]);
      if (first) focusField(first);
      return;
    }
    if (mutation.isPending) return;
    mutation.mutate({
      ...form,
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn?.trim(),
      description: form.description?.trim(),
      coverUrl: form.coverUrl?.trim(),
    });
  };

  const showPreview = !!form.coverUrl && isValidUrl(form.coverUrl.trim());

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Cadastrar livro</h1>
      <p className="mb-6 text-sm text-gray-500">
        Campos marcados com <span className="text-red-500">*</span> são obrigatórios.
      </p>

      {submitAttempted && summary.length > 0 && (
        <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-800">
            <AlertCircle className="h-4 w-4" />
            Corrija {summary.length === 1 ? "o campo abaixo" : `os ${summary.length} campos abaixo`}:
          </div>
          <ul className="ml-1 space-y-1 text-sm text-red-700">
            {summary.map((e) => (
              <li key={e.field}>
                <button
                  type="button"
                  onClick={() => focusField(e.field)}
                  className="underline underline-offset-2 hover:text-red-900"
                >
                  {e.label}
                </button>
                : {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <Field id="title" label="Título" required error={errorFor("title")} counter={counter("title")}>
          <Input id="title" value={form.title} invalid={!!errorFor("title")}
                 onChange={(e) => set("title", e.target.value)} onBlur={() => markTouched("title")}
                 aria-describedby={errorFor("title") ? "title-error" : undefined} />
        </Field>

        <Field id="author" label="Autor" required error={errorFor("author")} counter={counter("author")}>
          <Input id="author" value={form.author} invalid={!!errorFor("author")}
                 onChange={(e) => set("author", e.target.value)} onBlur={() => markTouched("author")}
                 aria-describedby={errorFor("author") ? "author-error" : undefined} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field id="genre" label="Gênero">
            <select id="genre" value={form.genre} onChange={(e) => set("genre", e.target.value)}
                    className={controlClass(false)}>
              {GENRES.map((g) => <option key={g} value={g}>{genreLabel(g)}</option>)}
            </select>
          </Field>
          <Field id="condition" label="Estado">
            <select id="condition" value={form.condition} onChange={(e) => set("condition", e.target.value)}
                    className={controlClass(false)}>
              {CONDITIONS.map((c) => <option key={c} value={c}>{conditionLabel(c)}</option>)}
            </select>
          </Field>
        </div>

        <Field id="isbn" label="ISBN" error={errorFor("isbn")} counter={counter("isbn")}
               hint="Opcional. Use um único código — de preferência o ISBN-13 (13 dígitos).">
          <Input id="isbn" value={form.isbn} invalid={!!errorFor("isbn")}
                 onChange={(e) => set("isbn", e.target.value)} onBlur={() => markTouched("isbn")}
                 aria-describedby={errorFor("isbn") ? "isbn-error" : "isbn-hint"} />
        </Field>

        <Field id="coverUrl" label="URL da capa" error={errorFor("coverUrl")}
               hint="Opcional. Link http(s) para a imagem da capa.">
          <Input id="coverUrl" value={form.coverUrl} invalid={!!errorFor("coverUrl")}
                 onChange={(e) => set("coverUrl", e.target.value)} onBlur={() => markTouched("coverUrl")}
                 placeholder="https://..."
                 aria-describedby={errorFor("coverUrl") ? "coverUrl-error" : "coverUrl-hint"} />
        </Field>

        {showPreview && (
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">Prévia da capa</p>
            <div className="flex h-40 w-28 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <img
                src={form.coverUrl!.trim()}
                alt="Prévia da capa"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove("hidden");
                }}
              />
              <div className="hidden flex-col items-center gap-1 text-gray-400">
                <ImageOff className="h-6 w-6" />
                <span className="text-[11px]">Não carregou</span>
              </div>
            </div>
          </div>
        )}

        <Field id="description" label="Descrição" error={errorFor("description")} counter={counter("description")}>
          <textarea id="description" value={form.description}
                    onChange={(e) => set("description", e.target.value)} onBlur={() => markTouched("description")}
                    rows={4} aria-invalid={!!errorFor("description") || undefined}
                    aria-describedby={errorFor("description") ? "description-error" : undefined}
                    className={controlClass(!!errorFor("description"))} />
        </Field>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.isPublic}
                 onChange={(e) => set("isPublic", e.target.checked)}
                 className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          Visível publicamente no acervo
        </label>

        {generalError && <p role="alert" className="text-sm text-red-600">{generalError}</p>}

        <Button className="w-full" onClick={onSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? "Salvando..." : "Cadastrar livro"}
        </Button>
      </div>
    </div>
  );
}
