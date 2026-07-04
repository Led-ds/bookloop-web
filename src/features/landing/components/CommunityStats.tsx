import { Users, BookOpen, Repeat, Star, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Stat } from "@/components/ui/stat";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunityStats } from "../data/CommunityProvider";

const nf = new Intl.NumberFormat("pt-BR");

export function CommunityStats() {
  const { data, isLoading } = useCommunityStats();

  return (
    <Section id="comunidade" className="bg-gray-50">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Uma comunidade que confia</h2>
        <p className="mt-3 text-gray-600">
          Números que mostram o conhecimento circulando entre pessoas reais.
        </p>
      </div>

      {isLoading || !data ? (
        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-5">
          <Stat icon={<Users className="h-6 w-6" />} value={nf.format(data.readers)} label="Leitores" />
          <Stat icon={<BookOpen className="h-6 w-6" />} value={nf.format(data.booksShared)} label="Livros compartilhados" />
          <Stat icon={<Repeat className="h-6 w-6" />} value={nf.format(data.rentalsCompleted)} label="Empréstimos realizados" />
          <Stat icon={<Star className="h-6 w-6" />} value={nf.format(data.ratings)} label="Avaliações" />
          <Stat icon={<CheckCircle2 className="h-6 w-6" />}
                value={`${Math.round(data.returnRate * 100)}%`} label="Taxa de devolução" />
        </div>
      )}
    </Section>
  );
}
