import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";
import { CatalogPage } from "@/features/books/CatalogPage";
import { BookDetailPage } from "@/features/books/BookDetailPage";
import { NewBookPage } from "@/features/books/NewBookPage";
import { MyRentalsPage } from "@/features/rentals/MyRentalsPage";
import { LendingsPage } from "@/features/rentals/LendingsPage";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/", element: <CatalogPage /> },
          { path: "/books/new", element: <NewBookPage /> },
          { path: "/books/:id", element: <BookDetailPage /> },
          { path: "/rentals", element: <MyRentalsPage /> },
          { path: "/lendings", element: <LendingsPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
