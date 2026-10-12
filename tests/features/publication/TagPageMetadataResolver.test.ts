import { describe, expect, it } from "vitest";
import { TagPageMetadataResolver } from "@app/feature/publication/service/TagPageMetadataResolver";

const underTest: typeof TagPageMetadataResolver = TagPageMetadataResolver;

const AUTHOR: string = "Klaudio Sinani";

const LIMIT: number = 160;

const title = (index: number): string => `A long enough article title, number ${index}`;

describe("TagPageMetadataResolver.resolve", () => {
    it("givenAKeyword_whenResolving_thenTheTitleStatesWhatThePageHolds", () => {
        expect(underTest.resolve("java", AUTHOR, ["One"]).title).toBe("Articles about java");
    });

    it("givenOneArticle_whenResolving_thenTheCountReadsAsASingular", () => {
        expect(underTest.resolve("java", AUTHOR, ["One"]).description).toContain(
            "1 article by Klaudio Sinani about java: One."
        );
    });

    it("givenSeveralArticles_whenResolving_thenTheyAreNamedInTheDescription", () => {
        const { description } = underTest.resolve("linux", AUTHOR, ["First", "Second"]);

        expect(description).toContain("2 articles by Klaudio Sinani about linux: First, Second.");
    });

    it("givenAShortDescription_whenResolving_thenTheSnippetIsFilled", () => {
        const { description } = underTest.resolve("java", AUTHOR, ["One"]);

        expect(description.length).toBeGreaterThanOrEqual(120);
        expect(description.length).toBeLessThanOrEqual(LIMIT);
    });

    it("givenEnoughArticles_whenResolving_thenTheirTitlesFillTheSnippetAlone", () => {
        const { description } = underTest.resolve("linux", AUTHOR, [title(1), title(2), title(3)]);

        expect(description).not.toContain("Read them");
        expect(description.length).toBeLessThanOrEqual(LIMIT);
    });

    it("givenMoreArticlesThanTheSnippetHolds_whenResolving_thenTheRestAreNotNamed", () => {
        const { description } = underTest.resolve("linux", AUTHOR, [1, 2, 3, 4, 5, 6].map(title));

        expect(description.length).toBeLessThanOrEqual(LIMIT);
        expect(description).not.toContain("number 6");
    });

    it("givenADescriptionWithNoRoomLeft_whenResolving_thenNoClosingIsAdded", () => {
        const { description } = underTest.resolve("linux", AUTHOR, ["T".repeat(74)]);

        expect(description).not.toContain("open source practice");
        expect(description.length).toBeLessThanOrEqual(LIMIT);
    });

    it("givenATitleThatOverrunsTheSnippetOnItsOwn_whenResolving_thenTheOpeningStandsAlone", () => {
        const { description } = underTest.resolve("linux", AUTHOR, ["T".repeat(LIMIT)]);

        expect(description).toContain("1 article by Klaudio Sinani about linux.");
        expect(description.length).toBeLessThanOrEqual(LIMIT);
    });
});
