import { Link, Navigate } from "react-router-dom";
import {
  BookOpen, Users, Shield, ArrowRight, KeyRound, Sparkles,
  Church, GraduationCap, Coffee, Heart, Check,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/cn";

export function LandingPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/app" replace />;
  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold text-primary">BookLoop</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost"><KeyRound className="h-4 w-4" /> Acessar comunidade</Button>
            </Link>
            <Link to="/register">
              <Button><Sparkles className="h-4 w-4" /> Criar comunidade</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-40 h-96 w-96 rounded-full bg-accent/40 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-[1.1fr_1fr] md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-secondary-foreground">
              <Heart className="h-3 w-3" /> Compartilhar livros nunca foi tão simples
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] md:text-6xl">
              Sua comunidade de leitura,<br />
              <span className="text-primary">privada e sua</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              O BookLoop conecta comunidades de amigos, igrejas, escolas e clubes de leitura
              para compartilhar livros com controle, responsabilidade e confiança.
              Cada comunidade é uma rede fechada — só quem você convida participa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg">Criar minha comunidade grátis <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">Tenho um código de acesso</Button>
              </Link>
            </div>
          </div>
          <FloatingBookCarousel />
        </div>
      </section>

      {/* MOMENTOS */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">O que sua comunidade vai compartilhar</span>
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Imagine os livros passando de mão em mão</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              O BookLoop nasce para comunidades reais: amigos, igrejas, escolas, clubes de leitura.
              Cada troca vira história, cada livro vira conexão.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-12">
            <MomentCard className="lg:col-span-7" image="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80"
              title="Seu livro favorito nas mãos de quem você confia"
              caption="Emprestar para quem faz parte da sua comunidade é saber que o cuidado vem junto." />
            <MomentCard className="lg:col-span-5" image="https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600&q=80"
              title="Conversas que começam depois da última página"
              caption="Discussões, indicações e descobertas que só acontecem entre pessoas próximas." />
            <MomentCard className="lg:col-span-5" image="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80"
              title="Uma estante coletiva, organizada e viva"
              caption="Cada membro cadastra seus livros. O acervo da comunidade cresce naturalmente." />
            <MomentCard className="lg:col-span-7" image="https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&q=80"
              title="Encontros marcados por histórias em comum"
              caption="Do clube de leitura ao café com amigos, os livros viram encontro." />
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Como funciona</span>
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Três passos para começar</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Step n={1} icon={<Sparkles className="h-5 w-5" />} title="Crie sua comunidade"
              text="Escolha um nome e uma descrição. Você vira o administrador." />
            <Step n={2} icon={<Users className="h-5 w-5" />} title="Convide pessoas"
              text="Envie o código ou um link de convite. Só quem tem o código entra." />
            <Step n={3} icon={<BookOpen className="h-5 w-5" />} title="Compartilhem livros"
              text="Cada um cadastra sua estante. Empréstimos, avaliações e histórico ficam dentro da comunidade." />
          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Pra quem é</span>
          <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Feito para comunidades reais</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Se vocês já compartilham livros no WhatsApp, o BookLoop dá organização,
            histórico e confiança para essa troca.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Persona icon={<Coffee className="h-5 w-5" />} title="Amigos" text="Aquela turma que sempre indica leitura." />
          <Persona icon={<Church className="h-5 w-5" />} title="Igreja" text="Biblioteca comunitária organizada e sem perdas." />
          <Persona icon={<GraduationCap className="h-5 w-5" />} title="Escola" text="Alunos, professores e pais compartilhando estantes." />
          <Persona icon={<BookOpen className="h-5 w-5" />} title="Clube de leitura" text="Um livro roda entre todos, cada mês." />
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <Benefit icon={<Shield className="h-6 w-6" />} title="Privacidade total"
              text="Cada comunidade é uma ilha. Ninguém de fora vê seus livros, membros ou empréstimos." />
            <Benefit icon={<Check className="h-6 w-6" />} title="Controle e histórico"
              text="Termo digital, avaliações mútuas e histórico completo de cada empréstimo." />
            <Benefit icon={<Users className="h-6 w-6" />} title="Comunidade de verdade"
              text="Você entra em quantas comunidades quiser: casa, trabalho, igreja. Cada um com seu papel." />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h2 className="font-display text-3xl font-semibold md:text-4xl">
          Pronto para começar a girar livros com sua comunidade?
        </h2>
        <p className="mt-3 text-muted-foreground">
          Sem cartão, sem plano pago. Crie sua comunidade em menos de um minuto.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/register"><Button size="lg">Criar minha comunidade</Button></Link>
          <Link to="/login"><Button size="lg" variant="outline">Acessar comunidade existente</Button></Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} BookLoop — feito com 📚 e ☕
      </footer>
    </div>
  );
}

function Step({ n, icon, title, text }: { n: number; icon: ReactNode; title: string; text: string }) {
  return (
    <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground">Passo {n}</div>
      <div className="mt-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</div>
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function MomentCard({ image, title, caption, className }: { image: string; title: string; caption: string; className?: string }) {
  return (
    <div className={cn("group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg", className)}>
      <img src={image} alt={title} loading="lazy" className="h-64 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 text-primary-foreground">
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-white/90">{caption}</p>
      </div>
    </div>
  );
}

function Persona({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{text}</p>
    </div>
  );
}

function Benefit({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</div>
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

const CAROUSEL_BOOKS = [
  { title: "Dom Casmurro", author: "Machado de Assis", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80" },
  { title: "Duna", author: "Frank Herbert", cover: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&q=80" },
  { title: "A Hora da Estrela", author: "Clarice Lispector", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80" },
  { title: "O Nome do Vento", author: "P. Rothfuss", cover: "https://images.unsplash.com/photo-1531072901881-d644216d4bf9?w=400&q=80" },
  { title: "A Casa dos Espíritos", author: "Isabel Allende", cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&q=80" },
  { title: "Clean Code", author: "Robert C. Martin", cover: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&q=80" },
  { title: "Mindset", author: "Carol Dweck", cover: "https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=400&q=80" },
  { title: "Capitães da Areia", author: "Jorge Amado", cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80" },
  { title: "Steve Jobs", author: "W. Isaacson", cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80" },
  { title: "Zaratustra", author: "Nietzsche", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80" },
  { title: "Grande Sertão", author: "G. Rosa", cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&q=80" },
  { title: "Silêncio dos Inocentes", author: "T. Harris", cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&q=80" },
];

function FloatingBookCarousel() {
  const col1 = [...CAROUSEL_BOOKS.slice(0, 6), ...CAROUSEL_BOOKS.slice(0, 6)];
  const col2 = [...CAROUSEL_BOOKS.slice(6, 12), ...CAROUSEL_BOOKS.slice(6, 12)];
  const col3 = [...CAROUSEL_BOOKS.slice(3, 9), ...CAROUSEL_BOOKS.slice(3, 9)];
  return (
    <div className="relative">
      <div className="marquee-mask relative h-[480px] overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-secondary/40 via-background to-accent/20 p-3 shadow-xl">
        <div className="grid h-full grid-cols-3 gap-3">
          <CarouselColumn books={col1} className="marquee-y" />
          <CarouselColumn books={col2} className="marquee-y-reverse" />
          <CarouselColumn books={col3} className="marquee-y-slow" />
        </div>
      </div>
    </div>
  );
}

function CarouselColumn({ books, className }: { books: typeof CAROUSEL_BOOKS; className: string }) {
  return (
    <div className="relative overflow-hidden">
      <div className={cn("flex flex-col gap-3", className)}>
        {books.map((b, i) => (
          <div key={`${b.title}-${i}`} className="group relative aspect-[2/3] overflow-hidden rounded-lg border border-border bg-muted shadow-sm">
            <img src={b.cover} alt={b.title} loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
              <p className="line-clamp-1 text-[10px] font-semibold text-white">{b.title}</p>
              <p className="line-clamp-1 text-[9px] text-white/70">{b.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
