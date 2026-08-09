import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { PublicationQueryService } from "@features/publication/PublicationQueryService";
import { SITE } from "@config/site";

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = PublicationQueryService.sortByDate(posts);
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedPosts.map(({ data, slug }) => ({
      link: `publications/${slug}/`,
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
