import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { useRegister } from "./useAuth";
import { apiError, apiErrorKind, apiFieldErrors } from "@/lib/apiError";
import { REGISTER_CONSTRAINTS, validateAll } from "@/lib/validation";

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const { success } = useToast();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const errors = validateAll(form, REGISTER_CONSTRAINTS);
  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setServerErrors((e) => {
      if (!(k in e)) return e;
      const { [k]: _drop, ...rest } = e;
      return rest;
    });
  };
  const errorFor = (k: string) => (submitted ? errors[k] : undefined) ?? serverErrors[k];

  // Mensagem topo: 409 = e-mail já cadastrado; demais via camada de erro.
  const topError =
    register.isError && Object.keys(serverErrors).length === 0
      ? apiErrorKind(register.error) === "conflict"
        ? "Este e-mail já está cadastrado. Tente entrar."
        : apiError(register.error)
      : null;

  const submit = () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    if (register.isPending) return;
    register.mutate(form, {
      onSuccess: () => {
        success("Conta criada com sucesso. Bem-vindo ao BookLoop!");
        navigate("/app");
      },
      onError: (err) => setServerErrors(apiFieldErrors(err)),
    });
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
          <h1 className="mb-6 text-xl font-semibold text-foreground">Criar conta</h1>

          <div className="space-y-3" onKeyDown={onKeyDown}>
        <Field id="name" label="Nome" required error={errorFor("name")}>
          <Input id="name" autoComplete="name" value={form.name}
                 invalid={!!errorFor("name")} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field id="email" label="E-mail" required error={errorFor("email")}>
          <Input id="email" type="email" autoComplete="email" value={form.email}
                 invalid={!!errorFor("email")} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field id="password" label="Senha" required error={errorFor("password")}
               hint="Mínimo de 8 caracteres.">
          <Input id="password" type="password" autoComplete="new-password" value={form.password}
                 invalid={!!errorFor("password")} onChange={(e) => set("password", e.target.value)} />
        </Field>

        {topError && <p role="alert" className="text-sm text-red-600">{topError}</p>}

          <Button className="w-full" onClick={submit} disabled={register.isPending}>
            {register.isPending ? "Criando..." : "Criar conta"}
          </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="font-medium text-primary">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
