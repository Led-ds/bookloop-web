import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyOrganizations } from "./useOrganizations";
import { useOrganizationStore, type OrgRole } from "@/store/organizationStore";
import { spineClassOf } from "./spine";

const ROLE_LABEL: Record<string, string> = { OWNER: "Dono", ADMIN: "Admin", MEMBER: "Membro" };

export function MyOrganizationsPage() {
  const { data: orgs, isLoading } = useMyOrganizations();
  const setActive = useOrganizationStore((s) => s.setActive);
  const navigate = useNavigate();

  function enter(org: { id: string; name: string; myRole: OrgRole }) {
    setActive({ id: org.id, name: org.name, role: org.myRole });
    navigate(`/app/${org.id}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold text-primary">BookLoop</span>
          </Link>
          <Link to="/perfil"><Button variant="ghost">Meu perfil</Button></Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold">Suas comunidades</h1>
            <p className="mt-1 text-muted-foreground">Escolha uma comunidade para entrar ou crie uma nova.</p>
          </div>
          <Link to="/comunidades/nova">
            <Button><Plus className="h-4 w-4" /> Nova comunidade</Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {isLoading && [0, 1].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}

          {!isLoading && orgs?.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
              <h2 className="mt-4 font-display text-xl font-semibold">Você ainda não participa de nenhuma comunidade</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Crie a sua primeira comunidade de leitura — leva menos de um minuto — ou peça um convite a alguém.
              </p>
              <Link to="/comunidades/nova" className="mt-6 inline-block">
                <Button size="lg"><Plus className="h-4 w-4" /> Criar minha primeira comunidade</Button>
              </Link>
            </div>
          )}

          {orgs?.map((org) => (
            <button
              key={org.id}
              onClick={() => enter({ id: org.id, name: org.name, myRole: org.myRole })}
              className="group flex items-stretch gap-0 overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className={`w-1.5 shrink-0 ${spineClassOf(org.code)}`} />
              <span className="flex flex-1 items-center justify-between p-5">
                <span>
                  <span className="block font-display text-lg font-semibold">{org.name}</span>
                  <span className="mt-0.5 block font-mono text-xs text-muted-foreground">{org.code}</span>
                  <span className="mt-2 inline-block rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                    {ROLE_LABEL[org.myRole] ?? org.myRole}
                  </span>
                </span>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
