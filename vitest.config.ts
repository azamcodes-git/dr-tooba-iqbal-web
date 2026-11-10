import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["tests/unit/**/*.test.ts", "tests/api/**/*.test.ts"],
    exclude: ["node_modules", ".next", "tests/e2e/**"]
  },
  resolve: {
    alias: {
      "@/content": path.resolve(__dirname, "./content"),
      "@": path.resolve(__dirname, "./src")
    }
  }
});
