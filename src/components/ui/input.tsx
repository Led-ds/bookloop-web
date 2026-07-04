import { cn } from "@/lib/cn";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1",
        invalid
          ? "border-red-400 focus:border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:border-brand-500 focus:ring-brand-500",
        className,
      )}
      {...props}
    />
  );
}
