import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, BookMarked, MapPin, ShieldAlert, Loader2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReservationControl } from "@/features/reservations/ReservationControl";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { useBook } from "./useBooks";
import { useBookReviews } from "@/features/reviews/useReviews";
import { ReviewList, RatingSummary } from "@/features/reviews/ReviewList";
import { useRequestRental } from "@/features/rentals/useRentals";
import { useAuthStore } from "@/store/authStore";
import { apiError, apiErrorKind, apiErrorCode } from "@/lib/apiError";
import { useToast } from "@/components/ui/toast";

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function BookDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: book, isLoading } = useBook(id);
  const { data: reviewsPage, isLoading: reviewsLoading } = useBookReviews(id);
  const reviews = reviewsPage?.content ?? [];
  const me = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-brand-600">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  if (!book) {
    return <p className="py-20 text-center text-gray-500">Livro não encontrado.</p>;
  }

  const isOwner = me?.id === book.owner.id;
  const canRequest = !isOwner && book.status === "AVAILABLE";

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link to="/app" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" /> Voltar ao acervo
      </Link>

      <div className="grid gap-6 sm:grid-cols-[220px_1fr]">
        <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl bg-brand-50">
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
          ) : (
            <BookMarked className="h-16 w-16 text-brand-300" />
          )}
        </div>

        <div>
          <div className="mb-2 flex items-start justify-between gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
            <StatusBadge status={book.status} />
          </div>
          <p className="text-gray-600">{book.author}</p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded bg-gray-100 px-2 py-1 text-gray-700">{book.genre}</span>
            <span className="rounded bg-gray-100 px-2 py-1 text-gray-700">Estado: {book.condition}</span>
            {book.isbn && <span className="rounded bg-gray-100 px-2 py-1 text-gray-700">ISBN {book.isbn}</span>}
          </div>

          {book.description && (
            <p className="mt-4 text-sm leading-relaxed text-gray-700">{book.description}</p>
          )}

          <div className="mt-6 rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Dono do livro</p>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{book.owner.name}</p>
                {book.owner.location && (
                  <p className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5" /> {book.owner.location}
                  </p>
                )}
              </div>
              {book.owner.penaltiesCount > 0 && (
                <span className="flex items-center gap-1 text-xs text-amber-600">
                  <ShieldAlert className="h-3.5 w-3.5" /> {book.owner.penaltiesCount} penalidade(s)
                </span>
              )}
            </div>
          </div>

          <div className="mt-6">
            {isOwner ? (
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={() => navigate(`/app/books/${book.id}/edit`)}>Editar livro</Button>
                <span className="text-sm text-gray-500">Este livro é seu.</span>
              </div>
            ) : canRequest ? (
              <Button onClick={() => setOpen(true)}>Solicitar aluguel</Button>
            ) : (
              <ReservationControl bookId={book.id} />
            )}
          </div>
        </div>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Avaliações</h2>
          <RatingSummary reviews={reviews} totalCount={reviewsPage?.totalElements} />
        </div>
        <ReviewList
          reviews={reviews}
          isLoading={reviewsLoading}
          emptyLabel="Este livro ainda não recebeu avaliações."
        />
      </section>

      {open && (
        <RentalModal
          bookId={book.id}
          bookTitle={book.title}
          ownerName={book.owner.name}
          defaultName={me?.name ?? ""}
          onClose={() => setOpen(false)}
          onDone={() => navigate("/app/rentals")}
        />
      )}
    </div>
  );
}

function RentalModal({
  bookId, bookTitle, ownerName, defaultName, onClose, onDone,
}: {
  bookId: string;
  bookTitle: string;
  ownerName: string;
  defaultName: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const request = useRequestRental();
  const qc = useQueryClient();
  const { success, error } = useToast();
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState(todayPlus(1));
  const [endDate, setEndDate] = useState(todayPlus(15));
  const [termAccepted, setTermAccepted] = useState(false);
  const [signerName, setSignerName] = useState(defaultName);

  const submit = () => {
    request.mutate(
      { bookId, message: message || undefined, startDate, endDate, termAccepted, signerName },
      {
        onSuccess: () => {
          success("Solicitação enviada. O dono do livro vai avaliar.");
          onDone();
        },
        onError: (err) => {
          // Concorrência: alguém solicitou primeiro. O livro já não está mais
          // disponível — avisa, atualiza o status na tela e fecha o modal.
          if (apiErrorCode(err) === "BOOK_ALREADY_RESERVED" || apiErrorKind(err) === "conflict") {
            error("Poxa, alguém solicitou primeiro — este livro já foi reservado.");
            qc.invalidateQueries({ queryKey: ["books"] });
            onClose();
          }
          // Demais erros continuam aparecendo inline (request.isError) abaixo.
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Solicitar aluguel</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{bookTitle}</span> · dono: {ownerName}
        </p>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Início</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Devolução</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Mensagem (opcional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Apresente-se ao dono do livro..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs leading-relaxed text-gray-600">
            <p className="mb-2 font-semibold text-gray-800">Termo de Responsabilidade</p>
            Declaro que recebi o livro em bom estado e me comprometo a devolvê-lo na data
            combinada, nas mesmas condições. Estou ciente de que atrasos ou danos podem
            gerar penalidades na plataforma BookLoop.
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Assinatura (seu nome)</label>
            <Input value={signerName} onChange={(e) => setSignerName(e.target.value)} placeholder="Nome completo" />
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={termAccepted}
              onChange={(e) => setTermAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            Li e aceito o Termo de Responsabilidade.
          </label>

          {request.isError && <p className="text-sm text-red-600">{apiError(request.error)}</p>}

          <Button
            className="w-full"
            onClick={submit}
            disabled={request.isPending || !termAccepted || !signerName.trim()}
          >
            {request.isPending ? "Enviando..." : "Enviar solicitação"}
          </Button>
        </div>
      </div>
    </div>
  );
}
