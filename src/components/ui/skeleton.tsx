import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-gray-200", className)} />;
}

/** Grade de skeletons para o catálogo. */
export function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-[3/4] w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      ))}
    </div>
  );
}

/** Lista de skeletons para páginas de aluguéis/empréstimos. */
export function RowListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
          <Skeleton className="mb-2 h-5 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}

/** Estado vazio padronizado. */
export function EmptyState({
  icon, title, hint, action,
}: {
  icon: ReactNode;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-20 text-center text-gray-400">
      <div className="text-gray-300">{icon}</div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {hint && <p className="max-w-xs text-sm text-gray-400">{hint}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
