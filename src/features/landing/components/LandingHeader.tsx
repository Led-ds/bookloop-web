import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#catalogo", label: "Catálogo" },
  { href: "#comunidade", label: "Comunidade" },
];

export function LandingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#inicio" className="flex items-center gap-2 text-brand-700" aria-label="BookLoop, início">
          <BookOpen className="h-6 w-6" />
          <span className="text-lg font-bold">BookLoop</span>
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Navegação institucional">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm font-medium text-gray-600 hover:text-brand-700">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login"><Button variant="ghost">Entrar</Button></Link>
          <Link to="/register"><Button>Criar conta</Button></Link>
        </div>

        <button
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className={cn("border-t border-gray-100 md:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3" aria-label="Navegação móvel">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)}
               className="rounded-lg px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              {n.label}
            </a>
          ))}
          <div className="mt-2 flex gap-2">
            <Link to="/login" className="flex-1"><Button variant="outline" className="w-full">Entrar</Button></Link>
            <Link to="/register" className="flex-1"><Button className="w-full">Criar conta</Button></Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
