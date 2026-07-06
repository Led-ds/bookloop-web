// Contratos da comunidade. Espelham o formato esperado de futuras APIs REST,
// para que a troca de origem (mock -> REST) não altere a interface da landing.

export interface CommunityStats {
  readers: number;         // leitores na comunidade
  booksShared: number;     // livros compartilhados
  rentalsCompleted: number;// empréstimos realizados
  ratings: number;         // avaliações registradas
  returnRate: number;      // taxa de devolução (0..1)
  averageRating: number | null; // média geral das avaliações (null se não há)
}

export type ActivityKind = "lent" | "returned" | "rated" | "joined";

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  actor: string;           // quem realizou a ação
  target?: string;         // livro ou pessoa relacionada
  rating?: number;         // quando kind = "rated"
  at: string;              // ISO timestamp
}

export interface LivingBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverUrl?: string;
  timesLent: number;       // emprestado X vezes
  readers: number;         // leitores alcançados
  rating: number;          // média 0..5
  lastLentAt?: string;     // ISO timestamp do último empréstimo
}

export interface CommunityReview {
  id: string;
  rating: number;          // 1..5
  comment: string;
  authorName: string;      // quem avaliou
  authorAvatarUrl?: string;
  targetName: string;      // livro ou pessoa avaliada
  targetType: "BOOK" | "USER";
}

export interface TopReader {
  id: string;
  name: string;
  avatarUrl?: string;
  ratingAvg: number;
  ratingCount: number;
}
