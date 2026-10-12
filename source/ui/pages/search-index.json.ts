import { CONTEXT } from "@app/ApplicationContext.ts";
import { TitleFormatter } from "@app/util/text/TitleFormatter.ts";
import { SlugFormatter } from "@app/util/text/SlugFormatter.ts";
import { RoutePathResolver } from "@app/util/routing/RoutePathResolver.ts";
import { PublicationConfiguration } from "@app/feature/publication/PublicationConfiguration.ts";
import { PressIssueFormatter } from "@app/feature/press/coverage/PressIssueFormatter.ts";
import { NumberFormatter } from "@app/util/text/NumberFormatter.ts";
import { DatetimeFormatter } from "@app/util/datetime/DatetimeFormatter.ts";
import { ContentEntryPublicationFilter } from "@app/infrastructure/content/entry/ContentEntryPublicationFilter.ts";
import { ContentEntryOrderComparator } from "@app/infrastructure/content/entry/ContentEntryOrderComparator.ts";
import { ContentCollectionService } from "@app/infrastructure/content/ContentCollectionService.ts";
import type { APIRoute } from "astro";
import { type CollectionEntry, getCollection } from "astro:content";
import type { FeaturedPress } from "@app/feature/press/coverage/FeaturedPress";
import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import type { SearchItem } from "@app/feature/search/item/SearchItem";

import { FeaturedPressRetrievalService } from "@app/feature/press/FeaturedPressRetrievalService.ts";
import { PublicationQueryService } from "@app/feature/publication/PublicationQueryService.ts";
import { GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE as GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE_KEY } from "@bindings";
import { SearchIndexFactory } from "@app/feature/search/item/SearchIndexFactory.ts";

const FEATURED_PRESS_RETRIEVAL_SERVICE: FeaturedPressRetrievalService = new FeaturedPressRetrievalService(
    new ContentCollectionService(new ContentEntryPublicationFilter(), new ContentEntryOrderComparator())
);
const PUBLICATION_QUERY_SERVICE: PublicationQueryService = new PublicationQueryService(
    new SlugFormatter(),
    new PublicationConfiguration()
);
const GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE = CONTEXT.resolve(GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE_KEY);
const SEARCH_INDEX_FACTORY: SearchIndexFactory = new SearchIndexFactory(
    new DatetimeFormatter(),
    new NumberFormatter(),
    new PressIssueFormatter(),
    new RoutePathResolver(),
    new TitleFormatter()
);

export const GET: APIRoute = async (): Promise<Response> => {
    const publications: CollectionEntry<"blog">[] = await getCollection(
        "blog",
        ({ data }: CollectionEntry<"blog">) => !data.draft
    );
    const repositories: GithubRepositoryData[] = await GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE.retrieve();
    const features: FeaturedPress[] = await FEATURED_PRESS_RETRIEVAL_SERVICE.retrieve();

    const items: SearchItem[] = SEARCH_INDEX_FACTORY.create(
        PUBLICATION_QUERY_SERVICE.sortByDate(publications),
        repositories,
        features
    );

    return new Response(JSON.stringify(items), {
        headers: { "Content-Type": "application/json" },
    });
};
