import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = (path: string): string => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
    resolve: {
        alias: [
            {
                find: /^@app\/(.*)$/,
                replacement: root("./source/app") + "/$1",
            },
            {
                find: /^@ui\/(.*)$/,
                replacement: root("./source/ui") + "/$1",
            },
            {
                find: /^@core\/(.*)$/,
                replacement: root("./source/core") + "/$1",
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
                "source/app/feature/**/*.ts",
                "source/app/infrastructure/**/*.ts",
                "source/app/util/**/*.ts",
                "source/app/config/**/*.ts",
                "source/ui/feature/impact/component/**/*.ts",
            ],
            exclude: ["source/app/infrastructure/og/**"],
        },
    },
});
