import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegister } from "./useAuth";
import { apiError } from "@/lib/apiError";

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    register.mutate({ name, email, password }, { onSuccess: () => navigate("/") });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="mb-8 flex items-center gap-2 text-brand-700">
        <BookOpen /> <span className="text-2xl font-bold">BookLoop</span>
      </div>
      <h1 className="mb-6 text-xl font-semibold">Criar conta</h1>

      <div className="space-y-3">
        <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Senha (mín. 8 caracteres)" value={password}
               onChange={(e) => setPassword(e.target.value)} />
        {register.isError && <p className="text-sm text-red-600">{apiError(register.error)}</p>}
        <Button className="w-full" onClick={submit} disabled={register.isPending}>
          {register.isPending ? "Criando..." : "Criar conta"}
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Já tem conta?{" "}
        <Link to="/login" className="font-medium text-brand-700">Entrar</Link>
      </p>
    </div>
  );
}
