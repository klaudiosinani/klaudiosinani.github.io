import { SlugFormatter } from "@app/util/text/SlugFormatter.ts";
import { PublicationConfiguration } from "@app/feature/publication/PublicationConfiguration.ts";
import type { APIRoute } from "astro";
import { type CollectionEntry, getCollection } from "astro:content";
import { SITE } from "@app/configuration/site/Site";

import { PublicationQueryService } from "@app/feature/publication/PublicationQueryService.ts";
import { RoutePathResolver } from "@app/util/routing/RoutePathResolver.ts";

const PUBLICATION_QUERY_SERVICE: PublicationQueryService = new PublicationQueryService(
    new SlugFormatter(),
    new PublicationConfiguration()
);
const ROUTE_PATH_RESOLVER: RoutePathResolver = new RoutePathResolver();

export const GET: APIRoute = async (): Promise<Response> => {
    const publications: CollectionEntry<"blog">[] = await getCollection(
        "blog",
        ({ data }: CollectionEntry<"blog">) => !data.draft
    );

    const feed: Record<string, unknown> = {
        version: "https://jsonfeed.org/version/1.1",
        title: SITE.getTitle(),
        home_page_url: SITE.getWebsite(),
        feed_url: new URL("/feed.json", SITE.getWebsite()).href,
        description: SITE.getDesc(),
        authors: [{ name: SITE.getAuthor(), url: SITE.getWebsite() }],
        language: "en",
        items: PUBLICATION_QUERY_SERVICE.sortByDate(publications).map(({ data, id }: CollectionEntry<"blog">) => ({
            id: new URL(ROUTE_PATH_RESOLVER.resolvePublication(id), SITE.getWebsite()).href,
            url: new URL(ROUTE_PATH_RESOLVER.resolvePublication(id), SITE.getWebsite()).href,
            title: data.title,
            summary: data.description,
            date_published: new Date(data.pubDatetime).toISOString(),
            date_modified: new Date(data.modDatetime ?? data.pubDatetime).toISOString(),
            tags: data.tags,
        })),
    };

    return new Response(JSON.stringify(feed), {
        headers: { "Content-Type": "application/feed+json" },
    });
};
