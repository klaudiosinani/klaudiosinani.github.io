import type { APIRoute } from "astro";

import { OgImageRenderingService } from "@app/infrastructure/render/og/OgImageRenderingService.ts";

const OG_IMAGE_RENDERING_SERVICE: OgImageRenderingService = new OgImageRenderingService();
export const GET: APIRoute = async () =>
    new Response(await OG_IMAGE_RENDERING_SERVICE.renderSite(), {
        headers: { "Content-Type": "image/png" },
    });
