import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export function StarRating({
  value,
  size = 14,
  showValue = false,
  className,
}: {
  value: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}) {
  const rounded = Math.round(value);
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i < rounded ? "fill-warning text-warning" : "fill-none text-border"}
        />
      ))}
      {showValue && <span className="ml-1 text-sm font-medium text-foreground">{value.toFixed(1)}</span>}
    </span>
  );
}
