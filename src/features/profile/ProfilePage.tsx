import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BookPlus, Pencil, MapPin, ShieldAlert, ShieldCheck, Loader2, Library,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { myBooks } from "@/api/books";
import { useMyRentals } from "@/features/rentals/useRentals";
import { BookCard } from "@/features/books/BookCard";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Stat } from "@/components/ui/stat";
import { useToast } from "@/components/ui/toast";
import { apiError } from "@/lib/apiError";
import { useUpdateProfile } from "./useProfile";
import type { ProfileInput } from "@/api/users";
import type { Rental, User } from "@/types";
import { useUserReviews } from "@/features/reviews/useReviews";
import { ReviewList, RatingSummary } from "@/features/reviews/ReviewList";

type Tab = "books" | "renting" | "history" | "reviews" | "penalties";

const TABS: { key: Tab; label: string }[] = [
  { key: "books", label: "Meus livros" },
  { key: "renting", label: "Alugados" },
  { key: "history", label: "Histórico" },
  { key: "reviews", label: "Avaliações" },
  { key: "penalties", label: "Penalidades" },
];

const ACTIVE_STATUSES = ["PENDING", "APPROVED", "ACTIVE", "OVERDUE"];

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 px-6 py-12 text-center">
      <div className="text-gray-300">{icon}</div>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { success } = useToast();
  const user = useAuthStore((s) => s.user);
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState<Tab>("books");

  if (!user) return null;

  const location = [user.city, user.state].filter(Boolean).join(", ") || user.location;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-xl font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              {location && (
                <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5" /> {location}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
              <Pencil className="mr-1 h-4 w-4" /> {editing ? "Fechar" : "Editar perfil"}
            </Button>
            <Button size="sm" onClick={() => navigate("/app/books/new")}>
              <BookPlus className="mr-1 h-4 w-4" /> Novo livro
            </Button>
          </div>
        </div>

        {user.bio && !editing && (
          <p className="mt-4 border-t border-gray-100 pt-4 text-sm leading-relaxed text-gray-700">{user.bio}</p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">
          <Stat
            icon={user.penaltiesCount > 0
              ? <ShieldAlert className="h-6 w-6 text-amber-500" />
              : <ShieldCheck className="h-6 w-6" />}
            value={user.penaltiesCount}
            label="Penalidades"
          />
          <Stat value={user.role === "ADMIN" ? "Admin" : "Membro"} label="Perfil" />
          <Stat value={user.profileCompleted ? "Completo" : "Incompleto"} label="Cadastro" />
        </div>

        {editing && (
          <ProfileEditForm user={user} onSaved={() => { setEditing(false); success("Perfil atualizado."); }} />
        )}
      </div>

      <div className="mt-6">
        <div className="flex gap-1 border-b border-gray-200" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={
                "px-4 py-2 text-sm font-medium transition " +
                (tab === t.key
                  ? "border-b-2 border-brand-600 text-brand-700"
                  : "text-gray-500 hover:text-gray-800")
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="py-5">
          {tab === "books" && <MyBooksTab />}
          {tab === "renting" && <RentalsTab mode="active" />}
          {tab === "history" && <RentalsTab mode="history" />}
          {tab === "reviews" && <ReviewsTab userId={user.id} />}
          {tab === "penalties" && <PenaltiesTab count={user.penaltiesCount} />}
        </div>
      </div>
    </div>
  );
}

function ProfileEditForm({ user, onSaved }: { user: User; onSaved: () => void }) {
  const mutation = useUpdateProfile();
  const [form, setForm] = useState<ProfileInput>({
    name: user.name ?? "",
    bio: user.bio ?? "",
    city: user.city ?? "",
    state: user.state ?? "",
    addressLine: user.addressLine ?? "",
    neighborhood: user.neighborhood ?? "",
    postalCode: user.postalCode ?? "",
    avatarUrl: user.avatarUrl ?? "",
  });
  const set = (k: keyof ProfileInput, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const controlClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";
  const generalError = mutation.isError ? apiError(mutation.error) : null;

  return (
    <div className="mt-5 space-y-4 border-t border-gray-100 pt-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field id="name" label="Nome">
          <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field id="avatarUrl" label="URL do avatar" hint="Link http(s) para sua foto.">
          <Input id="avatarUrl" value={form.avatarUrl} placeholder="https://..."
                 onChange={(e) => set("avatarUrl", e.target.value)} />
        </Field>
      </div>

      <Field id="bio" label="Bio">
        <textarea id="bio" rows={3} value={form.bio}
                  onChange={(e) => set("bio", e.target.value)} className={controlClass} />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field id="city" label="Cidade">
          <Input id="city" value={form.city} onChange={(e) => set("city", e.target.value)} />
        </Field>
        <Field id="state" label="Estado">
          <Input id="state" value={form.state} onChange={(e) => set("state", e.target.value)} />
        </Field>
      </div>

      <Field id="addressLine" label="Endereço">
        <Input id="addressLine" value={form.addressLine} onChange={(e) => set("addressLine", e.target.value)} />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field id="neighborhood" label="Bairro">
          <Input id="neighborhood" value={form.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} />
        </Field>
        <Field id="postalCode" label="CEP">
          <Input id="postalCode" value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} />
        </Field>
      </div>

      {generalError && <p role="alert" className="text-sm text-red-600">{generalError}</p>}

      <Button
        onClick={() => mutation.mutate({ ...form, name: form.name?.trim() }, { onSuccess: onSaved })}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Salvando..." : "Salvar perfil"}
      </Button>
    </div>
  );
}

function MyBooksTab() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["books", "mine"],
    queryFn: () => myBooks(0, 24),
  });
  if (isLoading) {
    return <div className="flex justify-center py-10 text-brand-600"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }
  if (isError) {
    return <p className="py-10 text-center text-sm text-gray-500">Não foi possível carregar seus livros.</p>;
  }
  const books = data?.content ?? [];
  if (books.length === 0) {
    return <EmptyState icon={<Library className="h-8 w-8" />} message="Você ainda não cadastrou livros." />;
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {books.map((b) => <BookCard key={b.id} book={b} />)}
    </div>
  );
}

function RentalsTab({ mode }: { mode: "active" | "history" }) {
  const { data, isLoading, isError } = useMyRentals();
  if (isLoading) {
    return <div className="flex justify-center py-10 text-brand-600"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }
  if (isError) {
    return <p className="py-10 text-center text-sm text-gray-500">Não foi possível carregar seus aluguéis.</p>;
  }
  const all: Rental[] = data?.content ?? [];
  const items = all.filter((r) =>
    mode === "active" ? ACTIVE_STATUSES.includes(r.status) : !ACTIVE_STATUSES.includes(r.status),
  );
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Library className="h-8 w-8" />}
        message={mode === "active" ? "Você não tem aluguéis em andamento." : "Seu histórico está vazio por enquanto."}
      />
    );
  }
  return (
    <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200">
      {items.map((r) => (
        <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">{r.bookTitle}</p>
            <p className="text-xs text-gray-500">Devolução prevista: {r.endDate}</p>
          </div>
          <StatusBadge status={r.status} />
        </li>
      ))}
    </ul>
  );
}

function ReviewsTab({ userId }: { userId: string }) {
  const { data, isLoading } = useUserReviews(userId);
  const reviews = data?.content ?? [];
  return (
    <div className="space-y-4">
      <RatingSummary reviews={reviews} totalCount={data?.totalElements} />
      <ReviewList
        reviews={reviews}
        isLoading={isLoading}
        emptyLabel="Você ainda não recebeu avaliações. Elas aparecem após empréstimos devolvidos."
      />
    </div>
  );
}

function PenaltiesTab({ count }: { count: number }) {
  if (count === 0) {
    return <EmptyState icon={<ShieldCheck className="h-8 w-8" />} message="Nenhuma penalidade. Continue assim!" />;
  }
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-center gap-2 text-amber-800">
        <ShieldAlert className="h-5 w-5" />
        <p className="text-sm font-semibold">{count} penalidade(s) registrada(s)</p>
      </div>
      <p className="mt-2 text-sm text-amber-700">
        Penalidades acontecem por devoluções atrasadas. Acima de um limite, novas solicitações podem ser bloqueadas.
      </p>
    </div>
  );
}
