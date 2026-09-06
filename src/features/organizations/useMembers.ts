import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listMembers, promoteMember, demoteMember, removeMember } from "@/api/members";
import { orgKey } from "@/lib/orgPath";

export function useMembers() {
  return useQuery({ queryKey: orgKey("members"), queryFn: listMembers });
}

export function useMemberActions() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: orgKey("members") });
  return {
    promote: useMutation({ mutationFn: promoteMember, onSuccess: invalidate }),
    demote: useMutation({ mutationFn: demoteMember, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: removeMember, onSuccess: invalidate }),
  };
}
