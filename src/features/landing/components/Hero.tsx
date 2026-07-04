import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

export function Hero() {
  return (
    <Section id="inicio" className="bg-gradient-to-b from-brand-50/60 to-white pt-14">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800">
          <Sparkles className="h-3.5 w-3.5" /> Uma biblioteca viva, feita de pessoas
        </span>

        <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
          O conhecimento não deveria ficar parado numa estante.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
          O BookLoop conecta pessoas através dos livros que elas já têm. Você empresta, alguém lê,
          o conhecimento circula — com responsabilidade e confiança. O livro é o meio; o
          conhecimento é o protagonista.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/register">
            <Button size="lg">Fazer parte da comunidade <ArrowRight className="h-4 w-4" /></Button>
          </Link>
          <a href="#como-funciona">
            <Button size="lg" variant="outline">Ver como funciona</Button>
          </a>
        </div>

        <p className="mt-4 text-sm text-gray-400">Gratuito. Sem venda de livros. Só conhecimento em movimento.</p>
      </div>
    </Section>
  );
}
