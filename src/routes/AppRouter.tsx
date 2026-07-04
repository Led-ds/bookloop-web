import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";
import { CatalogPage } from "@/features/books/CatalogPage";
import { BookDetailPage } from "@/features/books/BookDetailPage";
import { NewBookPage } from "@/features/books/NewBookPage";
import { MyRentalsPage } from "@/features/rentals/MyRentalsPage";
import { LendingsPage } from "@/features/rentals/LendingsPage";
import { ProfilePage } from "@/features/profile/ProfilePage";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "./ProtectedRoute";

// Landing pública com code-splitting: não pesa no bundle da aplicação autenticada.
const LandingPage = lazy(() => import("@/features/landing/LandingPage"));

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center text-brand-600">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<PageFallback />}>
        <LandingPage />
      </Suspense>
    ),
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <CatalogPage /> },
          { path: "books/new", element: <NewBookPage /> },
          { path: "books/:id", element: <BookDetailPage /> },
          { path: "rentals", element: <MyRentalsPage /> },
          { path: "lendings", element: <LendingsPage /> },
          { path: "profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
