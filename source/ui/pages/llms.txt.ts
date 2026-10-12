import { CONTEXT } from "@app/ApplicationContext.ts";
import { SlugFormatter } from "@app/util/text/SlugFormatter.ts";
import { PublicationConfiguration } from "@app/feature/publication/PublicationConfiguration.ts";
import { ContentEntryPublicationFilter } from "@app/infrastructure/content/entry/ContentEntryPublicationFilter.ts";
import { ContentEntryOrderComparator } from "@app/infrastructure/content/entry/ContentEntryOrderComparator.ts";
import { ContentCollectionService } from "@app/infrastructure/content/ContentCollectionService.ts";
import type { APIRoute } from "astro";
import { type CollectionEntry, getCollection } from "astro:content";
import type { FeaturedPress } from "@app/feature/press/coverage/FeaturedPress";
import { PAGE_DESCRIPTIONS } from "@app/configuration/page/PageDescriptions";
import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import { ROUTES } from "@app/configuration/route/Routes";
import { SITE } from "@app/configuration/site/Site";

import { FeaturedPressRetrievalService } from "@app/feature/press/FeaturedPressRetrievalService.ts";
import { PublicationQueryService } from "@app/feature/publication/PublicationQueryService.ts";
import { GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE as GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE_KEY } from "@bindings";
import { RoutePathResolver } from "@app/util/routing/RoutePathResolver.ts";
import { MarkdownLinkFormatter } from "@app/util/text/MarkdownLinkFormatter.ts";
import { TitleFormatter } from "@app/util/text/TitleFormatter.ts";

const FEATURED_PRESS_RETRIEVAL_SERVICE: FeaturedPressRetrievalService = new FeaturedPressRetrievalService(
    new ContentCollectionService(new ContentEntryPublicationFilter(), new ContentEntryOrderComparator())
);
const PUBLICATION_QUERY_SERVICE: PublicationQueryService = new PublicationQueryService(
    new SlugFormatter(),
    new PublicationConfiguration()
);
const GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE = CONTEXT.resolve(GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE_KEY);
const ROUTE_PATH_RESOLVER: RoutePathResolver = new RoutePathResolver();
const MARKDOWN_LINK_FORMATTER: MarkdownLinkFormatter = new MarkdownLinkFormatter();
const TITLE_FORMATTER: TitleFormatter = new TitleFormatter();
export const GET: APIRoute = async (): Promise<Response> => {
    const [publications, repositories, features] = await Promise.all([
        getCollection("blog", ({ data }: CollectionEntry<"blog">) => !data.draft),
        GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE.retrieve(),
        FEATURED_PRESS_RETRIEVAL_SERVICE.retrieve(),
    ]);

    const body: string = [
        `# ${SITE.getTitle()}`,
        "",
        `> ${SITE.getDesc()}`,
        "",
        "## Pages",
        "",
        MARKDOWN_LINK_FORMATTER.entry("Activity", `${ROUTES.activity}/`, PAGE_DESCRIPTIONS.activity),
        MARKDOWN_LINK_FORMATTER.entry("Software", `${ROUTES.software}/`, PAGE_DESCRIPTIONS.software),
        MARKDOWN_LINK_FORMATTER.entry("Publications", `${ROUTES.publications}/`, PAGE_DESCRIPTIONS.publications),
        MARKDOWN_LINK_FORMATTER.entry("Press", `${ROUTES.press}/`, PAGE_DESCRIPTIONS.press),
        MARKDOWN_LINK_FORMATTER.entry("About", `${ROUTES.about}/`, PAGE_DESCRIPTIONS.about),
        MARKDOWN_LINK_FORMATTER.entry("Releases", "/releases/", "Every release of every project, newest first."),
        "",
        "## Projects",
        "",
        ...repositories.map((repository: GithubRepositoryData) =>
            MARKDOWN_LINK_FORMATTER.entry(
                TITLE_FORMATTER.format(repository.getName()),
                ROUTE_PATH_RESOLVER.resolveRepository(repository.getName()),
                repository.getDescription()
            )
        ),
        "",
        "## Articles",
        "",
        ...PUBLICATION_QUERY_SERVICE.sortByDate(publications).map(({ data, id }: CollectionEntry<"blog">) =>
            MARKDOWN_LINK_FORMATTER.entry(data.title, ROUTE_PATH_RESOLVER.resolvePublication(id), data.description)
        ),
        "",
        "## In the press",
        "",
        ...features.map(
            (feature: FeaturedPress) =>
                `- [${feature.publicationTitle}](${feature.publicationUrl}): ${feature.publisherName}. ${feature.summary}`
        ),
        "",
    ].join("\n");

    return new Response(body, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
};
