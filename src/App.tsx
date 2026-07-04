import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/AppRouter";
import { ToastProvider } from "@/components/ui/toast";
import { setUnauthorizedHandler } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

export default function App() {
  useEffect(() => {
    // Quando o refresh falha, a sessão é encerrada e o usuário vai para o login.
    setUnauthorizedHandler(() => {
      useAuthStore.getState().logout();
      void router.navigate("/login");
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryClientProvider>
  );
}
