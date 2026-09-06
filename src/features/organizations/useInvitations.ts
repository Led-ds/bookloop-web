import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createInvitation, pendingInvitations, cancelInvitation } from "@/api/invitations";
import { orgKey } from "@/lib/orgPath";

export function usePendingInvitations() {
  return useQuery({ queryKey: orgKey("invitations"), queryFn: pendingInvitations });
}

export function useInvitationActions() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: orgKey("invitations") });
  return {
    create: useMutation({ mutationFn: (email?: string) => createInvitation(email), onSuccess: invalidate }),
    cancel: useMutation({ mutationFn: cancelInvitation, onSuccess: invalidate }),
  };
}
