import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Shield, UserMinus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";
import { apiError } from "@/lib/apiError";
import { orgBase } from "@/lib/orgPath";
import { useOrganizationStore } from "@/store/organizationStore";
import { useMembers, useMemberActions } from "./useMembers";

const ROLE_LABEL: Record<string, string> = { OWNER: "Dono", ADMIN: "Admin", MEMBER: "Membro" };

export function MembersPage() {
  const { data: members, isLoading } = useMembers();
  const { promote, demote, remove } = useMemberActions();
  const myRole = useOrganizationStore((s) => s.myRole);
  const { success, error } = useToast();
  const isOwner = myRole === "OWNER";
  const canManage = myRole === "OWNER" || myRole === "ADMIN";

  function run(m: { mutate: (id: string, o: { onSuccess: () => void; onError: (e: unknown) => void }) => void }, id: string, ok: string) {
    m.mutate(id, { onSuccess: () => success(ok), onError: (e) => error(apiError(e)) });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to={orgBase()} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="font-display text-2xl font-semibold">Membros</h1>
      <p className="mt-1 text-sm text-muted-foreground">Quem faz parte desta comunidade.</p>

      <div className="mt-6 space-y-3">
        {isLoading && [0, 1, 2].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        {members?.map((m) => (
          <div key={m.membershipId} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={m.avatarUrl} alt={m.name} />
              <AvatarFallback>{m.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{m.name}</p>
              <p className="truncate text-xs text-muted-foreground">{m.email}</p>
            </div>
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              {ROLE_LABEL[m.role] ?? m.role}
            </span>
            {canManage && m.role !== "OWNER" && (
              <div className="flex gap-1">
                {isOwner && m.role === "MEMBER" && (
                  <Button size="sm" variant="ghost" title="Promover a admin"
                    onClick={() => run(promote, m.membershipId, "Membro promovido a admin.")}>
                    <ShieldCheck className="h-4 w-4" />
                  </Button>
                )}
                {isOwner && m.role === "ADMIN" && (
                  <Button size="sm" variant="ghost" title="Rebaixar a membro"
                    onClick={() => run(demote, m.membershipId, "Admin rebaixado a membro.")}>
                    <Shield className="h-4 w-4" />
                  </Button>
                )}
                <Button size="sm" variant="ghost" title="Remover da comunidade"
                  onClick={() => run(remove, m.membershipId, "Membro removido.")}>
                  <UserMinus className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {canManage && (
        <Link to={`${orgBase()}/convites`} className="mt-6 inline-block">
          <Button variant="outline"><UserPlus className="h-4 w-4" /> Convidar pessoas</Button>
        </Link>
      )}
    </div>
  );
}
