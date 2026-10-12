import { describe, expect, it } from "vitest";
import { AUTHOR_PORTRAIT } from "@app/configuration/AuthorPortrait";
import { GITHUB_USERNAME } from "@app/configuration/GitHubUsername";

const underTest: typeof AUTHOR_PORTRAIT = AUTHOR_PORTRAIT;

describe("AUTHOR_PORTRAIT", () => {
    it("givenTheSource_whenRead_thenItIsTheAccountOfTheAuthorOnGitHub", () => {
        expect(underTest.source).toBe(`https://github.com/${GITHUB_USERNAME}.png?size=${underTest.pixels}`);
    });

    it("givenTheName_whenRead_thenTheSiteServesItFromItsOwnHost", () => {
        expect(underTest.name).toMatch(/^[a-z-]+$/);
    });

    it("givenTheEndings_whenRead_thenEachStatesOnePictureType", () => {
        for (const [type, ending] of Object.entries(underTest.endings)) {
            expect(type, ending).toMatch(/^image\/[a-z]+$/);
            expect(ending, type).toMatch(/^[a-z]+$/);
        }
    });

    it("givenTheEndings_whenRead_thenTheTypeGitHubAnswersWithIsAmongThem", () => {
        expect(underTest.endings["image/jpeg"]).toBe("jpg");
    });

    it("givenThePixels_whenRead_thenTheyCoverADenseDisplay", () => {
        expect(underTest.pixels).toBeGreaterThanOrEqual(320);
    });
});
