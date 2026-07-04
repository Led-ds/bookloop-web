import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

export function FinalCTA() {
  return (
    <Section className="bg-brand-700 text-white">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Pronto para colocar seus livros em movimento?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-brand-100">
          Cada livro que você compartilha é uma ideia que encontra um novo leitor. Junte-se a uma
          comunidade que faz o conhecimento circular.
        </p>
        <div className="mt-8">
          <Link to="/register">
            <Button size="lg" className="bg-white text-brand-700 hover:bg-brand-50">
              Criar minha conta <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}
