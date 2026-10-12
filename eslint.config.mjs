import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import astroParser from "astro-eslint-parser";
import eslintPluginAstro from "eslint-plugin-astro";

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...eslintPluginAstro.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    {
        files: ["*.astro"],
        languageOptions: {
            parser: astroParser,
            parserOptions: {
                parser: "@typescript-eslint/parser",
                extraFileExtensions: [".astro"],
            },
        },
    },
    {
        files: ["**/*.d.ts"],
        rules: {
            "@typescript-eslint/triple-slash-reference": "off",
        },
    },
    {
        rules: {
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/typedef": [
                "error",
                {
                    variableDeclaration: false,
                    memberVariableDeclaration: true,
                    propertyDeclaration: true,
                    parameter: true,
                    arrowParameter: true,
                    variableDeclarationIgnoreFunction: true,
                    objectDestructuring: false,
                    arrayDestructuring: false,
                },
            ],
            "@typescript-eslint/explicit-function-return-type": [
                "error",
                {
                    allowExpressions: false,
                    allowTypedFunctionExpressions: true,
                    allowedNames: ["getStaticPaths"],
                },
            ],
            "@typescript-eslint/explicit-member-accessibility": "error",
        },
    },
    {
        files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
        rules: {
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/typedef": "off",
            "@typescript-eslint/explicit-member-accessibility": "off",
        },
    },
    {
        files: ["tests/**"],
        rules: {
            "@typescript-eslint/explicit-function-return-type": "off",
        },
    },
    {
        files: ["./source/ui/content.config.ts"],
        rules: {
            "@typescript-eslint/typedef": "off",
        },
    },
    {
        ignores: ["dist/**", ".astro", "coverage/**"],
    },
];
