import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OrgRole = "OWNER" | "ADMIN" | "MEMBER";

interface OrganizationState {
  activeOrgId: string | null;
  activeOrgName: string | null;
  myRole: OrgRole | null;
  setActive: (org: { id: string; name: string; role: OrgRole }) => void;
  clear: () => void;
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set) => ({
      activeOrgId: null,
      activeOrgName: null,
      myRole: null,
      setActive: (org) =>
        set({ activeOrgId: org.id, activeOrgName: org.name, myRole: org.role }),
      clear: () => set({ activeOrgId: null, activeOrgName: null, myRole: null }),
    }),
    { name: "bookloop-active-org" }
  )
);
