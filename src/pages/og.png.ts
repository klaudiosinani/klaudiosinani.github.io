import type { APIRoute } from "astro";
import { OgImageRenderingService } from "@services/og/OgImageRenderingService";

export const GET: APIRoute = async () =>
  new Response(await OgImageRenderingService.forSite(), {
    headers: { "Content-Type": "image/png" },
  });
