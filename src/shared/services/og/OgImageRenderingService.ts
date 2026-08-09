import { Resvg } from "@resvg/resvg-js";
import type { CollectionEntry } from "astro:content";
import postOgImage from "./templates/post";
import siteOgImage from "./templates/site";

export class OgImageRenderingService {
  public static async forPost(
    post: CollectionEntry<"blog">
  ): Promise<Uint8Array<ArrayBuffer>> {
    return OgImageRenderingService.toPng(await postOgImage(post));
  }

  public static async forSite(): Promise<Uint8Array<ArrayBuffer>> {
    return OgImageRenderingService.toPng(await siteOgImage());
  }

  private static toPng(svg: string): Uint8Array<ArrayBuffer> {
    return new Uint8Array(new Resvg(svg).render().asPng());
  }
}
