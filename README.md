
## Notificações (sino no header)

A área autenticada exibe um sino de notificações (`src/features/notifications`) que consome a API
REST do backend por **polling** (contador de não lidas a cada 30s, apenas quando autenticado).
Camadas separadas — `api/`, `hooks/`, `components/` — para permitir trocar polling por SSE/WebSocket
no futuro sem reescrever os componentes: basta substituir a fonte dos hooks. Sem novas dependências.
