import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
}

export function Button({ className, variant = "primary", ...props }: Props) {
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700",
    outline: "border border-brand-600 text-brand-700 hover:bg-brand-50",
    ghost: "text-brand-700 hover:bg-brand-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
        "transition disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
