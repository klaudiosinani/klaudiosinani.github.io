import { describe, expect, it } from "vitest";
import { SearchQueryUrlResolver } from "@features/search/SearchQueryUrlResolver";

const underTest = SearchQueryUrlResolver;

describe("SearchQueryUrlResolver.query", () => {
  it("givenAQueryString_whenResolvingTheQuery_thenItsValueIsReturned", () => {
    // when
    const query = underTest.query("?q=astro");

    // then
    expect(query).toBe("astro");
  });

  it("givenNoParameter_whenResolvingTheQuery_thenAnEmptyStringIsReturned", () => {
    // when
    const query = underTest.query("?other=1");

    // then
    expect(query).toBe("");
  });

  it("givenAnEmptyQueryString_whenResolvingTheQuery_thenAnEmptyStringIsReturned", () => {
    // then
    expect(underTest.query("")).toBe("");
  });
});

describe("SearchQueryUrlResolver.url", () => {
  it("givenAQuery_whenResolvingTheUrl_thenItIsAppendedToThePathname", () => {
    // when
    const url = underTest.resolve("/search/", "", "astro");

    // then
    expect(url).toBe("/search/?q=astro");
  });

  it("givenAnEmptyQuery_whenResolvingTheUrl_thenTheBarePathnameIsReturned", () => {
    // when
    const url = underTest.resolve("/search/", "?q=astro", "");

    // then
    expect(url).toBe("/search/");
  });

  it("givenExistingParameters_whenResolvingTheUrl_thenTheyArePreserved", () => {
    // when
    const url = underTest.resolve("/search/", "?ref=nav", "astro");

    // then
    expect(url).toContain("ref=nav");
    expect(url).toContain("q=astro");
  });

  it("givenAQueryNeedingEscaping_whenResolvingTheUrl_thenItIsEncoded", () => {
    // when
    const url = underTest.resolve("/search/", "", "a b&c");

    // then
    expect(url).toBe("/search/?q=a+b%26c");
  });
});
