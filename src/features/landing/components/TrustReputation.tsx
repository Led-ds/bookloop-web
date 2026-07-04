import { ShieldCheck, HandHeart, Award } from "lucide-react";
import { Section } from "@/components/ui/section";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Confiança por design",
    text: "Todo empréstimo tem dono, prazo e um termo de responsabilidade aceito. O combinado é claro para as duas partes.",
  },
  {
    icon: Award,
    title: "Reputação que se constrói",
    text: "Devoluções em dia e boas avaliações fortalecem sua reputação — e abrem portas para novos empréstimos.",
  },
  {
    icon: HandHeart,
    title: "Responsabilidade compartilhada",
    text: "Aqui ninguém vende nada. As pessoas cuidam dos livros umas das outras porque o conhecimento é de todos.",
  },
];

export function TrustReputation() {
  return (
    <Section className="bg-gray-50">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Por que funciona</h2>
        <p className="mt-3 text-gray-600">
          O BookLoop é baseado em confiança. E confiança, aqui, tem estrutura.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {PILLARS.map((p) => (
          <div key={p.title} className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <p.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{p.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
