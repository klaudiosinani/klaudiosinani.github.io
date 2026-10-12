import type { APIContext } from "astro";
import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

import { OgImageRenderingService } from "@app/infrastructure/render/og/OgImageRenderingService.ts";
import { SlugFormatter } from "@app/util/text/SlugFormatter.ts";

const OG_IMAGE_RENDERING_SERVICE: OgImageRenderingService = new OgImageRenderingService();
const SLUG_FORMATTER: SlugFormatter = new SlugFormatter();
export async function getStaticPaths() {
    const posts: CollectionEntry<"blog">[] = await getCollection("blog").then((p: CollectionEntry<"blog">[]) =>
        p.filter(({ data }: CollectionEntry<"blog">) => !data.draft && !data.ogImage)
    );

    return posts.map((post: CollectionEntry<"blog">) => ({
        params: { slug: SLUG_FORMATTER.format(post.data.title) },
        props: post,
    }));
}

export const GET: APIRoute = async ({ props }: APIContext) =>
    new Response(await OG_IMAGE_RENDERING_SERVICE.renderPost(props as CollectionEntry<"blog">), {
        headers: { "Content-Type": "image/png" },
    });
