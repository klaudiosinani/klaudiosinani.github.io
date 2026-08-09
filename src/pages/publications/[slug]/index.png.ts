import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { OgImageRenderingService } from "@services/og/OgImageRenderingService";
import { SlugFormatter } from "@utils/text/SlugFormatter";

export async function getStaticPaths() {
  const posts = await getCollection("blog").then(p =>
    p.filter(({ data }) => !data.draft && !data.ogImage)
  );

  return posts.map(post => ({
    params: { slug: SlugFormatter.format(post.data.title) },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(
    await OgImageRenderingService.forPost(props as CollectionEntry<"blog">),
    {
      headers: { "Content-Type": "image/png" },
    }
  );
