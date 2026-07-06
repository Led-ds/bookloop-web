import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { useLogin } from "./useAuth";
import { apiError } from "@/lib/apiError";
import { LOGIN_CONSTRAINTS, validateAll } from "@/lib/validation";
import { IS_DEV } from "@/lib/env";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  // Pré-preenchimento apenas em desenvolvimento (nunca em produção).
  const [email, setEmail] = useState(IS_DEV ? "ana@bookloop.dev" : "");
  const [password, setPassword] = useState(IS_DEV ? "senha12345" : "");
  const [submitted, setSubmitted] = useState(false);

  const errors = validateAll({ email, password }, LOGIN_CONSTRAINTS);
  const errorFor = (k: string) => (submitted ? errors[k] : undefined);

  const submit = () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    if (login.isPending) return; // impede duplo envio
    login.mutate({ email, password }, { onSuccess: () => navigate("/app") });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <div className="mb-8 flex items-center gap-2 text-primary">
          <BookOpen /> <span className="text-2xl font-bold">BookLoop</span>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h1 className="mb-1 text-xl font-semibold text-foreground">Entrar</h1>
          <p className="mb-6 text-sm text-muted-foreground">Compartilhar é gerar conexões.</p>

          <div className="space-y-3" onKeyDown={onKeyDown}>
        <Field id="email" label="E-mail" required error={errorFor("email")}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            invalid={!!errorFor("email")}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field id="password" label="Senha" required error={errorFor("password")}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            invalid={!!errorFor("password")}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        {login.isError && (
          <p role="alert" className="text-sm text-red-600">{apiError(login.error)}</p>
        )}

          <Button className="w-full" onClick={submit} disabled={login.isPending}>
            {login.isPending ? "Entrando..." : "Entrar"}
          </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link to="/register" className="font-medium text-primary">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
