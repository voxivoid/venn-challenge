interface ImportMetaEnv {
  /** Base URL of the Venn challenge API, without a trailing slash. */
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
