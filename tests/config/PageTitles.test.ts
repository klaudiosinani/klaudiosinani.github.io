import { describe, expect, it } from "vitest";
import { PAGE_TITLES } from "@app/configuration/PageTitles";
import type { PageKey } from "@app/configuration/PageKey";
import { PageTitleFormatter } from "@app/util/text/PageTitleFormatter";
import { SITE } from "@app/configuration/Site";

const underTest: Readonly<Record<PageKey, string>> = PAGE_TITLES;

const LIMIT: number = 60;

const SHORTEST: number = 30;

const titles: string[] = Object.values(underTest).map((title: string) => PageTitleFormatter.format(title, SITE.title));

describe("PAGE_TITLES", () => {
    it("givenEveryTitle_whenTheNameOfTheSiteIsAdded_thenItStillFitsAResult", () => {
        for (const title of titles) {
            expect(title.length).toBeLessThanOrEqual(LIMIT);
        }
    });

    it("givenEveryTitle_whenMeasured_thenItUsesTheSpaceAResultGives", () => {
        for (const title of titles) {
            expect(title.length).toBeGreaterThanOrEqual(SHORTEST);
        }
    });

    it("givenEveryTitle_whenComparedWithTheOthers_thenNoTwoPagesShareOne", () => {
        expect(new Set(titles).size).toBe(titles.length);
    });

    it("givenEveryTitle_whenRead_thenItNamesItsSubjectAndNotOnlyThePage", () => {
        for (const title of Object.values(underTest)) {
            expect(title.split(" ").length).toBeGreaterThan(1);
        }
    });
});
