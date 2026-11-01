import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import stylex from "@stylexjs/eslint-plugin"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintConfigPrettier,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      "@stylexjs": stylex,
    },
    rules: {
      "@stylexjs/valid-styles": "error",
      "@stylexjs/valid-shorthands": "error",
      "@stylexjs/no-conflicting-props": "error",
      "@stylexjs/sort-keys": "warn",
    },
  },
])
