import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrganization,
  myOrganizations,
  type CreateOrganizationInput,
} from "@/api/organizations";

export function useMyOrganizations() {
  return useQuery({ queryKey: ["organizations", "mine"], queryFn: myOrganizations });
}

export function useCreateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrganizationInput) => createOrganization(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["organizations"] }),
  });
}
