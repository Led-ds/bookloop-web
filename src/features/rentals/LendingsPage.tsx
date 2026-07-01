import { Loader2, Inbox } from "lucide-react";
import { useMyLendings, useRentalAction } from "./useRentals";
import { RentalRow } from "./MyRentalsPage";

export function LendingsPage() {
  const { data, isLoading } = useMyLendings();
  const action = useRentalAction();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-brand-600">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const rentals = data?.content ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Empréstimos</h1>
      <p className="mb-6 text-sm text-gray-500">Solicitações para os seus livros.</p>

      {rentals.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20 text-gray-400">
          <Inbox className="h-10 w-10" />
          <p className="text-sm">Nenhuma solicitação recebida ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rentals.map((r) => (
            <RentalRow key={r.id} rental={r} role="owner" onAction={(a) => action.mutate({ id: r.id, action: a })} busy={action.isPending} />
          ))}
        </div>
      )}
    </div>
  );
}
