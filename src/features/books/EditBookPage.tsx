import { useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getBook, updateBook, type BookInput } from "@/api/books";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/store/authStore";
import { apiError, apiFieldErrors } from "@/lib/apiError";
import { BookForm } from "./BookForm";

export function EditBookPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { success } = useToast();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const { data: book, isLoading, isError } = useQuery({
    queryKey: ["books", id],
    queryFn: () => getBook(id),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (payload: BookInput) => updateBook(id, payload),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["books"] });
      success("Livro atualizado.");
      navigate(`/app/books/${updated.id}`);
    },
    onError: (err) => setServerErrors(apiFieldErrors(err)),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16 text-brand-600">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  if (isError || !book) {
    return <p className="px-4 py-16 text-center text-sm text-gray-500">Livro não encontrado.</p>;
  }
  // Somente o dono edita.
  if (currentUserId && book.owner?.id && book.owner.id !== currentUserId) {
    return <Navigate to={`/app/books/${id}`} replace />;
  }

  const generalError =
    mutation.isError && Object.keys(serverErrors).length === 0 ? apiError(mutation.error) : null;

  const initial: BookInput = {
    title: book.title,
    author: book.author,
    isbn: book.isbn ?? "",
    genre: book.genre,
    description: book.description ?? "",
    condition: book.condition,
    coverUrl: book.coverUrl ?? "",
    isPublic: book.isPublic ?? true,
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Editar livro</h1>
      <p className="mb-6 text-sm text-gray-500">Atualize os dados do seu livro.</p>
      <BookForm
        initialValues={initial}
        submitLabel="Salvar alterações"
        submitting={mutation.isPending}
        serverErrors={serverErrors}
        generalError={generalError}
        onSubmit={(values) => mutation.mutate(values)}
        onServerErrorsClear={(key) =>
          setServerErrors((e) => {
            if (!(key in e)) return e;
            const { [key]: _drop, ...rest } = e;
            return rest;
          })
        }
      />
    </div>
  );
}
