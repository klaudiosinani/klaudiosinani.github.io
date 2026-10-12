import type { APIRoute } from "astro";
import { ROUTES } from "@app/configuration/route/Routes";
import { SITE } from "@app/configuration/site/Site";

const robots: string = `
User-agent: *
Allow: /
Disallow: ${ROUTES.search}/

Sitemap: ${new URL("sitemap-index.xml", SITE.getWebsite()).href}
`.trim();

export const GET: APIRoute = () =>
    new Response(robots, {
        headers: { "Content-Type": "text/plain" },
    });
