import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = (path: string): string =>
  fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@assets\/(.*)$/,
        replacement: root("./src/shared/assets") + "/$1",
      },
      {
        find: /^@components\/(.*)$/,
        replacement: root("./src/shared/components") + "/$1",
      },
      {
        find: /^@config\/(.*)$/,
        replacement: root("./src/config") + "/$1",
      },
      {
        find: /^@features\/(.*)$/,
        replacement: root("./src/features") + "/$1",
      },
      {
        find: /^@services\/(.*)$/,
        replacement: root("./src/shared/services") + "/$1",
      },
      {
        find: /^@utils\/(.*)$/,
        replacement: root("./src/shared/utils") + "/$1",
      },
    ],
  },
  test: {
    include: ["tests/**/*.test.ts"],
    env: {
      TZ: "UTC",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: [
        "src/features/**/*.ts",
        "src/shared/services/**/*.ts",
        "src/shared/utils/**/*.ts",
        "src/config/**/*.ts",
      ],
      exclude: [
        "src/shared/services/og/**",
      ],
    },
  },
});
