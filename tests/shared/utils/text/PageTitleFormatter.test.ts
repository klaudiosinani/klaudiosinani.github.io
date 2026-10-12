import { describe, expect, it } from "vitest";
import { PageTitleFormatter } from "@app/util/text/PageTitleFormatter";

const underTest: typeof PageTitleFormatter = PageTitleFormatter;

const SITE: string = "Klaudio Sinani";

describe("PageTitleFormatter.format", () => {
    it("givenAShortTitle_whenFormatting_thenTheNameOfTheSiteIsAdded", () => {
        expect(underTest.format("Software", SITE)).toBe("Software - Klaudio Sinani");
    });

    it("givenALongTitle_whenFormatting_thenTheNameOfTheSiteIsLeftOut", () => {
        const title: string = "Ulauncher Theme Synchronizer: Anatomy of a Desktop Aware Extension";

        expect(underTest.format(title, SITE)).toBe(title);
    });

    it("givenATitleThatFillsTheLimitExactly_whenFormatting_thenTheNameIsKept", () => {
        const title: string = "a".repeat(60 - " - Klaudio Sinani".length);

        const formatted: string = underTest.format(title, SITE);

        expect(formatted).toHaveLength(60);
        expect(formatted.endsWith(SITE)).toBe(true);
    });

    it("givenATitleOneCharacterTooLong_whenFormatting_thenTheNameIsDropped", () => {
        const title: string = "a".repeat(60 - " - Klaudio Sinani".length + 1);

        expect(underTest.format(title, SITE)).toBe(title);
    });
});

describe("PageTitleFormatter.format, where the title names the site", () => {
    it("givenATitleThatAlreadyNamesTheSite_whenFormatting_thenTheNameIsNotSaidTwice", () => {
        const title: string = "About Klaudio Sinani, Software Engineer";

        expect(underTest.format(title, SITE)).toBe(title);
    });
});
