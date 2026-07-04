import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { CounterState } from "@/lib/validation";

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string | null;
  hint?: string;
  counter?: { value: number; max: number; state: CounterState };
  children: ReactNode;
}

/** Campo de formulário acessível: label, marcador de obrigatório, contador e erro/ajuda. */
export function Field({ id, label, required, error, hint, counter, children }: FieldProps) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
        </label>
        {counter && (
          <span
            className={cn(
              "text-xs tabular-nums",
              counter.state === "ok" && "text-gray-400",
              counter.state === "warn" && "text-amber-600",
              counter.state === "error" && "font-medium text-red-600",
            )}
          >
            {counter.value}/{counter.max}
          </span>
        )}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
}
