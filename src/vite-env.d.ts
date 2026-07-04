/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base da API (ex.: https://api.exemplo.com/api/v1). Ver ENVIRONMENT.md. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
