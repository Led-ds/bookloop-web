import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

/**
 * Rotas que só fazem sentido para quem NÃO está logado (login, registro).
 * Se o usuário já tem sessão válida, pula direto para /app (suas comunidades),
 * sem precisar logar de novo.
 */
export function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Navigate to="/app" replace /> : <Outlet />;
}
