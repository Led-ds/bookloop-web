import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

/** Seletor de nota 1..5 (interativo), com hover. */
export function StarRatingInput({
  value,
  onChange,
  size = 28,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div className="inline-flex items-center gap-1" role="radiogroup" aria-label="Nota">
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        return (
          <button
            key={n}
            type="button"
            aria-label={`${n} ${n > 1 ? "estrelas" : "estrela"}`}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5 transition hover:scale-110"
          >
            <Star
              style={{ width: size, height: size }}
              className={cn(n <= active ? "fill-warning text-warning" : "fill-none text-border")}
            />
          </button>
        );
      })}
    </div>
  );
}
