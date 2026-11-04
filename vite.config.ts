/// <reference types="vitest/config" />
import path from "node:path"
import { fileURLToPath } from "node:url"

import babel from "@rolldown/plugin-babel"
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import { unplugin as stylex } from "@stylexjs/unplugin"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vite"

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const rootDir = fileURLToPath(new URL(".", import.meta.url))
const srcDir = fileURLToPath(new URL("./src/", import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    stylex.vite({
      useCSSLayers: {
        before: ["reset"],
      },
      aliases: {
        "@/*": [`${srcDir}*`],
      },
      unstable_moduleResolution: {
        type: "commonJS",
        rootDir,
      },
    }),
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(import.meta.dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
        },
      },
    ],
  },
})
