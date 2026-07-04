# Configuração de ambiente — bookloop-web

A URL da API é injetada **em tempo de build** pelo Vite através de `VITE_API_URL`. Não existe
configuração em runtime: cada imagem é buildada para um ambiente.

## Arquivos `.env`

| Arquivo | Quando é usado | Versionado? |
|---------|----------------|-------------|
| `.env.development` | `npm run dev` (Vite, modo dev) | Sim |
| `.env.production` | `npm run build` (modo prod) | Sim |
| `.env.local` | Sobrescreve os demais **localmente** | Não (git-ignored) |
| `.env.example` | Referência do que preencher | Sim |

Precedência do Vite: `.env.local` > `.env.[mode]` > `.env`.

## Regras

- **Nunca** usar `localhost` em produção. Em build de produção sem `VITE_API_URL`, a aplicação
  usa caminho relativo e registra erro — nunca cai em localhost (ver `src/lib/env.ts`).
- Fallback para `localhost:8080/api/v1` **apenas** em desenvolvimento.

## Build com Docker

A imagem recebe a URL por `--build-arg`. Sem o argumento (ou apontando para localhost) o build
**falha de propósito**:

```bash
docker build --build-arg VITE_API_URL=https://SUA-API/api/v1 -t bookloop-web:latest .
docker run -p 8080:80 bookloop-web:latest   # Nginx serve a SPA na porta 80
```

Após o build, `scripts/verify-build.mjs` confirma que o bundle não contém `localhost`.
