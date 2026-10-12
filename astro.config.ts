import { existsSync } from "node:fs";
import { defineConfig } from "astro/config";
import type { AstroIntegration } from "astro";
import type { SitemapItem } from "@astrojs/sitemap";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import { MARKDOWN_STYLING } from "@app/configuration/site/MarkdownStyling.ts";
import { SITE } from "@app/configuration/site/Site.ts";
import { PortraitDownloadService } from "@app/infrastructure/file/asset/PortraitDownloadService.ts";
import { SignaleLogger } from "@app/infrastructure/log/SignaleLogger.ts";
import { FrontmatterParser } from "@app/infrastructure/sitemap/FrontmatterParser.ts";
import { PublicationLastModifiedResolver } from "@app/infrastructure/sitemap/PublicationLastModifiedResolver.ts";
import { RepositoryLastModifiedResolver } from "@app/infrastructure/sitemap/RepositoryLastModifiedResolver.ts";
import { GITHUB_USERNAME } from "@app/configuration/author/GitHubUsername.ts";
import { RepositoryConfiguration } from "@app/feature/repository/profile/RepositoryConfiguration.ts";

const PUBLIC_DIRECTORY: string = "public";

const PUBLICATION_DIRECTORY: string = "./source/ui/content/blog";

const SITEMAP_SCOPE: string = "sitemap";

const PORTRAIT_SCOPE: string = "portrait";

if (existsSync(".env")) {
    process.loadEnvFile(".env");
}

const lastModified: Record<string, string> = {
    ...(await new PublicationLastModifiedResolver(
        new FrontmatterParser(),
        PUBLICATION_DIRECTORY,
        new SignaleLogger(SITEMAP_SCOPE)
    ).resolve()),
    ...(await new RepositoryLastModifiedResolver(
        new SignaleLogger(SITEMAP_SCOPE),
        GITHUB_USERNAME,
        new RepositoryConfiguration()
    ).resolve()),
};

const portrait: AstroIntegration = {
    name: "portrait",
    hooks: {
        "astro:build:start": async (): Promise<void> => {
            const stored: string | null = await new PortraitDownloadService(PUBLIC_DIRECTORY).store();

            const logger: SignaleLogger = new SignaleLogger(PORTRAIT_SCOPE);

            if (stored) {
                logger.success(`Read from GitHub, held at public${stored}`);
            } else {
                logger.warn("GitHub did not answer; the page keeps the last picture");
            }
        },
    },
};

export default defineConfig({
    srcDir: "./source/ui",
    publicDir: "./public",
    site: SITE.getWebsite(),
    integrations: [
        portrait,
        react(),
        sitemap({
            filter: (page: string) =>
                !page.includes(`${SITE.getWebsite()}search/`) &&
                !page.includes(`${SITE.getWebsite()}design/`) &&
                !page.endsWith("/releases/latest/") &&
                !page.endsWith(".html"),
            serialize: (entry: SitemapItem) => {
                const lastmod: string = lastModified[new URL(entry.url).pathname];

                return lastmod ? { ...entry, lastmod } : entry;
            },
        }),
    ],
    markdown: {
        shikiConfig: MARKDOWN_STYLING,
    },
    vite: {
        plugins: [tailwindcss()],
        optimizeDeps: {
            exclude: ["@resvg/resvg-js"],
        },
        server: {
            allowedHosts: process.env.DEV_TUNNEL_HOST ? [process.env.DEV_TUNNEL_HOST] : [],
        },
    },
    compressHTML: true,
    scopedStyleStrategy: "where",
});
