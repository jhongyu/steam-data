/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STEAM_KEY: string;
  readonly VITE_STEAM_ID: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
