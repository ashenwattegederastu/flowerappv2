import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

const basePath = process.env.VITE_BASE_PATH
const normalizedBase = basePath
  ? (basePath.endsWith('/') ? basePath : `${basePath}/`)
  : './'

// https://vite.dev/config/
export default defineConfig({
  base: normalizedBase,
  plugins: [inspectAttr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});