import { useState } from "react";
import { cn } from "@/lib/cn";

export function Avatar({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-secondary", className)}>
      {children}
    </span>
  );
}

export function AvatarImage({ src, alt }: { src?: string; alt?: string }) {
  const [ok, setOk] = useState(!!src);
  if (!src || !ok) return null;
  return (
    <img
      src={src}
      alt={alt ?? ""}
      className="absolute inset-0 h-full w-full object-cover"
      onError={() => setOk(false)}
    />
  );
}

export function AvatarFallback({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-secondary-foreground">
      {children}
    </span>
  );
}
