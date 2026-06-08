/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GLB_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
