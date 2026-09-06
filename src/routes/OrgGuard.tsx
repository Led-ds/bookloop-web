import { Outlet, useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useOrganizationStore } from "@/store/organizationStore";

/**
 * Garante que a comunidade da URL (/app/:orgId) é a comunidade ativa no store.
 * Se o usuário troca de comunidade pela URL, limpa o cache escopado por org
 * (evita vazamento visual de dados entre comunidades).
 */
export function OrgGuard() {
  const { orgId } = useParams();
  const qc = useQueryClient();
  const { activeOrgId, activeOrgName, myRole, setActive } = useOrganizationStore();

  useEffect(() => {
    if (orgId && orgId !== activeOrgId) {
      // troca de comunidade: descarta queries escopadas da anterior
      qc.removeQueries({ queryKey: ["org"] });
      // mantém nome/papel se já conhecidos; senão o Layout/telas buscam sob demanda
      setActive({
        id: orgId,
        name: activeOrgName ?? "",
        role: (myRole ?? "MEMBER"),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  if (!orgId) return <Navigate to="/app" replace />;
  return <Outlet />;
}
