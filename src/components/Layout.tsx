import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useOrganizationStore } from "@/store/organizationStore";
import { BookOpen, Library, Inbox, Plus, Bookmark, LogOut, ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/cn";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function Layout() {
  const activeOrgId = useOrganizationStore((s) => s.activeOrgId);
  const base = `/app/${activeOrgId}`;
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    // Navega para a Home pública ANTES de limpar a sessão: com a ordem inversa,
    // o ProtectedRoute reavalia isAuthenticated=false e redireciona para /login.
    navigate("/", { replace: true });
    setTimeout(() => logout(), 0);
  };

  const navItem = (to: string, label: string, Icon: typeof Library) => (
    <NavLink
      to={to}
      end={to === base}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition",
          isActive ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:bg-gray-100"
        )
      }
    >
      <Icon className="h-4 w-4" /> <span className="hidden sm:inline">{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to={base} className="flex items-center gap-2 text-primary">
            <BookOpen className="h-6 w-6" />
            <span className="text-lg font-bold">BookLoop</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItem(base, "Acervo", Library)}
            {navItem(`${base}/rentals`, "Meus aluguéis", BookOpen)}
            {navItem(`${base}/lendings`, "Empréstimos", Inbox)}
            {navItem(`${base}/reservations`, "Reservas", Bookmark)}
            {navItem(`${base}/books/new`, "Cadastrar", Plus)}
            <NavLink to="/app" className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Trocar comunidade</NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <NotificationBell />
            {user && (
              <Link
                to="/perfil"
                className="flex items-center gap-2 hover:opacity-80"
                title="Meu perfil"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  {user.penaltiesCount > 0 && (
                    <p className="flex items-center justify-end gap-1 text-xs text-warning">
                      <ShieldAlert className="h-3 w-3" /> {user.penaltiesCount} penalidade(s)
                    </p>
                  )}
                </div>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
