import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { OrgGuard } from "@/routes/OrgGuard";
import { PublicOnlyRoute } from "@/routes/PublicOnlyRoute";
import { MembersPage } from "@/features/organizations/MembersPage";
import { InvitationsPage } from "@/features/organizations/InvitationsPage";
import { AcceptInvitationPage } from "@/features/organizations/AcceptInvitationPage";
import { Layout } from "@/components/Layout";
import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";
import { MyOrganizationsPage } from "@/features/organizations/MyOrganizationsPage";
import { CreateOrganizationPage } from "@/features/organizations/CreateOrganizationPage";
import { CatalogPage } from "@/features/books/CatalogPage";
import { NewBookPage } from "@/features/books/NewBookPage";
import { BookDetailPage } from "@/features/books/BookDetailPage";
import { EditBookPage } from "@/features/books/EditBookPage";
import { MyRentalsPage } from "@/features/rentals/MyRentalsPage";
import { LendingsPage } from "@/features/rentals/LendingsPage";
import { MyReservationsPage } from "@/features/reservations/MyReservationsPage";
import { ProfilePage } from "@/features/profile/ProfilePage";

const LandingPage = lazy(() =>
  import("@/features/landing/LandingPage").then((m) => ({ default: m.LandingPage }))
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={null}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },

  // Aceitar convite — público (funciona logado ou não)
  { path: "/convite/:token", element: <AcceptInvitationPage /> },

  // Área autenticada, mas AINDA sem comunidade selecionada
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/app", element: <MyOrganizationsPage /> },
      { path: "/comunidades/nova", element: <CreateOrganizationPage /> },
      { path: "/perfil", element: <ProfilePage /> },
    ],
  },

  // Área DENTRO de uma comunidade — exige orgId válido
  {
    path: "/app/:orgId",
    element: <ProtectedRoute />,
    children: [
      {
        element: <OrgGuard />,
        children: [
          {
            element: <Layout />,
            children: [
              { index: true, element: <CatalogPage /> },
              { path: "books/new", element: <NewBookPage /> },
              { path: "books/:id", element: <BookDetailPage /> },
              { path: "books/:id/edit", element: <EditBookPage /> },
              { path: "rentals", element: <MyRentalsPage /> },
              { path: "lendings", element: <LendingsPage /> },
              { path: "reservations", element: <MyReservationsPage /> },
              { path: "membros", element: <MembersPage /> },
              { path: "convites", element: <InvitationsPage /> },
            ],
          },
        ],
      },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);
