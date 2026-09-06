import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { apiError } from "@/lib/apiError";
import { GENRES, GENRE_LABEL, CONDITIONS, CONDITION_LABEL } from "@/lib/constants";
import { useCreateOrganization } from "./useOrganizations";
import { useOrganizationStore } from "@/store/organizationStore";

export function CreateOrganizationPage() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const setActive = useOrganizationStore((s) => s.setActive);
  const createOrg = useCreateOrganization();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [genre, setGenre] = useState<string>(GENRES[0]);
  const [condition, setCondition] = useState<string>(CONDITIONS[2]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    createOrg.mutate(
      {
        name,
        description,
        firstBook: { title: bookTitle, author: bookAuthor, genre, condition, isPublic: true },
      },
      {
        onSuccess: (org) => {
          setActive({ id: org.id, name: org.name, role: org.myRole });
          success("Comunidade criada! Bem-vindo(a).");
          navigate(`/app/${org.id}`);
        },
        onError: (err) => error(apiError(err)),
      }
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
          <Link to="/app" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold text-primary">Nova comunidade</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-muted-foreground">
          Comunidades de leitura começam com um livro e uma pessoa. Dê um nome à sua e cadastre o primeiro livro da estante.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold">A comunidade</h2>
            <div className="mt-4 space-y-4">
              <Field id="name" label="Nome" required>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120}
                  placeholder="Ex.: Igreja Betel, Clube da Ana, Turma 2026" required />
              </Field>
              <Field id="description" label="Descrição" required>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500}
                  placeholder="Do que se trata a sua comunidade?" required />
              </Field>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold">O primeiro livro</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field id="bookTitle" label="Título" required>
                <Input id="bookTitle" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} required />
              </Field>
              <Field id="bookAuthor" label="Autor" required>
                <Input id="bookAuthor" value={bookAuthor} onChange={(e) => setBookAuthor(e.target.value)} required />
              </Field>
              <Field id="genre" label="Gênero" required>
                <select id="genre" value={genre} onChange={(e) => setGenre(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm">
                  {GENRES.map((g) => <option key={g} value={g}>{GENRE_LABEL[g] ?? g}</option>)}
                </select>
              </Field>
              <Field id="condition" label="Conservação" required>
                <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm">
                  {CONDITIONS.map((c) => <option key={c} value={c}>{CONDITION_LABEL[c] ?? c}</option>)}
                </select>
              </Field>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link to="/app"><Button type="button" variant="ghost">Cancelar</Button></Link>
            <Button type="submit" size="lg" disabled={createOrg.isPending}>
              {createOrg.isPending ? "Criando…" : "Criar comunidade"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
