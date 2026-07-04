import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Stat } from "@/components/ui/stat";

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Meu perfil</h1>
      <p className="mb-6 text-sm text-gray-500">Sua identidade e reputação na comunidade.</p>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6 border-t border-gray-100 pt-6">
          <Stat
            icon={user.penaltiesCount > 0 ? <ShieldAlert className="h-6 w-6 text-amber-500" /> : <ShieldCheck className="h-6 w-6" />}
            value={user.penaltiesCount}
            label="Penalidades"
          />
          <Stat value={user.role === "ADMIN" ? "Admin" : "Membro"} label="Perfil" />
        </div>
      </div>
    </div>
  );
}
