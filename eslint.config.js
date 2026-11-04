// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import js from "@eslint/js"
import stylex from "@stylexjs/eslint-plugin"
import { defineConfig, globalIgnores } from "eslint/config"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import storybook from "eslint-plugin-storybook"
import globals from "globals"
import tseslint from "typescript-eslint"

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
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  ...storybook.configs["flat/recommended"],
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
    },
  },
])
