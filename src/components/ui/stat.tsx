import type { ReactNode } from "react";

export function Stat({
  value, label, icon,
}: {
  value: ReactNode;
  label: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      {icon && <div className="mb-2 text-brand-600">{icon}</div>}
      <div className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{label}</div>
    </div>
  );
}
