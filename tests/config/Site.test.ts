import { describe, expect, it } from "vitest";
import { SITE } from "@app/configuration/Site";

import type { SiteMetadata } from "@app/configuration/SiteMetadata";
const underTest: SiteMetadata = SITE;

const TITLE_LIMIT: number = 60;

const LONGEST_PAGE_NAME: string = "All Software";

describe("SITE.homeTitle", () => {
    it("givenTheHomeTitle_whenMeasured_thenASearchEngineShowsAllOfIt", () => {
        expect(underTest.homeTitle.length).toBeLessThanOrEqual(TITLE_LIMIT);
        expect(underTest.homeTitle.length).toBeGreaterThan(underTest.title.length);
    });

    it("givenTheHomeTitle_whenRead_thenItNamesThePersonFirst", () => {
        expect(underTest.homeTitle.startsWith(underTest.title)).toBe(true);
    });
});

describe("SITE.title", () => {
    it("givenTheSuffix_whenAddedToTheLongestPageName_thenTheTitleStillFits", () => {
        const longest: string = `${LONGEST_PAGE_NAME} - ${underTest.title}`;

        expect(longest.length).toBeLessThanOrEqual(TITLE_LIMIT);
    });
});

describe("SITE.desc", () => {
    it("givenTheDescription_whenMeasured_thenItFitsTheSnippetASearchEngineShows", () => {
        expect(underTest.desc.length).toBeGreaterThanOrEqual(120);
        expect(underTest.desc.length).toBeLessThanOrEqual(165);
    });

    it("givenTheDescription_whenRead_thenItIsASentenceAndNotAListOfWords", () => {
        expect(underTest.desc.endsWith(".")).toBe(true);
        expect(underTest.desc.split(" ").length).toBeGreaterThan(10);
    });
});

describe("SITE.ogImage", () => {
    it("givenTheShareImage_whenNamed_thenItIsTheGeneratedCard", () => {
        expect(underTest.ogImage).toBe("og.png");
    });
});
