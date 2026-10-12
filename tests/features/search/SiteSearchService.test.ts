import { describe, expect, it } from "vitest";
import { SiteSearchService } from "@app/feature/search/service/SiteSearchService";
import type { SearchItem } from "@app/feature/search/SearchItem";
import type { SearchResult } from "@app/feature/search/SearchResult";

const item = (title: string, description: string = "A publication"): SearchItem =>
    ({
        title,
        description,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        data: {},
    }) as unknown as SearchItem;

const underTest: SiteSearchService = new SiteSearchService([item("Java Stream API"), item("Singlie Release")]);

describe("SiteSearchService.search", () => {
    it("givenAQueryMatchingATitle_whenSearching_thenThatPublicationIsReturned", () => {
        const results: SearchResult[] = underTest.search("Stream");

        expect(results.map(({ item }: SearchResult) => item.title)).toContain("Java Stream API");
    });

    it("givenAQueryShorterThanTheMinimum_whenSearching_thenNothingIsReturned", () => {
        const results: SearchResult[] = underTest.search("J");

        expect(results).toEqual([]);
    });

    it("givenAnEmptyQuery_whenSearching_thenNothingIsReturned", () => {
        const results: SearchResult[] = underTest.search("");

        expect(results).toEqual([]);
    });

    it("givenAQueryMatchingNothing_whenSearching_thenAnEmptyListIsReturned", () => {
        const results: SearchResult[] = underTest.search("zzzzzzzz");

        expect(results).toEqual([]);
    });
});

describe("SiteSearchService.isQueryable", () => {
    it("givenAQueryAtTheMinimumLength_whenCheckingIfQueryable_thenItIsTrue", () => {
        expect(SiteSearchService.isQueryable("ab")).toBe(true);
    });

    it("givenAQueryBelowTheMinimumLength_whenCheckingIfQueryable_thenItIsFalse", () => {
        expect(SiteSearchService.isQueryable("a")).toBe(false);
    });
});
