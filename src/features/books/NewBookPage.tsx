import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBook, type BookInput } from "@/api/books";
import { useToast } from "@/components/ui/toast";
import { apiError, apiFieldErrors } from "@/lib/apiError";
import { BookForm } from "./BookForm";

const EMPTY: BookInput = {
  title: "", author: "", isbn: "", genre: "FICCAO",
  description: "", condition: "BOM", coverUrl: "", isPublic: true,
};

export function NewBookPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { success } = useToast();
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: (payload: BookInput) => createBook(payload),
    onSuccess: (book) => {
      qc.invalidateQueries({ queryKey: ["books"] });
      success("Livro cadastrado com sucesso.");
      navigate(`/app/books/${book.id}`);
    },
    onError: (err) => setServerErrors(apiFieldErrors(err)),
  });

  const generalError =
    mutation.isError && Object.keys(serverErrors).length === 0 ? apiError(mutation.error) : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Cadastrar livro</h1>
      <p className="mb-6 text-sm text-gray-500">
        Campos marcados com <span className="text-red-500">*</span> são obrigatórios.
      </p>
      <BookForm
        initialValues={EMPTY}
        submitLabel="Cadastrar livro"
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
