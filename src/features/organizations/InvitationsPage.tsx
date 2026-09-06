import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { apiError } from "@/lib/apiError";
import { orgBase } from "@/lib/orgPath";
import { usePendingInvitations, useInvitationActions } from "./useInvitations";

export function InvitationsPage() {
  const { data: invites, isLoading } = usePendingInvitations();
  const { create, cancel } = useInvitationActions();
  const { success, error } = useToast();
  const [email, setEmail] = useState("");

  function generate(e: React.FormEvent) {
    e.preventDefault();
    create.mutate(email || undefined, {
      onSuccess: () => { success("Convite gerado."); setEmail(""); },
      onError: (err) => error(apiError(err)),
    });
  }

  function copyLink(token: string) {
    const url = `${window.location.origin}/convite/${token}`;
    navigator.clipboard.writeText(url).then(() => success("Link copiado!"));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to={`${orgBase()}/membros`} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Membros
      </Link>
      <h1 className="font-display text-2xl font-semibold">Convites</h1>
      <p className="mt-1 text-sm text-muted-foreground">Convide pessoas por e-mail ou gere um link de acesso.</p>

      <form onSubmit={generate} className="mt-6 flex items-end gap-3 rounded-xl border border-border bg-card p-4">
        <Field id="email" label="E-mail (opcional — vazio gera link aberto)">
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="pessoa@exemplo.com" />
        </Field>
        <Button type="submit" disabled={create.isPending}>
          <Plus className="h-4 w-4" /> {create.isPending ? "Gerando…" : "Gerar convite"}
        </Button>
      </form>

      <h2 className="mt-8 font-display text-lg font-semibold">Convites pendentes</h2>
      <div className="mt-3 space-y-3">
        {isLoading && [0, 1].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        {!isLoading && invites?.length === 0 && (
          <p className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Nenhum convite pendente.
          </p>
        )}
        {invites?.map((inv) => (
          <div key={inv.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{inv.email ?? "Convite por link aberto"}</p>
              <p className="truncate font-mono text-xs text-muted-foreground">
                expira em {new Date(inv.expiresAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <Button size="sm" variant="ghost" title="Copiar link" onClick={() => copyLink(inv.token)}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" title="Cancelar convite"
              onClick={() => cancel.mutate(inv.id, { onSuccess: () => success("Convite cancelado."), onError: (e) => error(apiError(e)) })}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
