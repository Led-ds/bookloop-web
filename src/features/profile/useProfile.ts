import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile, type ProfileInput } from "@/api/users";
import { useAuthStore } from "@/store/authStore";

export function useUpdateProfile() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.updateUser);
  return useMutation({
    mutationFn: (input: ProfileInput) => updateProfile(input),
    onSuccess: (user) => {
      setUser(user); // reflete no header/store imediatamente
      qc.invalidateQueries({ queryKey: ["users", "me"] });
    },
  });
}
