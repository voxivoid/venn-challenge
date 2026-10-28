function requireEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];
  if (!value) throw new Error(`Missing env var ${name}`);
  return value;
}

export const API_BASE_URL = requireEnv("VITE_API_BASE_URL");
