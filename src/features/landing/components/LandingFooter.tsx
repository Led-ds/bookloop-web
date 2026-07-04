import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <div className="flex items-center gap-2 text-brand-700">
          <BookOpen className="h-5 w-5" />
          <span className="font-semibold">BookLoop</span>
        </div>
        <p className="text-sm text-gray-500">Compartilhar é gerar conexões.</p>
        <nav className="flex gap-4 text-sm text-gray-500" aria-label="Rodapé">
          <a href="#como-funciona" className="hover:text-brand-700">Como funciona</a>
          <a href="#comunidade" className="hover:text-brand-700">Comunidade</a>
          <Link to="/login" className="hover:text-brand-700">Entrar</Link>
        </nav>
      </div>
    </footer>
  );
}
