const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

const MIN = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;

/** Data relativa amigável: "agora mesmo", "há 2 minutos", "há 3 horas", "ontem"... */
export function timeAgo(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now(); // negativo = passado
  const abs = Math.abs(diff);
  if (abs < MIN) return "agora mesmo";
  if (abs < HOUR) return rtf.format(Math.round(diff / MIN), "minute");
  if (abs < DAY) return rtf.format(Math.round(diff / HOUR), "hour");
  if (abs < 30 * DAY) return rtf.format(Math.round(diff / DAY), "day");
  return new Date(iso).toLocaleDateString("pt-BR");
}
