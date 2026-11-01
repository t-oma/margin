import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import babel from "@rolldown/plugin-babel"
import { unplugin as stylex } from "@stylexjs/unplugin"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    stylex.vite({
      useCSSLayers: {
        before: ["reset"],
      },
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})
