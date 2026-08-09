import { describe, expect, it } from "vitest";
import { PublicationSearchService } from "@features/search/PublicationSearchService";
import type { SearchItem } from "@features/search/SearchItem";

const item = (title: string, description = "A publication"): SearchItem =>
  ({
    title,
    description,
    slug: title.toLowerCase().replace(/\s+/g, "-"),
    data: {},
  }) as unknown as SearchItem;

const underTest = new PublicationSearchService([
  item("Java Stream API"),
  item("Singlie Release"),
]);

describe("PublicationSearchService.search", () => {
  it("givenAQueryMatchingATitle_whenSearching_thenThatPublicationIsReturned", () => {
    // when
    const results = underTest.search("Stream");

    // then
    expect(results.map(({ item }) => item.title)).toContain("Java Stream API");
  });

  it("givenAQueryShorterThanTheMinimum_whenSearching_thenNothingIsReturned", () => {
    // when
    const results = underTest.search("J");

    // then
    expect(results).toEqual([]);
  });

  it("givenAnEmptyQuery_whenSearching_thenNothingIsReturned", () => {
    // when
    const results = underTest.search("");

    // then
    expect(results).toEqual([]);
  });

  it("givenAQueryMatchingNothing_whenSearching_thenAnEmptyListIsReturned", () => {
    // when
    const results = underTest.search("zzzzzzzz");

    // then
    expect(results).toEqual([]);
  });
});

describe("PublicationSearchService.isQueryable", () => {
  it("givenAQueryAtTheMinimumLength_whenCheckingIfQueryable_thenItIsTrue", () => {
    // then
    expect(PublicationSearchService.isQueryable("ab")).toBe(true);
  });

  it("givenAQueryBelowTheMinimumLength_whenCheckingIfQueryable_thenItIsFalse", () => {
    // then
    expect(PublicationSearchService.isQueryable("a")).toBe(false);
  });
});
