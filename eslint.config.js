import storybook from "eslint-plugin-storybook"
import js from "@eslint/js"
import globals from "globals"
import jsxA11y from "eslint-plugin-jsx-a11y"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import testingLibrary from "eslint-plugin-testing-library"
import vitest from "@vitest/eslint-plugin"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  globalIgnores(["dist", "storybook-static", "coverage"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // shadcn-generated components export variants alongside components
    files: ["src/components/ui/**"],
    rules: {
      "react-refresh/only-export-components": "off",
      "jsx-a11y/label-has-associated-control": "off",
    },
  },
  {
    files: ["**/*.test.{ts,tsx}"],
    extends: [testingLibrary.configs["flat/react"], vitest.configs.recommended],
    rules: {
      "vitest/no-focused-tests": "error",
      "vitest/no-disabled-tests": "error",
    },
  },
  ...storybook.configs["flat/recommended"],
])
