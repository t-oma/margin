import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import babel from "@rolldown/plugin-babel"
import { unplugin as stylex } from "@stylexjs/unplugin"
import { defineConfig } from "vite"
import { fileURLToPath } from "node:url"

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
    babel({ presets: [reactCompilerPreset()] }),
  ],
})
