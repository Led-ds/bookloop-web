// Falha se o bundle de produção contiver referências a localhost — rede de segurança
// contra builds apontando para a API errada. Rode após `npm run build`.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist/assets";
const NEEDLE = /localhost:8080|127\.0\.0\.1/;

let files = [];
try {
  files = readdirSync(DIST).filter((f) => f.endsWith(".js"));
} catch {
  console.error(`verify-build: pasta ${DIST} não encontrada. Rode 'npm run build' antes.`);
  process.exit(1);
}

const offenders = files.filter((f) => NEEDLE.test(readFileSync(join(DIST, f), "utf8")));
if (offenders.length > 0) {
  console.error(`verify-build: bundle contém referência a localhost em: ${offenders.join(", ")}`);
  console.error("Rebuilde com VITE_API_URL apontando para a API pública.");
  process.exit(1);
}
console.log("verify-build: OK — nenhuma referência a localhost no bundle.");
