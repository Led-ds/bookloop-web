// Landing pública do BookLoop — port fiel do template (verde-floresta + creme, Fraunces).
import { Navigate, Link } from "react-router-dom";
import { BookOpen, Users, Shield, Sprout, Sparkles, Quote } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import { genreLabel } from "@/lib/constants";
import { CommunityProvider, useLivingBooks } from "./data/CommunityProvider";
import type { LivingBook } from "./data/types";

const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  primaryLg:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition hover:opacity-90",
  outline:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary/60",
  outlineLg:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-6 py-3 text-base font-medium text-foreground transition hover:bg-secondary/60",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary/60",
};

// Avaliações de comunidade (mock — o backend ainda não tem domínio de reviews).
const MOCK_REVIEWS = [
  { id: "r1", rating: 5, comment: "Ana é super atenciosa, combinou tudo pelo chat e entregou pontualmente.", name: "Ana Souza", ratingsCount: 24, avatar: "https://i.pravatar.cc/80?img=47", by: "Carla" },
  { id: "r2", rating: 5, comment: "Carla é a alma da comunidade! Sempre com dicas de leitura incríveis.", name: "Carla Mendes", ratingsCount: 31, avatar: "https://i.pravatar.cc/80?img=32", by: "Ana" },
  { id: "r3", rating: 5, comment: "Bruno cuidou super bem do livro e devolveu antes do prazo.", name: "Bruno Lima", ratingsCount: 18, avatar: "https://i.pravatar.cc/80?img=12", by: "João" },
];

const HERO_AVATARS = [
  "https://i.pravatar.cc/64?img=47", "https://i.pravatar.cc/64?img=32",
  "https://i.pravatar.cc/64?img=12", "https://i.pravatar.cc/64?img=5",
];

export function LandingPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/app" replace />;
  return (
    <CommunityProvider>
      <LandingContent />
    </CommunityProvider>
  );
}

function LandingContent() {
  const { data: books = [], isLoading } = useLivingBooks();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold text-primary">BookLoop</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login" className={btn.ghost}>Entrar</Link>
            <Link to="/register" className={btn.primary}>Criar conta</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-40 h-96 w-96 rounded-full bg-accent/40 blur-3xl" />

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.05fr_1fr] md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-secondary-foreground">
              <Sprout className="h-3 w-3" /> Comunidade leitora colaborativa
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] md:text-6xl">
              Sua próxima leitura<br />
              está na estante <span className="text-primary">de alguém</span>.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              O BookLoop conecta leitores próximos para emprestar, alugar e avaliar livros —
              sem custo, só com confiança, responsabilidade e amor pela leitura.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/register" className={btn.primaryLg}>Criar conta grátis</Link>
              <Link to="/login" className={btn.outlineLg}>Já tenho conta</Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <StarRating value={4.8} size={14} showValue />
                <span>de avaliação média</span>
              </div>
              <div className="flex -space-x-2">
                {HERO_AVATARS.map((src, i) => (
                  <Avatar key={i} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={src} />
                    <AvatarFallback>{String.fromCharCode(65 + i)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span>+ leitores ativos</span>
            </div>
          </div>

          {/* Colagem de capas */}
          <div className="relative">
            <div className="grid grid-cols-3 gap-3">
              {(isLoading ? Array.from({ length: 6 }) : books.slice(0, 6)).map((b, i) => {
                const book = b as LivingBook | undefined;
                return (
                  <div
                    key={book?.id ?? i}
                    className={`group relative overflow-hidden rounded-xl bg-muted shadow-lg transition hover:-translate-y-1 ${i % 2 ? "translate-y-6" : ""}`}
                  >
                    {book?.coverUrl ? (
                      <img src={book.coverUrl} alt={book.title} loading="lazy"
                        className="aspect-[2/3] w-full object-cover transition group-hover:scale-105" />
                    ) : (
                      <div className="flex aspect-[2/3] w-full items-center justify-center">
                        <BookOpen className="h-8 w-8 text-border" />
                      </div>
                    )}
                    {book && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="line-clamp-1 text-xs font-medium text-white">{book.title}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* VITRINE */}
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="h-3 w-3" /> Vitrine da comunidade
              </span>
              <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
                Livros esperando um novo leitor
              </h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Todos cadastrados por membros do BookLoop. Crie sua conta para pedir emprestado.
              </p>
            </div>
            <Link to="/register" className={btn.outline}>Explorar catálogo</Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {books.map((b, i) => (
              <ShowcaseCard key={b.id} book={b} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* MURAL DE AVALIAÇÕES */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Quote className="h-3 w-3" /> Vozes da comunidade
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
            Quem empresta, quem lê — quem avalia.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            A cada empréstimo, leitores avaliam uns aos outros com até 5 estrelas.
            Confiança que se constrói livro após livro.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {MOCK_REVIEWS.map((r) => (
            <article key={r.id}
              className="relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/10" />
              <StarRating value={r.rating} size={16} />
              <p className="text-sm leading-relaxed text-foreground/90">"{r.comment}"</p>
              <div className="mt-auto flex items-center gap-3 border-t border-border pt-4">
                <Avatar>
                  <AvatarImage src={r.avatar} />
                  <AvatarFallback>{r.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{r.name}</p>
                  <div className="flex items-center gap-2">
                    <StarRating value={5} size={12} />
                    <span className="text-xs text-muted-foreground">{r.ratingsCount} avaliações</span>
                  </div>
                </div>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                  por {r.by}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center font-display text-3xl font-semibold md:text-4xl">
            Por que o BookLoop?
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Benefit icon={<BookOpen className="h-6 w-6" />} title="Sua estante, infinita"
              text="Acesse livros de outros leitores sem gastar nada — só compromisso de devolver bem." />
            <Benefit icon={<Users className="h-6 w-6" />} title="Comunidade avaliada"
              text="Cada aluguel gera avaliação mútua. Leitores confiáveis brilham com 5 estrelas." />
            <Benefit icon={<Shield className="h-6 w-6" />} title="Confiança protegida"
              text="Termo de responsabilidade digital, histórico e reputação para todos." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="font-display text-3xl font-semibold md:text-4xl">
          Pronto para começar a girar livros?
        </h2>
        <p className="mt-3 text-muted-foreground">
          Cadastre-se agora e veja livros disponíveis perto de você.
        </p>
        <Link to="/register" className={`${btn.primaryLg} mt-6`}>Criar minha conta</Link>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} BookLoop — feito com 📚 e ☕
      </footer>
    </div>
  );
}

function ShowcaseCard({ book, featured }: { book: LivingBook; featured?: boolean }) {
  return (
    <Link to="/register"
      className={`group relative block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${featured ? "col-span-2 row-span-2" : ""}`}>
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="h-8 w-8 text-border" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90" />
        <div className="absolute inset-x-0 bottom-0 space-y-1 p-3 text-white">
          <p className={`line-clamp-2 font-display font-semibold ${featured ? "text-lg" : "text-sm"}`}>{book.title}</p>
          <p className="line-clamp-1 text-[11px] text-white/70">{book.author}</p>
          <div className="flex items-center gap-2 pt-1">
            <StarRating value={book.rating ?? 0} size={12} />
            <span className="text-[10px] text-white/70">{(book.rating ?? 0).toFixed(1)}</span>
          </div>
        </div>
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-foreground">
          {genreLabel(book.genre)}
        </span>
      </div>
    </Link>
  );
}

function Benefit({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</div>
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export default LandingPage;
