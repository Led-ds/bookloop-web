import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLivingBooks } from "../data/CommunityProvider";
import { LivingBookCard } from "./LivingBookCard";

export function LivingBooks() {
  const { data, isLoading } = useLivingBooks();

  return (
    <Section id="catalogo">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Livros que circulam</h2>
          <p className="mt-3 text-gray-600">
            Cada livro carrega uma história de circulação: quantas vezes já foi emprestado, quantos
            leitores alcançou e como a comunidade o avalia.
          </p>
        </div>
        <Link to="/register" className="shrink-0">
          <Button variant="outline">Entrar no acervo completo <ArrowRight className="h-4 w-4" /></Button>
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading || !data
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[3/4] w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-3/5" />
              </div>
            ))
          : data.map((b) => <LivingBookCard key={b.id} book={b} />)}
      </div>
    </Section>
  );
}
