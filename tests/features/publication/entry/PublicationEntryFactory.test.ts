import { describe, expect, it } from "vitest";
import type { CollectionEntry } from "astro:content";
import type { PublicationEntry } from "@app/feature/publication/entry/PublicationEntry";
import { PublicationEntryFactory } from "@app/feature/publication/entry/PublicationEntryFactory";
import { PublicationKindResolver } from "@app/feature/publication/entry/PublicationKindResolver";
import { RoutePathResolver } from "@app/util/routing/RoutePathResolver";
import { SlugFormatter } from "@app/util/text/SlugFormatter";

describe("PublicationEntryFactory", () => {
    const routePathResolver: RoutePathResolver = new RoutePathResolver();
    const publicationEntryFactory: PublicationEntryFactory = new PublicationEntryFactory(
        new PublicationKindResolver(new SlugFormatter()),
        routePathResolver
    );
    const publication: CollectionEntry<"blog"> = {
        id: "java-stream-api-insights-and-misconceptions-an-essential-introduction",
        data: {
            title: "Java Stream API: Insights and Misconceptions",
            description: "An essential introduction to the Java Stream API.",
            pubDatetime: new Date("2024-10-29T10:10:00Z"),
            tags: ["java", "stream-api", "white-paper"],
        },
    } as unknown as CollectionEntry<"blog">;

    it("givenAWhitePaper_whenCreating_thenTheEntryHoldsItsTitleYearAndKind", () => {
        const publicationEntry: PublicationEntry = publicationEntryFactory.create(publication);

        expect(publicationEntry.getTitle()).toBe("Java Stream API: Insights and Misconceptions");
        expect(publicationEntry.getNote()).toBe("An essential introduction to the Java Stream API.");
        expect(publicationEntry.getYear()).toBe(2024);
        expect(publicationEntry.getKind()).toBe("White paper");
    });

    it("givenAPublication_whenCreating_thenTheEntryLeadsToItsPage", () => {
        expect(publicationEntryFactory.create(publication).getHref()).toBe(
            routePathResolver.resolvePublication(
                "java-stream-api-insights-and-misconceptions-an-essential-introduction"
            )
        );
    });
});
