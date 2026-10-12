import type { DatetimeFormatter } from "@app/util/datetime/DatetimeFormatter";
import type { NumberFormatter } from "@app/util/text/NumberFormatter";
import type { PressIssueFormatter } from "@app/feature/press/coverage/PressIssueFormatter";
import type { RoutePathResolver } from "@app/util/routing/RoutePathResolver";
import type { TitleFormatter } from "@app/util/text/TitleFormatter";
import type { CollectionEntry } from "astro:content";
import type { FeaturedPress } from "@app/feature/press/coverage/FeaturedPress";
import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import type { SearchItem } from "./SearchItem";

export class SearchIndexFactory {
    private readonly datetimeFormatter: DatetimeFormatter;
    private readonly numberFormatter: NumberFormatter;
    private readonly pressIssueFormatter: PressIssueFormatter;
    private readonly routePathResolver: RoutePathResolver;
    private readonly titleFormatter: TitleFormatter;

    public constructor(
        datetimeFormatter: DatetimeFormatter,
        numberFormatter: NumberFormatter,
        pressIssueFormatter: PressIssueFormatter,
        routePathResolver: RoutePathResolver,
        titleFormatter: TitleFormatter
    ) {
        this.datetimeFormatter = datetimeFormatter;
        this.numberFormatter = numberFormatter;
        this.pressIssueFormatter = pressIssueFormatter;
        this.routePathResolver = routePathResolver;
        this.titleFormatter = titleFormatter;
    }
    public create(
        publications: readonly CollectionEntry<"blog">[],
        repositories: readonly GithubRepositoryData[],
        features: readonly FeaturedPress[]
    ): SearchItem[] {
        return [
            ...repositories.map((repository: GithubRepositoryData): SearchItem => ({
                kind: "software",
                title: this.titleFormatter.format(repository.getName()),
                description: repository.getDescription(),
                href: this.routePathResolver.resolveRepository(repository.getName()),
                keywords: [repository.getLanguage(), ...repository.getTopics()].filter(Boolean) as string[],
                meta: [`${this.numberFormatter.display(repository.getStars())} stars`],
                language: repository.getLanguage(),
            })),
            ...publications.map(({ data, id }: CollectionEntry<"blog">): SearchItem => ({
                kind: "publication",
                title: data.title,
                description: data.description,
                href: this.routePathResolver.resolvePublication(id),
                keywords: [...data.tags],
                meta: [this.datetimeFormatter.formatDate(data.pubDatetime.toISOString())],
                language: null,
            })),
            ...features.map((feature: FeaturedPress): SearchItem => ({
                kind: "press",
                title: feature.publicationTitle,
                description: feature.summary,
                href: feature.publicationUrl,
                keywords: [feature.publisherName, feature.softwareTitle].filter(Boolean),
                meta: [feature.publisherName, this.pressIssueFormatter.format(feature.issueNumber)].filter(Boolean),
                language: null,
            })),
        ];
    }
}
