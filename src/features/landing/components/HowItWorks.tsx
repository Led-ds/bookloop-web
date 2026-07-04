import { BookPlus, Share2, Star } from "lucide-react";
import { Section } from "@/components/ui/section";

const STEPS = [
  {
    icon: BookPlus,
    title: "Cadastre seus livros",
    text: "Coloque no acervo os livros que você já leu. Eles continuam seus — só ficam disponíveis para circular.",
  },
  {
    icon: Share2,
    title: "Compartilhe conhecimento",
    text: "Alguém da comunidade solicita, vocês combinam o empréstimo com um termo de responsabilidade, e o livro segue viagem.",
  },
  {
    icon: Star,
    title: "Fortaleça sua reputação",
    text: "A cada empréstimo devolvido, avaliações constroem sua reputação e a confiança da comunidade cresce.",
  },
];

export function HowItWorks() {
  return (
    <Section id="como-funciona">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Como funciona</h2>
        <p className="mt-3 text-gray-600">Três passos simples para colocar o conhecimento em movimento.</p>
      </div>

      <ol className="mt-12 grid gap-8 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className="relative flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <s.icon className="h-7 w-7" />
            </div>
            <span className="mt-4 text-xs font-semibold uppercase tracking-widest text-brand-600">
              Passo {i + 1}
            </span>
            <h3 className="mt-1 text-lg font-semibold text-gray-900">{s.title}</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-600">{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
