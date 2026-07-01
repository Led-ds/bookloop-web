import { useMutation } from "@tanstack/react-query";
import { login, register } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (v: { email: string; password: string }) => login(v.email, v.password),
    onSuccess: setAuth,
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (v: { name: string; email: string; password: string }) =>
      register(v.name, v.email, v.password),
    onSuccess: setAuth,
  });
}
