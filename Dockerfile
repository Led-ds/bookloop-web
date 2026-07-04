# ---------- build ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# A URL da API é injetada no build (Vite embute em tempo de compilação).
# Sem default: um build sem este argumento deve FALHAR, não gerar imagem quebrada.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Guarda: impede publicar uma imagem apontando para localhost ou sem URL.
RUN if [ -z "$VITE_API_URL" ]; then \
      echo "ERRO: VITE_API_URL não foi informado. Use --build-arg VITE_API_URL=https://.../api/v1" >&2; \
      exit 1; \
    fi; \
    case "$VITE_API_URL" in \
      *localhost*|*127.0.0.1*) \
        echo "ERRO: VITE_API_URL aponta para localhost ($VITE_API_URL). Use a URL pública da API." >&2; \
        exit 1;; \
    esac

RUN npm run build
# Confirma que o bundle final não contém localhost.
RUN node scripts/verify-build.mjs

# ---------- runtime ----------
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
