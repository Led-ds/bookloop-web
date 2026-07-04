import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps {
  id?: string;
  as?: ElementType;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  "aria-label"?: string;
}

/** Seção com espaçamento vertical consistente e container centralizado.
 *  `id` habilita âncoras de navegação suave. Reutilizável em landing e app. */
export function Section({
  id, as: Tag = "section", className, containerClassName, children, ...rest
}: SectionProps) {
  return (
    <Tag id={id} className={cn("scroll-mt-20 py-16 sm:py-20", className)} {...rest}>
      <div className={cn("mx-auto w-full max-w-6xl px-4", containerClassName)}>{children}</div>
    </Tag>
  );
}
