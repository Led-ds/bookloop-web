import { ArrowLeftRight, RotateCcw, Star, UserPlus } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunityActivity } from "../data/CommunityProvider";
import type { ActivityItem } from "../data/types";

function phrase(a: ActivityItem): string {
  switch (a.kind) {
    case "lent": return `${a.actor} emprestou ${a.target}`;
    case "returned": return `${a.actor} acabou de devolver ${a.target}`;
    case "rated": return `${a.actor} avaliou ${a.target} com ${a.rating} estrela${a.rating === 1 ? "" : "s"}`;
    case "joined": return `${a.actor} entrou na comunidade`;
  }
}

const ICON = {
  lent: ArrowLeftRight,
  returned: RotateCcw,
  rated: Star,
  joined: UserPlus,
} as const;

export function CommunityActivity() {
  const { data, isLoading } = useCommunityActivity();

  return (
    <Section className="py-12 sm:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Acontecendo agora</h2>
        <p className="mt-2 text-sm text-gray-500">Pessoas movimentando conhecimento neste momento.</p>
      </div>

      <ul className="mx-auto mt-8 flex max-w-2xl flex-col gap-2" aria-live="polite">
        {isLoading || !data
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)
          : data.map((a) => {
              const Icon = ICON[a.kind];
              return (
                <li key={a.id}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-gray-700">{phrase(a)}</span>
                </li>
              );
            })}
      </ul>
    </Section>
  );
}
