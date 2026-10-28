import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.{test,stories}.{ts,tsx}',
        'src/components/ui/**',
        'src/test/**',
        'src/main.tsx',
      ],
      thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },
    },
  },
  plugins: [
    tailwindcss(),
    react(),
    // Skipped for coverage runs only: compiler memo branches would skew it.
    !process.env.COVERAGE && babel({ presets: [reactCompilerPreset()] }),
  ],
})
