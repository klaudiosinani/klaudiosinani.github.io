import { SlugFormatter } from "@app/util/text/SlugFormatter.ts";
import { PublicationConfiguration } from "@app/feature/publication/PublicationConfiguration.ts";
import type { CollectionEntry } from "astro:content";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "@app/configuration/site/Site";

import { PublicationQueryService } from "@app/feature/publication/PublicationQueryService.ts";

const PUBLICATION_QUERY_SERVICE: PublicationQueryService = new PublicationQueryService(
    new SlugFormatter(),
    new PublicationConfiguration()
);

export async function GET(): Promise<Response> {
    const posts: CollectionEntry<"blog">[] = await getCollection("blog");
    const sortedPosts: CollectionEntry<"blog">[] = PUBLICATION_QUERY_SERVICE.sortByDate(posts);
    return rss({
        title: SITE.getTitle(),
        description: SITE.getDesc(),
        site: SITE.getWebsite(),
        items: sortedPosts.map(({ data, id }: CollectionEntry<"blog">) => ({
            link: `publications/${id}/`,
            title: data.title,
            description: data.description,
            pubDate: new Date(data.modDatetime ?? data.pubDatetime),
        })),
    });
}
