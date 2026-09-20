import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const version = readFileSync(
  resolve(import.meta.dirname, "..", "VERSION"),
  "utf8",
).trim();

export default defineConfig({
  base: "./",
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("react-router") ||
            id.includes("/react/") ||
            id.includes("/react-dom/")
          )
            return "react";
          if (
            id.includes("@fasl-work/caos-app-shell") ||
            id.includes("/katex/")
          )
            return "shell";
          if (id.includes("/lucide-react/")) return "icons";
          return undefined;
        },
      },
    },
  },
  test: {
    environment: "node",
    globals: true,
  },
});
