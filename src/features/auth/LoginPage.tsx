import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "./useAuth";
import { apiError } from "@/lib/apiError";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const [email, setEmail] = useState("ana@bookloop.dev");
  const [password, setPassword] = useState("senha12345");

  const submit = () => {
    login.mutate({ email, password }, { onSuccess: () => navigate("/") });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="mb-8 flex items-center gap-2 text-brand-700">
        <BookOpen /> <span className="text-2xl font-bold">BookLoop</span>
      </div>
      <h1 className="mb-1 text-xl font-semibold">Entrar</h1>
      <p className="mb-6 text-sm text-gray-500">Compartilhar é gerar conexões.</p>

      <div className="space-y-3">
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        {login.isError && <p className="text-sm text-red-600">{apiError(login.error)}</p>}
        <Button className="w-full" onClick={submit} disabled={login.isPending}>
          {login.isPending ? "Entrando..." : "Entrar"}
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Não tem conta?{" "}
        <Link to="/register" className="font-medium text-brand-700">Cadastre-se</Link>
      </p>
    </div>
  );
}
