import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { BookOpen, Library, Inbox, Plus, LogOut, ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/cn";

export function Layout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItem = (to: string, label: string, Icon: typeof Library) => (
    <NavLink
      to={to}
      end={to === "/app"}
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
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/app" className="flex items-center gap-2 text-brand-700">
            <BookOpen className="h-6 w-6" />
            <span className="text-lg font-bold">BookLoop</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItem("/app", "Acervo", Library)}
            {navItem("/app/rentals", "Meus aluguéis", BookOpen)}
            {navItem("/app/lendings", "Empréstimos", Inbox)}
            {navItem("/app/books/new", "Cadastrar", Plus)}
          </nav>

          <div className="flex items-center gap-3">
            {user && (
              <Link to="/app/profile" className="hidden text-right sm:block hover:opacity-80">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                {user.penaltiesCount > 0 && (
                  <p className="flex items-center justify-end gap-1 text-xs text-amber-600">
                    <ShieldAlert className="h-3 w-3" /> {user.penaltiesCount} penalidade(s)
                  </p>
                )}
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600"
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
