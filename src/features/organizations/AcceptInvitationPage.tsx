import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { apiError } from "@/lib/apiError";
import { previewInvitation, acceptInvitation } from "@/api/invitations";
import { useAuthStore } from "@/store/authStore";

export function AcceptInvitationPage() {
  const { token = "" } = useParams();
  const navigate = useNavigate();
  const { error } = useToast();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: preview, isLoading } = useQuery({
    queryKey: ["invitation-preview", token],
    queryFn: () => previewInvitation(token),
  });

  async function accept(e?: React.FormEvent) {
    e?.preventDefault();
    setSubmitting(true);
    try {
      const body = isAuthenticated ? undefined : { name, password };
      const auth = await acceptInvitation(token, body);
      setAuth(auth);
      navigate("/app");
    } catch (err) {
      error(apiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {isLoading && <Skeleton className="h-64 rounded-2xl" />}

        {!isLoading && preview && !preview.valid && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <h1 className="font-display text-xl font-semibold">Convite indisponível</h1>
            <p className="mt-2 text-sm text-muted-foreground">{preview.reason ?? "Este convite não é válido."}</p>
            <Link to="/" className="mt-6 inline-block"><Button variant="outline">Voltar ao início</Button></Link>
          </div>
        )}

        {!isLoading && preview?.valid && (
          <div className="overflow-hidden rounded-2xl border-2 border-secondary bg-secondary/40 p-8 text-center shadow-sm">
            <BookOpen className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-primary">Você foi convidado(a)</p>
            <h1 className="mt-2 font-display text-2xl font-semibold">{preview.organizationName}</h1>
            {preview.organizationDescription && (
              <p className="mt-1 text-sm text-muted-foreground">{preview.organizationDescription}</p>
            )}
            {preview.invitedByName && (
              <p className="mt-3 text-sm text-muted-foreground">Convite de <strong>{preview.invitedByName}</strong></p>
            )}

            <div className="mt-6">
              {isAuthenticated ? (
                <Button size="lg" className="w-full" onClick={() => accept()} disabled={submitting}>
                  {submitting ? "Entrando…" : "Aceitar e entrar"}
                </Button>
              ) : (
                <form onSubmit={accept} className="space-y-4 text-left">
                  <Field id="name" label="Seu nome" required>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </Field>
                  <Field id="password" label="Crie uma senha (mín. 8 caracteres)" required>
                    <Input id="password" type="password" value={password} minLength={8}
                      onChange={(e) => setPassword(e.target.value)} required />
                  </Field>
                  <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? "Criando conta…" : "Aceitar convite"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Já tem conta? <Link to="/login" className="text-primary underline">Faça login</Link> e abra o convite de novo.
                  </p>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
