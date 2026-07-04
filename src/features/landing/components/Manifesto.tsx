import { Section } from "@/components/ui/section";

export function Manifesto() {
  return (
    <Section className="bg-brand-800 text-white" aria-label="Manifesto do BookLoop">
      <figure className="mx-auto max-w-3xl text-center">
        <blockquote className="text-2xl font-semibold leading-relaxed sm:text-3xl">
          <p>Acreditamos que conhecimento não deve ficar parado.</p>
          <p className="mt-3 text-brand-200">Livros esquecidos em estantes não transformam vidas.</p>
          <p className="mt-3">Livros compartilhados transformam pessoas.</p>
        </blockquote>
        <figcaption className="mt-6 text-sm uppercase tracking-widest text-brand-300">
          Manifesto BookLoop
        </figcaption>
      </figure>
    </Section>
  );
}
