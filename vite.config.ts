import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: false,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.{test,stories}.{ts,tsx}",
        "src/**/*.handlers.ts",
        "src/components/ui/**",
        "src/test/**",
        "src/main.tsx",
      ],
      thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },
    },
  },
  build: {
    rolldownOptions: {
      output: {
        // The React stack is the largest dependency and changes rarely, so it
        // gets its own chunk that stays cached across deploys.
        codeSplitting: {
          groups: [
            {
              name: "react",
              test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/,
            },
          ],
        },
      },
    },
  },
  plugins: [
    tailwindcss(),
    react(),
    // Skipped for coverage runs only: compiler memo branches would skew it.
    !process.env.COVERAGE && babel({ presets: [reactCompilerPreset()] }),
  ],
});
