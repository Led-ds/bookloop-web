import { Inbox } from "lucide-react";
import { RowListSkeleton, EmptyState } from "@/components/ui/skeleton";
import { useMyLendings } from "./useRentals";
import { RentalRow, useRentalActionWithToast } from "./MyRentalsPage";

export function LendingsPage() {
  const { data, isLoading } = useMyLendings();
  const { run, busy } = useRentalActionWithToast();
  const rentals = data?.content ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Empréstimos</h1>
      <p className="mb-6 text-sm text-gray-500">Solicitações para os seus livros.</p>

      {isLoading ? (
        <RowListSkeleton />
      ) : rentals.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-10 w-10" />}
          title="Nenhuma solicitação recebida ainda"
          hint="Quando alguém solicitar um dos seus livros, aparece aqui para você aprovar."
        />
      ) : (
        <div className="space-y-3">
          {rentals.map((r) => (
            <RentalRow key={r.id} rental={r} role="owner" onAction={(a) => run(r.id, a)} busy={busy} />
          ))}
        </div>
      )}
    </div>
  );
}
