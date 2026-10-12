import { describe, expect, it } from "vitest";
import { SearchQueryUrlResolver } from "@app/feature/search/service/SearchQueryUrlResolver";

const underTest: typeof SearchQueryUrlResolver = SearchQueryUrlResolver;

describe("SearchQueryUrlResolver.query", () => {
    it("givenAQueryString_whenResolvingTheQuery_thenItsValueIsReturned", () => {
        const query: string = underTest.query("?q=astro");

        expect(query).toBe("astro");
    });

    it("givenNoParameter_whenResolvingTheQuery_thenAnEmptyStringIsReturned", () => {
        const query: string = underTest.query("?other=1");

        expect(query).toBe("");
    });

    it("givenAnEmptyQueryString_whenResolvingTheQuery_thenAnEmptyStringIsReturned", () => {
        expect(underTest.query("")).toBe("");
    });
});

describe("SearchQueryUrlResolver.url", () => {
    it("givenAQuery_whenResolvingTheUrl_thenItIsAppendedToThePathname", () => {
        const url: string = underTest.resolve("/search/", "", "astro");

        expect(url).toBe("/search/?q=astro");
    });

    it("givenAnEmptyQuery_whenResolvingTheUrl_thenTheBarePathnameIsReturned", () => {
        const url: string = underTest.resolve("/search/", "?q=astro", "");

        expect(url).toBe("/search/");
    });

    it("givenExistingParameters_whenResolvingTheUrl_thenTheyArePreserved", () => {
        const url: string = underTest.resolve("/search/", "?ref=nav", "astro");

        expect(url).toContain("ref=nav");
        expect(url).toContain("q=astro");
    });

    it("givenAQueryNeedingEscaping_whenResolvingTheUrl_thenItIsEncoded", () => {
        const url: string = underTest.resolve("/search/", "", "a b&c");

        expect(url).toBe("/search/?q=a+b%26c");
    });
});
